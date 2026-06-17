import Foundation

enum PlanningEngine {
    static func recalculateTodayPlan(
        date: Date,
        dayContext: DayContextModel?,
        mealLogs: [MealLogModel],
        workoutLog: WorkoutLogModel?,
        healthWorkouts: [HealthWorkoutImportModel] = [],
        dailySummary: HealthDailySummaryModel? = nil,
        weights: [WeightEntryModel]
    ) -> TodayPlan {
        let context = dayContext ?? DayContextModel(dateKey: DateKeys.dayKey(date))
        let target = context.recoveryDay ? SeedData.recoveryTarget : SeedData.activeTarget
        let baseMeals = meals(for: context)
        let plannedMeals = applyFamilyRules(baseMeals, context: context)
        let consumedKcal = mealLogs.reduce(0) { $0 + $1.kcal }
        let consumed = MacroValue(
            kcal: consumedKcal,
            proteinG: mealLogs.reduce(0) { $0 + ($1.proteinG ?? 0) },
            carbsG: mealLogs.reduce(0) { $0 + ($1.carbsG ?? 0) },
            fatG: mealLogs.reduce(0) { $0 + ($1.fatG ?? 0) }
        )
        let workoutPlan = workoutPlan(for: context)

        return TodayPlan(
            date: date,
            dayLabel: dayLabel(for: context),
            target: target,
            plannedMeals: plannedMeals,
            workoutPlan: workoutPlan,
            consumed: consumed,
            remainingKcal: max(target.kcalMax - consumedKcal, 0),
            suggestions: suggestions(for: context, workoutLog: workoutLog, healthWorkouts: healthWorkouts, dailySummary: dailySummary, weights: weights)
        )
    }

    private static func meals(for context: DayContextModel) -> [MealTemplate] {
        if context.location == .carTravel { return SeedData.carTravelMeals }
        if context.location == .farTravel { return SeedData.farTravelMeals }
        if context.recoveryDay { return SeedData.recoveryMeals }
        return SeedData.homeWorkoutMeals
    }

    private static func applyFamilyRules(_ meals: [MealTemplate], context: DayContextModel) -> [MealTemplate] {
        meals.map { meal in
            guard meal.slot == .dinner else { return meal }

            if context.family == .withEdoardo {
                return MealTemplate(
                    id: "\(meal.id)-edoardo",
                    slot: .dinner,
                    title: "Cena familiare semplice",
                    description: "Piatto condivisibile: pasta GF 60-70 g da crudo con ragù magro, riso/risotto semplice, pesce + patate o pollo + patate/verdure. Evita cena troppo fitness separata.",
                    macros: meal.macros,
                    alternatives: ["Pasta SG con ragù magro", "Pesce + patate", "Pollo + patate/verdure"]
                )
            }

            if context.family == .withoutEdoardo {
                return MealTemplate(
                    id: "\(meal.id)-solo",
                    slot: .dinner,
                    title: "Cena freezer controllata",
                    description: "Cena batch o molto automatica: pollo/polpette + riso/patate + verdure, oppure salmone + patate + verdure. Evita improvvisazione serale.",
                    macros: meal.macros,
                    alternatives: ["Polpette + patate", "Salmone + patate", "Ragù magro + pasta/riso SG"]
                )
            }

            return meal
        }
    }

    private static func workoutPlan(for context: DayContextModel) -> WorkoutPlan {
        if context.recoveryDay || context.skippedWorkout {
            return WorkoutPlan(title: "Recupero / camminata leggera", type: "Recupero", durationMin: "20-30 min opzionali", sourceHint: "Manuale")
        }
        if context.location == .farTravel {
            return WorkoutPlan(title: "Trasferta: movimento se possibile", type: "Mobilità leggera", durationMin: "20-30 min", sourceHint: "Manuale")
        }
        if context.location == .carTravel {
            return WorkoutPlan(title: "Camminata breve se ci sta", type: "Camminata/corsa", durationMin: "20-30 min", sourceHint: "Apple Watch futuro")
        }
        return WorkoutPlan(title: "Apple Fitness+ casa", type: "Allenamento casa", durationMin: "40-45 min", sourceHint: "Apple Fitness+")
    }

    private static func dayLabel(for context: DayContextModel) -> String {
        if context.recoveryDay { return "Recupero" }
        if context.location == .carTravel { return "Trasferta in auto" }
        if context.location == .farTravel { return "Trasferta lontana / hotel" }
        return "Allenamento casa"
    }

    private static func suggestions(for context: DayContextModel, workoutLog: WorkoutLogModel?, healthWorkouts: [HealthWorkoutImportModel], dailySummary: HealthDailySummaryModel?, weights: [WeightEntryModel]) -> [String] {
        var result: [String] = []
        if context.location == .carTravel { result.append("Porta borsa frigo, acqua, protein bar GF e shaker.") }
        if context.location == .farTravel { result.append("Non cercare perfezione: punta a proteine + piatto semplice.") }
        if context.dinnerOut { result.append("Cena fuori prevista: scegli un piatto principale, parti dalle proteine e non sommare antipasto + primo + dolce.") }
        if context.aperitif { result.append("Aperitivo/gin tonic previsto: considera circa 180 kcal, ma registralo solo se lo bevi davvero.") }
        if context.skippedWorkout { result.append("Allenamento saltato: nessun tono punitivo. Mantieni proteine alte e fai una camminata breve se possibile.") }
        if context.recoveryDay { result.append("Giorno recupero: circa 1700 kcal, proteine alte e carboidrati più controllati.") }
        if workoutLog?.completed == true || !healthWorkouts.isEmpty { result.append("Workout segnato o importato. Le calorie attività restano un indicatore, non un bonus automatico.") }
        if let steps = dailySummary?.steps, steps > 0 { result.append("Attività importata: \(steps) passi oggi.") }
        if result.isEmpty { result.append("Giornata lineare: proteine prioritarie, porzioni piccole e acqua regolare.") }
        return result
    }
}

enum DateKeys {
    static func dayKey(_ date: Date) -> String {
        let formatter = DateFormatter()
        formatter.calendar = Calendar(identifier: .gregorian)
        formatter.locale = Locale(identifier: "en_US_POSIX")
        formatter.dateFormat = "yyyy-MM-dd"
        return formatter.string(from: date)
    }

    static func weekKey(_ date: Date) -> String {
        let calendar = Calendar(identifier: .gregorian)
        let week = calendar.component(.weekOfYear, from: date)
        let year = calendar.component(.yearForWeekOfYear, from: date)
        return "\(year)-W\(week)"
    }
}

struct WeightTrend {
    let latest: WeightEntryModel?
    let currentAverage: Double?
    let previousAverage: Double?
    let difference: Double?
    let message: String
}

enum WeightTrendCalculator {
    static func calculate(_ entries: [WeightEntryModel]) -> WeightTrend {
        let sorted = representativeDailyWeights(entries).sorted { $0.measuredAt > $1.measuredAt }
        let latest = sorted.first
        let recent = Array(sorted.prefix(7))
        let previous = Array(sorted.dropFirst(7).prefix(7))
        let currentAverage = average(recent)
        let previousAverage = average(previous)
        let difference = currentAverage.flatMap { current in previousAverage.map { current - $0 } }

        let message: String
        if let difference {
            if difference < -1.0 {
                message = "Trend in discesa rapida. Se fame, energia o allenamenti peggiorano, valuta di non tagliare ancora."
            } else if difference < -0.2 {
                message = "Trend in discesa. Continua così, senza tagliare ancora."
            } else {
                message = "Il peso singolo può oscillare per acqua, sale, viaggio, allenamento e sonno. Guarda soprattutto la media."
            }
        } else {
            message = "Inserisci il peso per alcuni giorni: la media sarà più utile del singolo numero."
        }

        return WeightTrend(latest: latest, currentAverage: currentAverage, previousAverage: previousAverage, difference: difference, message: message)
    }

    private static func average(_ entries: [WeightEntryModel]) -> Double? {
        guard !entries.isEmpty else { return nil }
        return entries.reduce(0.0) { $0 + $1.weightKg } / Double(entries.count)
    }

    private static func representativeDailyWeights(_ entries: [WeightEntryModel]) -> [WeightEntryModel] {
        let grouped = Dictionary(grouping: entries, by: \.dateKey)
        return grouped.values.compactMap { dayEntries in
            if let manual = dayEntries.filter({ $0.source == .manual }).sorted(by: { $0.measuredAt > $1.measuredAt }).first {
                return manual
            }
            return dayEntries.sorted(by: { $0.measuredAt > $1.measuredAt }).first
        }
    }
}
