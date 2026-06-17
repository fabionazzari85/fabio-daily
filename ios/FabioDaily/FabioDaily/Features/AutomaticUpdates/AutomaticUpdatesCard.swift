import SwiftData
import SwiftUI

struct AutomaticUpdatesCard: View {
    @Bindable var healthKitService: HealthKitService
    @Bindable var calendarService: CalendarService
    @Environment(\.modelContext) private var modelContext
    @Query private var syncStatuses: [HealthSyncStatusModel]
    @Query private var dailySummaries: [HealthDailySummaryModel]
    @Query private var importedWorkouts: [HealthWorkoutImportModel]
    @Query(sort: \WeightEntryModel.measuredAt, order: .reverse) private var weights: [WeightEntryModel]
    @Query private var calendarStatuses: [CalendarSyncStatusModel]
    @Query private var calendarSignals: [CalendarDaySignalModel]
    @Query private var calendarEvents: [CalendarEventImportModel]

    var body: some View {
        let todayKey = DateKeys.dayKey(Date())
        let status = syncStatuses.first
        let summary = dailySummaries.first { $0.dateKey == todayKey }
        let todayWorkouts = importedWorkouts.filter { $0.dateKey == todayKey }
        let healthWeight = weights.first { $0.source != .manual }
        let calendarStatus = calendarStatuses.first
        let todayCalendarSignal = calendarSignals.first { $0.dateKey == todayKey }
        let todayCalendarEvents = calendarEvents.filter { $0.dateKey == todayKey }

        FDCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Aggiornamenti automatici")
                    .font(.title3.weight(.bold))
                Text("Fabio Daily può leggere Apple Health e Calendario per suggerire la giornata. Le scelte manuali restano sempre prioritarie.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)

                Text("Apple Health")
                    .font(.headline)
                    .padding(.top, 4)
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
                if let message = healthKitService.lastMessage, !message.isEmpty {
                    Text(message)
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.secondary)
                }

                PrimaryButton(title: "Collega Apple Health") {
                    Task { await healthKitService.requestAuthorization(modelContext: modelContext) }
                }
                SecondaryButton(title: healthKitService.isSyncing ? "Sincronizzazione..." : "Sincronizza Apple Health") {
                    Task { await healthKitService.syncNow(modelContext: modelContext) }
                }
                Text("Apple Health non è attivo o non restituisce dati? Puoi continuare a usare Fabio Daily manualmente.")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                Divider()
                    .padding(.vertical, 4)

                Text("Calendario")
                    .font(.headline)
                Text("Il calendario viene letto solo per suggerire segnali come trasferta, cena fuori, giornata intensa o finestra workout. Fabio Daily non crea né modifica eventi.")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                VStack(alignment: .leading, spacing: 6) {
                    statusRow("Stato Calendario", value: calendarStatus?.authorizationStatus.label ?? CalendarPermissionState.notConfigured.label)
                    statusRow("Ultimo sync", value: calendarStatus?.lastSyncAt.map { $0.formatted(date: .abbreviated, time: .shortened) } ?? "mai")
                    statusRow("Eventi letti oggi", value: "\(calendarStatus?.eventsReadToday ?? todayCalendarEvents.count)")
                    statusRow("Segnale luogo", value: todayCalendarSignal?.suggestedLocation?.label ?? "n/d")
                    statusRow("Cena fuori", value: todayCalendarSignal?.dinnerOutLikely == true ? "probabile" : "no")
                    statusRow("Giornata intensa", value: todayCalendarSignal?.intenseDayLikely == true ? "probabile" : "no")
                }

                if let explanation = todayCalendarSignal?.explanation {
                    Text(explanation)
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.secondary)
                }

                if let error = calendarStatus?.lastErrorMessage, !error.isEmpty {
                    Text(error)
                        .font(.caption)
                        .foregroundStyle(.red)
                }

                PrimaryButton(title: "Collega Calendario") {
                    Task { await calendarService.requestAuthorization(modelContext: modelContext) }
                }
                SecondaryButton(title: calendarService.isSyncing ? "Sincronizzazione..." : "Sincronizza Calendario") {
                    Task { await calendarService.syncNow(modelContext: modelContext) }
                }
                Text("Calendario non attivo o vuoto? L’app resta utilizzabile con impostazione manuale della giornata.")
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
