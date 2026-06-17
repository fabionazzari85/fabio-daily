import Foundation
import HealthKit
import SwiftData

@MainActor
@Observable
final class HealthKitService {
    var isSyncing = false
    var lastMessage: String?

    private let healthStore = HKHealthStore()

    var isAvailable: Bool {
        HKHealthStore.isHealthDataAvailable()
    }

    private var readTypes: Set<HKObjectType> {
        var types = Set<HKObjectType>()
        types.insert(HKObjectType.workoutType())
        if let activeEnergy = HKObjectType.quantityType(forIdentifier: .activeEnergyBurned) { types.insert(activeEnergy) }
        if let steps = HKObjectType.quantityType(forIdentifier: .stepCount) { types.insert(steps) }
        if let distance = HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning) { types.insert(distance) }
        if let bodyMass = HKObjectType.quantityType(forIdentifier: .bodyMass) { types.insert(bodyMass) }
        return types
    }

    func requestAuthorization(modelContext: ModelContext) async {
        guard isAvailable else {
            upsertStatus(.denied, modelContext: modelContext, error: "HealthKit non disponibile su questo dispositivo.")
            return
        }

        upsertStatus(.requested, modelContext: modelContext)

        do {
            try await healthStore.requestAuthorization(toShare: [], read: readTypes)
            upsertStatus(.active, modelContext: modelContext)
            lastMessage = "Apple Health collegato."
            await syncNow(modelContext: modelContext)
        } catch {
            upsertStatus(.error, modelContext: modelContext, error: error.localizedDescription)
            lastMessage = error.localizedDescription
        }
    }

    func syncNow(modelContext: ModelContext) async {
        guard isAvailable else {
            upsertStatus(.denied, modelContext: modelContext, error: "Apple Health non è disponibile. Puoi continuare manualmente.")
            return
        }

        isSyncing = true
        defer { isSyncing = false }

        do {
            let today = Date()
            try await syncDailyActivity(for: today, modelContext: modelContext)
            try await syncWorkouts(since: Calendar.current.date(byAdding: .day, value: -7, to: today) ?? today, modelContext: modelContext)
            let bodyWeightResult = try await syncBodyWeightFromHealth(since: Calendar.current.date(byAdding: .month, value: -24, to: today) ?? today, modelContext: modelContext)
            upsertStatus(.active, modelContext: modelContext)
            if bodyWeightResult.samplesFound == 0 {
                lastMessage = "Sync completata. Nessun peso trovato in Apple Health negli ultimi 24 mesi: controlla che Peso sia autorizzato in Salute."
            } else if bodyWeightResult.inserted == 0 {
                lastMessage = "Sync completata. Peso Apple Health già presente, nessun duplicato aggiunto."
            } else {
                lastMessage = "Sync completata. Importati \(bodyWeightResult.inserted) pesi da Apple Health."
            }
        } catch {
            upsertStatus(.error, modelContext: modelContext, error: error.localizedDescription)
            lastMessage = error.localizedDescription
        }
    }

    func syncBodyWeightFromHealth(since startDate: Date, modelContext: ModelContext) async throws -> BodyWeightImportResult {
        guard let bodyMassType = HKObjectType.quantityType(forIdentifier: .bodyMass) else {
            return BodyWeightImportResult(samplesFound: 0, inserted: 0)
        }
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: Date(), options: [])
        let sort = SortDescriptor(\HKQuantitySample.startDate, order: .reverse)
        let descriptor = HKSampleQueryDescriptor(predicates: [.quantitySample(type: bodyMassType, predicate: predicate)], sortDescriptors: [sort], limit: HKObjectQueryNoLimit)
        let samples = try await descriptor.result(for: healthStore)

        var knownWeights = fetchWeights(modelContext)
        var inserted = 0

        for sample in samples {
            let uuid = sample.uuid.uuidString
            let weightKg = sample.quantity.doubleValue(for: HKUnit.gramUnit(with: .kilo))
            let sourceName = sample.sourceRevision.source.name
            let sourceBundleId = sample.sourceRevision.source.bundleIdentifier

            if knownWeights.contains(where: { $0.healthKitUUID == uuid }) { continue }
            if knownWeights.contains(where: { abs($0.measuredAt.timeIntervalSince(sample.startDate)) < 1 && abs($0.weightKg - weightKg) < 0.05 && $0.sourceName == sourceName }) { continue }

            let source = sourceName.localizedCaseInsensitiveContains("withings") || sourceBundleId.localizedCaseInsensitiveContains("withings")
                ? ImportedDataSource.withingsViaAppleHealth
                : ImportedDataSource.appleHealth

            let entry = WeightEntryModel(
                id: "health-\(uuid)",
                dateKey: DateKeys.dayKey(sample.startDate),
                measuredAt: sample.startDate,
                weightKg: weightKg,
                note: "Peso importato da Apple Health",
                source: source,
                sourceName: sourceName,
                sourceBundleId: sourceBundleId,
                healthKitUUID: uuid
            )
            modelContext.insert(entry)
            knownWeights.append(entry)
            inserted += 1
        }

        return BodyWeightImportResult(samplesFound: samples.count, inserted: inserted)
    }

    private func syncWorkouts(since startDate: Date, modelContext: ModelContext) async throws {
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: Date(), options: [])
        let sort = SortDescriptor(\HKWorkout.startDate, order: .reverse)
        let descriptor = HKSampleQueryDescriptor(predicates: [.workout(predicate)], sortDescriptors: [sort], limit: HKObjectQueryNoLimit)
        let workouts = try await descriptor.result(for: healthStore)
        let existing = fetchHealthWorkouts(modelContext)

        for workout in workouts where !existing.contains(where: { $0.healthKitUUID == workout.uuid.uuidString }) {
            let activeCalories = workout.totalEnergyBurned?.doubleValue(for: HKUnit.kilocalorie())
            let distanceKm = workout.totalDistance?.doubleValue(for: HKUnit.meterUnit(with: .kilo))
            modelContext.insert(HealthWorkoutImportModel(
                healthKitUUID: workout.uuid.uuidString,
                startDate: workout.startDate,
                endDate: workout.endDate,
                workoutType: workout.workoutActivityType.fabioLabel,
                durationMinutes: workout.duration / 60,
                activeCalories: activeCalories,
                distanceKm: distanceKm,
                sourceName: workout.sourceRevision.source.name,
                sourceBundleId: workout.sourceRevision.source.bundleIdentifier
            ))
        }
    }

    private func syncDailyActivity(for date: Date, modelContext: ModelContext) async throws {
        async let steps = quantitySum(.stepCount, date: date, unit: .count())
        async let energy = quantitySum(.activeEnergyBurned, date: date, unit: .kilocalorie())
        async let distance = quantitySum(.distanceWalkingRunning, date: date, unit: .meterUnit(with: .kilo))

        let summary = HealthDailySummaryModel(
            date: date,
            steps: Int(try await steps),
            activeEnergyKcal: try await energy,
            walkingRunningDistanceKm: try await distance
        )

        if let existing = fetchDailySummaries(modelContext).first(where: { $0.dateKey == summary.dateKey }) {
            existing.steps = summary.steps
            existing.activeEnergyKcal = summary.activeEnergyKcal
            existing.walkingRunningDistanceKm = summary.walkingRunningDistanceKm
            existing.importedAt = Date()
        } else {
            modelContext.insert(summary)
        }
    }

    private func quantitySum(_ identifier: HKQuantityTypeIdentifier, date: Date, unit: HKUnit) async throws -> Double {
        guard let type = HKObjectType.quantityType(forIdentifier: identifier) else { return 0 }
        let interval = Calendar.current.dateInterval(of: .day, for: date) ?? DateInterval(start: date, duration: 86400)
        let predicate = HKQuery.predicateForSamples(withStart: interval.start, end: interval.end, options: [.strictStartDate])
        let descriptor = HKStatisticsQueryDescriptor(predicate: .quantitySample(type: type, predicate: predicate), options: .cumulativeSum)
        let stats = try await descriptor.result(for: healthStore)
        return stats?.sumQuantity()?.doubleValue(for: unit) ?? 0
    }

    private func upsertStatus(_ state: HealthPermissionState, modelContext: ModelContext, error: String? = nil) {
        if let existing = fetchSyncStatuses(modelContext).first {
            existing.authorizationStatusRaw = state.rawValue
            existing.lastSyncAt = Date()
            existing.lastErrorMessage = error
            existing.healthKitAvailable = isAvailable
            existing.updatedAt = Date()
        } else {
            modelContext.insert(HealthSyncStatusModel(authorizationStatus: state, lastSyncAt: Date(), lastErrorMessage: error, healthKitAvailable: isAvailable))
        }
    }

    private func fetchWeights(_ modelContext: ModelContext) -> [WeightEntryModel] {
        (try? modelContext.fetch(FetchDescriptor<WeightEntryModel>())) ?? []
    }

    private func fetchHealthWorkouts(_ modelContext: ModelContext) -> [HealthWorkoutImportModel] {
        (try? modelContext.fetch(FetchDescriptor<HealthWorkoutImportModel>())) ?? []
    }

    private func fetchDailySummaries(_ modelContext: ModelContext) -> [HealthDailySummaryModel] {
        (try? modelContext.fetch(FetchDescriptor<HealthDailySummaryModel>())) ?? []
    }

    private func fetchSyncStatuses(_ modelContext: ModelContext) -> [HealthSyncStatusModel] {
        (try? modelContext.fetch(FetchDescriptor<HealthSyncStatusModel>())) ?? []
    }
}

struct BodyWeightImportResult {
    let samplesFound: Int
    let inserted: Int
}

private extension HKWorkoutActivityType {
    var fabioLabel: String {
        switch self {
        case .walking: "Camminata"
        case .running: "Corsa"
        case .traditionalStrengthTraining: "Forza"
        case .functionalStrengthTraining: "Forza funzionale"
        case .flexibility: "Mobilità"
        case .cycling: "Bici"
        default: "Workout"
        }
    }
}
