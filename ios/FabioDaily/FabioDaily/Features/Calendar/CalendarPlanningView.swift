import SwiftData
import SwiftUI

struct CalendarPlanningView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var dayContexts: [DayContextModel]
    @Query private var calendarSignals: [CalendarDaySignalModel]

    @State private var selectedDate = Date()
    @State private var location: DayLocation = .home
    @State private var family: DayFamily = .unset
    @State private var dinnerOut = false
    @State private var aperitif = false
    @State private var skippedWorkout = false
    @State private var recoveryDay = false

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

                Toggle("Cena fuori", isOn: $dinnerOut)
                Toggle("Aperitivo / gin tonic", isOn: $aperitif)
                Toggle("Allenamento saltato", isOn: $skippedWorkout)
                Toggle("Giorno recupero", isOn: $recoveryDay)

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

    private var upcomingDates: [Date] {
        let calendar = Calendar.current
        return (0..<14).compactMap { calendar.date(byAdding: .day, value: $0, to: Date()) }
    }

    private func loadSelectedDay() {
        if let context = existingContext {
            location = context.location
            family = context.family
            dinnerOut = context.dinnerOut
            aperitif = context.aperitif
            skippedWorkout = context.skippedWorkout
            recoveryDay = context.recoveryDay
        } else {
            location = .home
            family = .unset
            dinnerOut = false
            aperitif = false
            skippedWorkout = false
            recoveryDay = false
        }
    }

    private func saveSelectedDay() {
        if let existing = existingContext {
            existing.locationRaw = location.rawValue
            existing.familyRaw = family.rawValue
            existing.dinnerOut = dinnerOut
            existing.aperitif = aperitif
            existing.skippedWorkout = skippedWorkout
            existing.recoveryDay = recoveryDay
            existing.updatedAt = Date()
        } else {
            let flags = DayFlags(dinnerOut: dinnerOut, aperitif: aperitif, skippedWorkout: skippedWorkout, recoveryDay: recoveryDay)
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
        if context.family != .unset { parts.append(context.family.label) }
        if context.dinnerOut { parts.append("Cena fuori") }
        if context.aperitif { parts.append("Aperitivo") }
        if context.skippedWorkout { parts.append("Workout saltato") }
        if context.recoveryDay { parts.append("Recupero") }
        return parts.joined(separator: " · ")
    }
}
