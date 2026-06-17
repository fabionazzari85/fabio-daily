import SwiftData
import SwiftUI

struct DayContextEditorView: View {
    let initialDate: Date

    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext
    @Query private var dayContexts: [DayContextModel]

    @State private var selectedDate: Date
    @State private var location: DayLocation = .home
    @State private var family: DayFamily = .unset
    @State private var breakfastOut = false
    @State private var lunchOut = false
    @State private var dinnerOut = false
    @State private var aperitif = false
    @State private var skippedWorkout = false
    @State private var recoveryDay = false
    @State private var travelStartsAfterLunch = false

    init(initialDate: Date = Date()) {
        self.initialDate = initialDate
        _selectedDate = State(initialValue: initialDate)
    }

    var body: some View {
        NavigationStack {
            Form {
                Section("Giorno") {
                    DatePicker("Data", selection: $selectedDate, displayedComponents: .date)
                        .datePickerStyle(.compact)
                    Text(selectedDate.formatted(date: .complete, time: .omitted))
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Section("Luogo / situazione") {
                    Picker("Luogo", selection: $location) {
                        ForEach(DayLocation.allCases) { Text($0.label).tag($0) }
                    }
                    .pickerStyle(.inline)
                }

                Section("Famiglia") {
                    Picker("Famiglia", selection: $family) {
                        ForEach(DayFamily.allCases) { Text($0.label).tag($0) }
                    }
                    .pickerStyle(.inline)
                }

                Section("Extra giornata") {
                    Toggle("Partenza dopo pranzo", isOn: $travelStartsAfterLunch)
                    Toggle("Colazione fuori", isOn: $breakfastOut)
                    Toggle("Pranzo fuori", isOn: $lunchOut)
                    Toggle("Cena fuori", isOn: $dinnerOut)
                    Toggle("Aperitivo / gin tonic", isOn: $aperitif)
                    Toggle("Allenamento saltato", isOn: $skippedWorkout)
                    Toggle("Giorno recupero", isOn: $recoveryDay)
                }

                Section {
                    Button("Salva giornata") {
                        save()
                        dismiss()
                    }
                    Button("Reset giornata", role: .destructive) {
                        if let existing = existingContext {
                            modelContext.delete(existing)
                        }
                        dismiss()
                    }
                }

                Section {
                    Text("Il manuale vince sempre sull'automatico futuro.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
            .navigationTitle("Modifica giornata")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Chiudi") { dismiss() }
                }
            }
            .onAppear(perform: load)
            .onChange(of: selectedDate) { _, _ in load() }
        }
    }

    private var dateKey: String {
        DateKeys.dayKey(selectedDate)
    }

    private var existingContext: DayContextModel? {
        dayContexts.first { $0.dateKey == dateKey }
    }

    private func load() {
        if let existing = existingContext {
            location = existing.location
            family = existing.family
            breakfastOut = existing.breakfastOut
            lunchOut = existing.lunchOut
            dinnerOut = existing.dinnerOut
            aperitif = existing.aperitif
            skippedWorkout = existing.skippedWorkout
            recoveryDay = existing.recoveryDay
            travelStartsAfterLunch = existing.travelStartsAfterLunch
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

    private func save() {
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
            modelContext.insert(DayContextModel(dateKey: dateKey, location: location, family: family, flags: flags))
        }
    }
}
