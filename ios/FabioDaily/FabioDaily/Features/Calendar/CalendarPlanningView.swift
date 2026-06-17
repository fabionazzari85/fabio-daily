import SwiftData
import SwiftUI

struct CalendarPlanningView: View {
    @Environment(AppState.self) private var appState
    @Environment(\.modelContext) private var modelContext
    @Query private var dayContexts: [DayContextModel]
    @Query private var calendarSignals: [CalendarDaySignalModel]
    @Query(sort: \CalendarEventImportModel.startDate) private var calendarEvents: [CalendarEventImportModel]

    @State private var selectedDate = Date()
    @State private var location: DayLocation = .home
    @State private var family: DayFamily = .unset
    @State private var breakfastOut = false
    @State private var lunchOut = false
    @State private var dinnerOut = false
    @State private var aperitif = false
    @State private var skippedWorkout = false
    @State private var recoveryDay = false
    @State private var travelStartsAfterLunch = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    FDCard {
                        Text("Calendario")
                            .font(.title2.weight(.bold))
                        Text("Pianifica in anticipo casa, trasferte, Edoardo e pasti fuori. Le scelte manuali salvate qui vincono sui suggerimenti automatici.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }

                    FDCard {
                        DatePicker("Giorno", selection: $selectedDate, displayedComponents: .date)
                            .datePickerStyle(.graphical)
                    }

                    selectedDayCard
                    appointmentsCard
                    editorCard
                    upcomingDaysCard
                }
                .padding()
            }
            .navigationTitle("Calendario")
            .onAppear(perform: loadSelectedDay)
            .onChange(of: selectedDate) { _, _ in loadSelectedDay() }
        }
    }

    private var selectedDayCard: some View {
        FDCard {
            VStack(alignment: .leading, spacing: 8) {
                Text(selectedDate.formatted(date: .complete, time: .omitted))
                    .font(.title3.weight(.bold))

                if let context = existingContext {
                    Text(summary(for: context))
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.green)
                } else {
                    Text("Nessuna scelta manuale salvata per questo giorno.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }

                if let signal = selectedSignal {
                    Text(signal.explanation ?? "Segnale calendario disponibile.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                    Text("Suggerimento: \(signal.suggestedLocation?.label ?? "n/d")\(signal.dinnerOutLikely ? " · cena fuori probabile" : "")")
                        .font(.caption.weight(.semibold))
                } else {
                    Text("Se il calendario Apple viene sincronizzato, qui appariranno anche i segnali automatici disponibili.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
        }
    }

    private var editorCard: some View {
        FDCard {
            VStack(alignment: .leading, spacing: 12) {
                Text("Imposta giornata")
                    .font(.headline)

                Picker("Luogo", selection: $location) {
                    ForEach(DayLocation.allCases) { Text($0.label).tag($0) }
                }
                .pickerStyle(.inline)

                Picker("Famiglia", selection: $family) {
                    ForEach(DayFamily.allCases) { Text($0.label).tag($0) }
                }
                .pickerStyle(.inline)

                Toggle("Partenza dopo pranzo", isOn: $travelStartsAfterLunch)
                Toggle("Colazione fuori", isOn: $breakfastOut)
                Toggle("Pranzo fuori", isOn: $lunchOut)
                Toggle("Cena fuori", isOn: $dinnerOut)
                Toggle("Aperitivo / gin tonic", isOn: $aperitif)
                Toggle("Allenamento saltato", isOn: $skippedWorkout)
                Toggle("Giorno recupero", isOn: $recoveryDay)

                Text("Esempio: consulenza con partenza domenica pomeriggio = Trasferta + Partenza dopo pranzo. Colazione e pranzo restano normali; metti Cena fuori se mangi fuori la sera.")
                    .font(.caption)
                    .foregroundStyle(.secondary)

                PrimaryButton(title: "Salva giorno") {
                    saveSelectedDay()
                }

                if existingContext != nil {
                    Button("Reset giorno", role: .destructive) {
                        resetSelectedDay()
                    }
                    .buttonStyle(.bordered)
                }
            }
        }
    }

    private var appointmentsCard: some View {
        FDCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Appuntamenti del giorno")
                    .font(.headline)
                SecondaryButton(title: appState.calendarService.isSyncing ? "Sincronizzazione..." : "Sincronizza Calendario") {
                    Task { await appState.calendarService.syncNow(modelContext: modelContext) }
                }
                .disabled(appState.calendarService.isSyncing)
                if selectedEvents.isEmpty {
                    Text("Nessun appuntamento importato per questo giorno. Sincronizza il calendario da Aggiornamenti automatici se mancano eventi.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(selectedEvents) { event in
                        VStack(alignment: .leading, spacing: 4) {
                            Text(event.title)
                                .font(.subheadline.weight(.semibold))
                            Text(eventTime(event))
                                .font(.caption)
                                .foregroundStyle(.secondary)
                            if let location = event.eventLocation, !location.isEmpty {
                                Text(location)
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                        Divider()
                    }
                }
            }
        }
    }

    private var upcomingDaysCard: some View {
        FDCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Prossimi 14 giorni")
                    .font(.headline)
                ForEach(upcomingDates, id: \.self) { date in
                    Button {
                        selectedDate = date
                    } label: {
                        HStack(alignment: .top) {
                            VStack(alignment: .leading, spacing: 3) {
                                Text(date.formatted(date: .abbreviated, time: .omitted))
                                    .font(.subheadline.weight(.semibold))
                                Text(summaryText(for: date))
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                            Spacer()
                            Image(systemName: "chevron.right")
                                .font(.caption.weight(.semibold))
                                .foregroundStyle(.secondary)
                        }
                        .contentShape(Rectangle())
                    }
                    .buttonStyle(.plain)
                    Divider()
                }
            }
        }
    }

    private var selectedKey: String {
        DateKeys.dayKey(selectedDate)
    }

    private var existingContext: DayContextModel? {
        dayContexts.first { $0.dateKey == selectedKey }
    }

    private var selectedSignal: CalendarDaySignalModel? {
        calendarSignals.first { $0.dateKey == selectedKey }
    }

    private var selectedEvents: [CalendarEventImportModel] {
        calendarEvents.filter { $0.dateKey == selectedKey }
    }

    private var upcomingDates: [Date] {
        let calendar = Calendar.current
        return (0..<14).compactMap { calendar.date(byAdding: .day, value: $0, to: Date()) }
    }

    private func loadSelectedDay() {
        if let context = existingContext {
            location = context.location
            family = context.family
            breakfastOut = context.breakfastOut
            lunchOut = context.lunchOut
            dinnerOut = context.dinnerOut
            aperitif = context.aperitif
            skippedWorkout = context.skippedWorkout
            recoveryDay = context.recoveryDay
            travelStartsAfterLunch = context.travelStartsAfterLunch
        } else {
            location = .home
            family = .unset
            breakfastOut = false
            lunchOut = false
            dinnerOut = false
            aperitif = false
            skippedWorkout = false
            recoveryDay = false
            travelStartsAfterLunch = false
        }
    }

    private func saveSelectedDay() {
        if let existing = existingContext {
            existing.locationRaw = location.rawValue
            existing.familyRaw = family.rawValue
            existing.breakfastOut = breakfastOut
            existing.lunchOut = lunchOut
            existing.dinnerOut = dinnerOut
            existing.aperitif = aperitif
            existing.skippedWorkout = skippedWorkout
            existing.recoveryDay = recoveryDay
            existing.travelStartsAfterLunch = travelStartsAfterLunch
            existing.updatedAt = Date()
        } else {
            let flags = DayFlags(breakfastOut: breakfastOut, lunchOut: lunchOut, dinnerOut: dinnerOut, aperitif: aperitif, skippedWorkout: skippedWorkout, recoveryDay: recoveryDay, travelStartsAfterLunch: travelStartsAfterLunch)
            modelContext.insert(DayContextModel(dateKey: selectedKey, location: location, family: family, flags: flags))
        }
    }

    private func resetSelectedDay() {
        if let existing = existingContext {
            modelContext.delete(existing)
        }
        loadSelectedDay()
    }

    private func summaryText(for date: Date) -> String {
        let key = DateKeys.dayKey(date)
        if let context = dayContexts.first(where: { $0.dateKey == key }) {
            return summary(for: context)
        }
        if let signal = calendarSignals.first(where: { $0.dateKey == key }) {
            return "Calendario: \(signal.suggestedLocation?.label ?? "nessun luogo")\(signal.dinnerOutLikely ? " · cena fuori" : "")"
        }
        return "Non impostato"
    }

    private func summary(for context: DayContextModel) -> String {
        var parts = [context.location.label]
        if context.travelStartsAfterLunch { parts.append("Partenza dopo pranzo") }
        if context.family != .unset { parts.append(context.family.label) }
        if context.breakfastOut { parts.append("Colazione fuori") }
        if context.lunchOut { parts.append("Pranzo fuori") }
        if context.dinnerOut { parts.append("Cena fuori") }
        if context.aperitif { parts.append("Aperitivo") }
        if context.skippedWorkout { parts.append("Workout saltato") }
        if context.recoveryDay { parts.append("Recupero") }
        return parts.joined(separator: " · ")
    }

    private func eventTime(_ event: CalendarEventImportModel) -> String {
        if event.isAllDay { return "Tutto il giorno" }
        return "\(event.startDate.formatted(date: .omitted, time: .shortened))-\(event.endDate.formatted(date: .omitted, time: .shortened))"
    }
}
