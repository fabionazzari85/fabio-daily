import SwiftData
import SwiftUI

struct WorkoutView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var workoutLogs: [WorkoutLogModel]
    @Query(sort: \HealthWorkoutImportModel.startDate, order: .reverse) private var importedWorkouts: [HealthWorkoutImportModel]

    @State private var completed = false
    @State private var duration = ""
    @State private var activeCalories = ""
    @State private var energy = "media"
    @State private var effort = "giusto"
    @State private var notes = ""

    private let dateKey = DateKeys.dayKey(Date())

    var body: some View {
        let existing = workoutLogs.first { $0.dateKey == dateKey }
        let todayImported = importedWorkouts.filter { $0.dateKey == dateKey }

        NavigationStack {
            Form {
                Section("Previsto oggi") {
                    Text("Apple Fitness+ casa · 40-45 min")
                    Text("Le calorie attività non vengono aggiunte automaticamente al budget alimentare.")
                        .font(.caption.weight(.semibold))
                        .foregroundStyle(.secondary)
                }

                Section("Allenamento fatto") {
                    Toggle("Segna come fatto", isOn: $completed)
                    TextField("Durata minuti", text: $duration)
                        .keyboardType(.numberPad)
                    TextField("Kcal attive opzionali", text: $activeCalories)
                        .keyboardType(.numberPad)
                    Picker("Energia", selection: $energy) {
                        Text("bassa").tag("bassa")
                        Text("media").tag("media")
                        Text("alta").tag("alta")
                    }
                    Picker("Fatica", selection: $effort) {
                        Text("leggero").tag("leggero")
                        Text("giusto").tag("giusto")
                        Text("duro").tag("duro")
                    }
                    TextField("Note", text: $notes, axis: .vertical)
                }

                Section("Apple Health") {
                    if todayImported.isEmpty {
                        Text("Nessun workout importato da Apple Health oggi.")
                            .foregroundStyle(.secondary)
                    } else {
                        ForEach(todayImported) { workout in
                            VStack(alignment: .leading, spacing: 4) {
                                Text("\(workout.workoutType) · \(Int(workout.durationMinutes)) min · \(Int(workout.activeCalories ?? 0)) kcal attive\(workout.distanceKm.map { " · \($0.oneDecimal) km" } ?? "")")
                                    .font(.subheadline.weight(.semibold))
                                Text("Workout importato da Apple Health")
                                    .font(.caption)
                                    .foregroundStyle(.secondary)
                            }
                        }
                    }
                    Text("Se esistono workout manuali e importati, la Home considera completato se almeno uno è presente.")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }

                Button("Salva workout") { save(existing) }
                if let existing {
                    Button("Elimina workout", role: .destructive) {
                        modelContext.delete(existing)
                        reset()
                    }
                }
            }
            .navigationTitle("Workout")
            .onAppear { load(existing) }
        }
    }

    private func load(_ log: WorkoutLogModel?) {
        guard let log else { return }
        completed = log.completed
        duration = log.durationMinutes.map(String.init) ?? ""
        activeCalories = log.activeCalories.map(String.init) ?? ""
        energy = log.energyLevel
        effort = log.effortLevel
        notes = log.notes
    }

    private func save(_ existing: WorkoutLogModel?) {
        if let existing {
            existing.completed = completed
            existing.durationMinutes = Int(duration)
            existing.activeCalories = Int(activeCalories)
            existing.energyLevel = energy
            existing.effortLevel = effort
            existing.notes = notes
            existing.updatedAt = Date()
        } else {
            modelContext.insert(WorkoutLogModel(dateKey: dateKey, plannedType: "Apple Fitness+ casa", completed: completed, durationMinutes: Int(duration), activeCalories: Int(activeCalories), energyLevel: energy, effortLevel: effort, notes: notes))
        }
    }

    private func reset() {
        completed = false
        duration = ""
        activeCalories = ""
        energy = "media"
        effort = "giusto"
        notes = ""
    }
}
