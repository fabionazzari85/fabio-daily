import SwiftData
import SwiftUI

struct HomeView: View {
    @Bindable var appState: AppState
    @Environment(\.modelContext) private var modelContext
    @Query private var mealLogs: [MealLogModel]
    @Query private var workoutLogs: [WorkoutLogModel]
    @Query private var healthWorkouts: [HealthWorkoutImportModel]
    @Query private var healthDailySummaries: [HealthDailySummaryModel]
    @Query private var calendarSignals: [CalendarDaySignalModel]
    @Query private var dayContexts: [DayContextModel]
    @Query(sort: \WeightEntryModel.measuredAt, order: .reverse) private var weights: [WeightEntryModel]

    private let today = Date()

    var body: some View {
        let dateKey = DateKeys.dayKey(today)
        let todayMeals = mealLogs.filter { $0.dateKey == dateKey }
        let context = dayContexts.first { $0.dateKey == dateKey }
        let workout = workoutLogs.first { $0.dateKey == dateKey }
        let todayHealthWorkouts = healthWorkouts.filter { $0.dateKey == dateKey }
        let dailySummary = healthDailySummaries.first { $0.dateKey == dateKey }
        let calendarSignal = calendarSignals.first { $0.dateKey == dateKey }
        let plan = PlanningEngine.recalculateTodayPlan(date: today, dayContext: context, mealLogs: todayMeals, workoutLog: workout, healthWorkouts: todayHealthWorkouts, dailySummary: dailySummary, calendarSignal: calendarSignal, weights: weights)
        let trend = WeightTrendCalculator.calculate(weights)

        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    header(plan)
                    metrics(plan)
                    dayContextCard(context: context, plan: plan)
                    calendarSignalCard(calendarSignal, context: context)
                    mealsSection(plan)
                    quickActions
                    activityCard(dailySummary)
                    workoutCard(plan: plan, workout: workout)
                    importedWorkoutCard(todayHealthWorkouts)
                    weightCard(trend)
                    mealLogsSection(todayMeals)
                    suggestions(plan)
                    AutomaticUpdatesCard(healthKitService: appState.healthKitService, calendarService: appState.calendarService)
                }
                .padding()
            }
            .navigationTitle("Oggi")
        }
    }

    private func header(_ plan: TodayPlan) -> some View {
        FDCard {
            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 6) {
                    Text(plan.dayLabel)
                        .font(.title2.weight(.bold))
                    Text("Pesi indicati da crudo, salvo diversa indicazione.")
                        .font(.subheadline.weight(.semibold))
                        .foregroundStyle(.green)
                }
                Spacer()
                VStack(alignment: .trailing) {
                    Text("\(plan.remainingKcal)")
                        .font(.largeTitle.weight(.bold))
                    Text("kcal residue")
                        .font(.caption)
                        .foregroundStyle(.secondary)
                }
            }
        }
    }

    private func metrics(_ plan: TodayPlan) -> some View {
        FDCard {
            Text("Target giorno")
                .font(.headline)
            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 8) {
                MetricPill(label: "Target", value: "\(plan.target.kcalMax) kcal")
                MetricPill(label: "Consumate", value: "\(plan.consumed.kcal) kcal")
                MetricPill(label: "Proteine", value: "\(plan.consumed.proteinG ?? 0) g")
                MetricPill(label: "Carbo", value: "\(plan.consumed.carbsG ?? 0) g")
            }
        }
    }

    private func dayContextCard(context: DayContextModel?, plan: TodayPlan) -> some View {
        FDCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Giornata di oggi")
                    .font(.title3.weight(.bold))
                Text(daySummary(context: context, plan: plan))
                    .font(.subheadline.weight(.semibold))
                    .foregroundStyle(.green)
                PrimaryButton(title: "Modifica giornata") {
                    appState.editDayContext(date: today)
                }
            }
        }
    }

    private func calendarSignalCard(_ signal: CalendarDaySignalModel?, context: DayContextModel?) -> some View {
        FDCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Calendario")
                    .font(.title3.weight(.bold))
                if let signal {
                    if let explanation = signal.explanation {
                        Text(explanation)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }
                    HStack {
                        MetricPill(label: "Luogo", value: signal.suggestedLocation?.label ?? "n/d")
                        MetricPill(label: "Eventi", value: signal.sourceEventIds.isEmpty ? "letti" : "\(signal.sourceEventIds.count)")
                    }
                    if let window = signal.workoutWindow {
                        Text("Finestra workout suggerita: \(window.start.formatted(date: .omitted, time: .shortened))-\(window.end.formatted(date: .omitted, time: .shortened))")
                            .font(.caption.weight(.semibold))
                    }
                    if context != nil {
                        Text("Hai impostato la giornata manualmente: questa scelta resta prioritaria.")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(.green)
                    }
                } else {
                    Text("Calendario non ancora sincronizzato. Il piano resta manuale e stabile.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
            }
        }
    }

    private func mealsSection(_ plan: TodayPlan) -> some View {
        FDCard {
            VStack(alignment: .leading, spacing: 12) {
                Text("Pasti di oggi")
                    .font(.title3.weight(.bold))
                ForEach(plan.plannedMeals) { meal in
                    VStack(alignment: .leading, spacing: 8) {
                        HStack {
                            Text(meal.slot.label.uppercased())
                                .font(.caption.weight(.bold))
                                .foregroundStyle(.green)
                            Spacer()
                            if let kcal = meal.macros?.kcal { Text("\(kcal) kcal").font(.headline) }
                        }
                        Text(meal.title)
                            .font(.headline)
                        Text(meal.description)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        if let macros = meal.macros {
                            Text("P \(macros.proteinG ?? 0) g · C \(macros.carbsG ?? 0) g · G \(macros.fatG ?? 0) g")
                                .font(.caption.weight(.semibold))
                        }
                        PrimaryButton(title: "Registra questo pasto") {
                            appState.startMealLog(MealLogDraft(slot: meal.slot, category: .followed, description: "\(meal.title): \(meal.description)", macros: meal.macros ?? MacroValue(kcal: 0), notes: meal.alternatives.first ?? ""))
                        }
                        SecondaryButton(title: "Ho mangiato altro") {
                            appState.startMealLog(MealLogDraft(slot: meal.slot, category: .modified, description: "", macros: MacroValue(kcal: 0), notes: ""))
                        }
                    }
                    .padding(.vertical, 8)
                    Divider()
                }
            }
        }
    }

    private var quickActions: some View {
        FDCard {
            VStack(spacing: 8) {
                PrimaryButton(title: "Registra pasto") {
                    appState.startMealLog(nil)
                }
                SecondaryButton(title: "Meal Prep & Spesa") {
                    appState.selectedTab = .prep
                }
            }
        }
    }

    private func workoutCard(plan: TodayPlan, workout: WorkoutLogModel?) -> some View {
        FDCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Workout")
                    .font(.title3.weight(.bold))
                Text(plan.workoutPlan.title)
                    .font(.headline)
                Text(plan.workoutPlan.durationMin)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                if workout?.completed == true {
                    Text("Completato · \(workout?.durationMinutes ?? 0) min · \(workout?.activeCalories ?? 0) kcal attive")
                        .font(.subheadline.weight(.semibold))
                } else {
                    Text("Workout non ancora segnato. Se salta, manteniamo il piano e ripartiamo domani.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                Text("Le calorie attività non vengono aggiunte automaticamente al budget alimentare.")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
            }
        }
    }

    private func activityCard(_ summary: HealthDailySummaryModel?) -> some View {
        FDCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Attività oggi")
                    .font(.title3.weight(.bold))
                if let summary {
                    Text("\(summary.steps ?? 0) passi · \(Int(summary.activeEnergyKcal ?? 0)) kcal attive · \((summary.walkingRunningDistanceKm ?? 0).oneDecimal) km")
                        .font(.headline)
                } else {
                    Text("Nessun dato Apple Health importato oggi.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                }
                Text("Le calorie attività non sono aggiunte automaticamente al piano alimentare.")
                    .font(.caption.weight(.semibold))
                    .foregroundStyle(.secondary)
            }
        }
    }

    private func importedWorkoutCard(_ workouts: [HealthWorkoutImportModel]) -> some View {
        FDCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Workout Apple Health")
                    .font(.title3.weight(.bold))
                if workouts.isEmpty {
                    Text("Nessun workout importato oggi.")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(workouts) { workout in
                        VStack(alignment: .leading, spacing: 4) {
                            Text("\(workout.workoutType) · \(Int(workout.durationMinutes)) min · \(Int(workout.activeCalories ?? 0)) kcal attive\(workout.distanceKm.map { " · \($0.oneDecimal) km" } ?? "")")
                                .font(.subheadline.weight(.semibold))
                            Text("Importato da Apple Health")
                                .font(.caption)
                                .foregroundStyle(.secondary)
                        }
                    }
                }
            }
        }
    }

    private func weightCard(_ trend: WeightTrend) -> some View {
        FDCard {
            VStack(alignment: .leading, spacing: 8) {
                Text("Peso")
                    .font(.title3.weight(.bold))
                HStack {
                    MetricPill(label: "Ultimo", value: trend.latest.map { "\($0.weightKg.oneDecimal) kg" } ?? "n/d")
                    MetricPill(label: "Media 7g", value: trend.currentAverage.map { "\($0.oneDecimal) kg" } ?? "n/d")
                }
                Text(trend.message)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
        }
    }

    private func mealLogsSection(_ logs: [MealLogModel]) -> some View {
        FDCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Pasti registrati")
                    .font(.title3.weight(.bold))
                if logs.isEmpty {
                    Text("Nessun pasto registrato oggi.")
                        .foregroundStyle(.secondary)
                } else {
                    ForEach(logs) { log in
                        VStack(alignment: .leading, spacing: 6) {
                            HStack {
                                Text(log.slot.label)
                                    .font(.caption.weight(.bold))
                                    .foregroundStyle(.green)
                                Spacer()
                                Text("\(log.kcal) kcal").font(.headline)
                            }
                            Text(log.mealDescription)
                            HStack {
                                Button("Modifica") { appState.editMealLog(log) }
                                Button("Elimina", role: .destructive) {
                                    modelContext.delete(log)
                                }
                            }
                        }
                        Divider()
                    }
                }
            }
        }
    }

    private func suggestions(_ plan: TodayPlan) -> some View {
        FDCard {
            Text("Note giornata")
                .font(.title3.weight(.bold))
            ForEach(plan.suggestions, id: \.self) { note in
                Text(note)
                    .font(.subheadline)
                    .padding(.top, 2)
            }
        }
    }

    private func daySummary(context: DayContextModel?, plan: TodayPlan) -> String {
        guard let context else { return "\(plan.dayLabel) · A casa" }
        var parts = [plan.dayLabel, context.location.label]
        if context.travelStartsAfterLunch { parts.append("Partenza dopo pranzo") }
        if context.family != .unset { parts.append(context.family.label) }
        if context.breakfastOut { parts.append("Colazione fuori") }
        if context.lunchOut { parts.append("Pranzo fuori") }
        if context.dinnerOut { parts.append("Cena fuori") }
        if context.aperitif { parts.append("Aperitivo") }
        if context.skippedWorkout { parts.append("Allenamento saltato") }
        if context.recoveryDay { parts.append("Giorno recupero") }
        return parts.joined(separator: " · ")
    }
}
