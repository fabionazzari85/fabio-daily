import SwiftData
import SwiftUI

struct DayContextEditorView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(\.modelContext) private var modelContext
    @Query private var dayContexts: [DayContextModel]

    @State private var location: DayLocation = .home
    @State private var family: DayFamily = .unset
    @State private var dinnerOut = false
    @State private var aperitif = false
    @State private var skippedWorkout = false
    @State private var recoveryDay = false

    private let dateKey = DateKeys.dayKey(Date())

    var body: some View {
        NavigationStack {
            Form {
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
        }
    }

    private var existingContext: DayContextModel? {
        dayContexts.first { $0.dateKey == dateKey }
    }

    private func load() {
        guard let existing = existingContext else { return }
        location = existing.location
        family = existing.family
        dinnerOut = existing.dinnerOut
        aperitif = existing.aperitif
        skippedWorkout = existing.skippedWorkout
        recoveryDay = existing.recoveryDay
    }

    private func save() {
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
            modelContext.insert(DayContextModel(dateKey: dateKey, location: location, family: family, flags: flags))
        }
    }
}
