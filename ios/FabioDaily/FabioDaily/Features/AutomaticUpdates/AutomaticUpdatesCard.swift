import SwiftData
import SwiftUI

struct AutomaticUpdatesCard: View {
    @Bindable var healthKitService: HealthKitService
    @Environment(\.modelContext) private var modelContext
    @Query private var syncStatuses: [HealthSyncStatusModel]
    @Query private var dailySummaries: [HealthDailySummaryModel]
    @Query private var importedWorkouts: [HealthWorkoutImportModel]
    @Query(sort: \WeightEntryModel.measuredAt, order: .reverse) private var weights: [WeightEntryModel]

    var body: some View {
        let todayKey = DateKeys.dayKey(Date())
        let status = syncStatuses.first
        let summary = dailySummaries.first { $0.dateKey == todayKey }
        let todayWorkouts = importedWorkouts.filter { $0.dateKey == todayKey }
        let healthWeight = weights.first { $0.source != .manual }

        FDCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Aggiornamenti automatici")
                    .font(.title3.weight(.bold))
                Text("Fabio Daily legge workout, passi, calorie attive e peso da Apple Health per aggiornare automaticamente la Home. Le calorie attività non vengono aggiunte al budget alimentare. Puoi continuare a usare l’app anche manualmente.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                Text("Il peso può essere importato da Apple Health, anche se arriva da una bilancia smart come Withings. Puoi sempre inserirlo manualmente.")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                VStack(alignment: .leading, spacing: 6) {
                    statusRow("Apple Health", value: status?.authorizationStatus.label ?? HealthPermissionState.notConfigured.label)
                    statusRow("Ultimo sync", value: status?.lastSyncAt.map { $0.formatted(date: .abbreviated, time: .shortened) } ?? "mai")
                    statusRow("Workout importati oggi", value: "\(todayWorkouts.count)")
                    statusRow("Passi oggi", value: summary?.steps.map(String.init) ?? "n/d")
                    statusRow("Kcal attive oggi", value: summary?.activeEnergyKcal.map { "\(Int($0)) kcal" } ?? "n/d")
                    statusRow("Distanza oggi", value: summary?.walkingRunningDistanceKm.map { "\($0.oneDecimal) km" } ?? "n/d")
                    statusRow("Peso Apple Health", value: healthWeight.map { "\($0.weightKg.oneDecimal) kg" } ?? "n/d")
                    statusRow("Origine peso", value: healthWeight?.sourceName ?? "n/d")
                }

                if let error = status?.lastErrorMessage, !error.isEmpty {
                    Text(error)
                        .font(.caption)
                        .foregroundStyle(.red)
                }

                PrimaryButton(title: "Collega Apple Health") {
                    Task { await healthKitService.requestAuthorization(modelContext: modelContext) }
                }
                SecondaryButton(title: healthKitService.isSyncing ? "Sincronizzazione..." : "Sincronizza ora") {
                    Task { await healthKitService.syncNow(modelContext: modelContext) }
                }
                Text("Apple Health non è attivo o non restituisce dati? Puoi continuare a usare Fabio Daily manualmente.")
                    .font(.caption)
                    .foregroundStyle(.secondary)
            }
        }
    }

    private func statusRow(_ label: String, value: String) -> some View {
        HStack {
            Text(label)
            Spacer()
            Text(value)
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
        }
    }
}
