import {
  homeWorkoutMealTemplates,
  recoveryMealTemplates,
  sundayFreeMealTemplates,
  travelCarMealTemplates,
  travelFarMealTemplates,
  walkRunMealTemplates,
} from "@/data/mealTemplates";
import { nutritionTargets } from "@/data/nutritionTargets";
import { weeklyTemplate } from "@/data/weeklyTemplate";
import type { DayTag, MacroTarget, MealLog, MealTemplate, ResolvedDayType, TodayPlan, UserProfile, WorkoutLog } from "@/domain/types";
import { toDateKey } from "@/logic/date";

export function generateTodayPlan(
  date: Date,
  activeTags: DayTag[],
  mealLogs: MealLog[],
  workoutLogs: WorkoutLog[],
  profile: UserProfile,
): TodayPlan {
  const dateKey = toDateKey(date);
  const weekdayTemplate = weeklyTemplate[date.getDay()];
  const mergedTags = uniqueTags([...weekdayTemplate.defaultTags, ...activeTags]);
  const resolvedDayType = resolveDayType(mergedTags);
  const nutritionDefinition = nutritionTargets.find((target) => target.dayType === resolvedDayType) ?? nutritionTargets[0];
  const plannedMeals = selectMealTemplates(resolvedDayType, mergedTags);
  const workoutPlan = resolveWorkoutPlan(resolvedDayType, weekdayTemplate.workout);
  const consumed = sumMealLogs(mealLogs);
  const remaining = calculateRemaining(nutritionDefinition.target, consumed);
  const suggestions = buildSuggestions({
    tags: mergedTags,
    remainingKcal: remaining.kcal,
    consumed,
    target: nutritionDefinition.target,
    workoutLogs,
  });
  const refluxNotes = buildRefluxNotes(profile, plannedMeals, mergedTags);

  return {
    date: dateKey,
    activeTags: mergedTags,
    resolvedDayType,
    dayLabel: nutritionDefinition.label,
    nutritionTarget: nutritionDefinition.target,
    plannedMeals,
    workoutPlan,
    consumed,
    remaining,
    suggestions,
    refluxNotes,
  };
}

function uniqueTags(tags: DayTag[]): DayTag[] {
  return Array.from(new Set(tags));
}

function resolveDayType(tags: DayTag[]): ResolvedDayType {
  if (tags.includes("travelFarNoMealPrep")) return "travelFarNoMealPrep";
  if (tags.includes("travelCarMealPrep")) return "travelCarMealPrep";
  if (tags.includes("sundayFreeMeal")) return "sundayFreeMeal";
  if (tags.includes("homeWorkout")) return "homeWorkout";
  if (tags.includes("walkRun")) return "walkRun";
  return "recovery";
}

function selectMealTemplates(dayType: ResolvedDayType, tags: DayTag[]): MealTemplate[] {
  if (dayType === "travelFarNoMealPrep") return travelFarMealTemplates;
  if (dayType === "travelCarMealPrep") return travelCarMealTemplates;
  if (dayType === "sundayFreeMeal") return sundayFreeMealTemplates;
  const baseTemplates = dayType === "homeWorkout" ? homeWorkoutMealTemplates : dayType === "walkRun" ? walkRunMealTemplates : recoveryMealTemplates;

  if (tags.includes("withEdoardo")) {
    return baseTemplates.map((meal) =>
      meal.slot === "dinner"
        ? {
            ...meal,
            title: "Cena familiare semplice",
            description: "Piatto condivisibile: pasta GF 60-70 g da crudo con ragu magro, riso 60-70 g da crudo o pesce + patate 250-300 g peso crudo.",
            alternatives: [
              "Pasta SG 60-70 g da crudo con ragu magro",
              "Riso/risotto semplice con riso 60-70 g da crudo",
              "Pesce + patate 250-300 g peso crudo",
            ],
          }
        : meal,
    );
  }

  if (tags.includes("withoutEdoardo")) {
    return baseTemplates.map((meal) =>
      meal.slot === "dinner"
        ? {
            ...meal,
            title: "Cena freezer controllata",
            description: "Cena freezer automatica o molto semplice: patate 250-300 g peso crudo oppure riso/pasta SG 60-70 g da crudo, porzione per Fabio.",
            alternatives: [
              "Polpette tacchino + patate 250-300 g peso crudo + zucchine",
              "Ragu magro + riso/pasta SG 60-70 g da crudo",
              "Pollo al curry leggero + riso 60 g da crudo",
            ],
          }
        : meal,
    );
  }

  return baseTemplates;
}

function resolveWorkoutPlan(resolvedDayType: ResolvedDayType, defaultWorkout: TodayPlan["workoutPlan"]): TodayPlan["workoutPlan"] {
  if (resolvedDayType === "travelFarNoMealPrep") {
    return {
      type: "recovery",
      title: "Trasferta: movimento leggero se possibile",
      durationMin: { min: 20, max: 30 },
      sourceHint: "Manuale",
    };
  }

  if (resolvedDayType === "travelCarMealPrep") {
    return {
      type: "walkRun",
      title: "Camminata breve se ci sta",
      durationMin: { min: 20, max: 30 },
      sourceHint: "Apple Watch",
    };
  }

  return defaultWorkout;
}

function sumMealLogs(mealLogs: MealLog[]) {
  return mealLogs.reduce(
    (totals, log) => ({
      kcal: totals.kcal + log.macros.kcal,
      proteinG: totals.proteinG + (log.macros.proteinG ?? 0),
      carbsG: totals.carbsG + (log.macros.carbsG ?? 0),
      fatG: totals.fatG + (log.macros.fatG ?? 0),
    }),
    { kcal: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
}

function calculateRemaining(target: MacroTarget, consumed: ReturnType<typeof sumMealLogs>) {
  return {
    kcal: Math.max(target.kcal.max - consumed.kcal, 0),
    proteinG: Math.max(target.proteinG.min - consumed.proteinG, 0),
    carbsG: Math.max(target.carbsG.max - consumed.carbsG, 0),
    fatG: Math.max(target.fatG.max - consumed.fatG, 0),
  };
}

function buildSuggestions({
  tags,
  remainingKcal,
  consumed,
  target,
  workoutLogs,
}: {
  tags: DayTag[];
  remainingKcal: number;
  consumed: ReturnType<typeof sumMealLogs>;
  target: MacroTarget;
  workoutLogs: WorkoutLog[];
}) {
  const suggestions: string[] = [];

  if (tags.includes("travelFarNoMealPrep")) {
    suggestions.push("Ok, oggi sei in trasferta: manteniamo il controllo senza cercare la perfezione.");
  }

  if (tags.includes("sundayFreeMeal")) {
    suggestions.push("Pasto libero sì, giornata libera no: cena leggera proteica.");
  }

  if (tags.includes("ginTonic")) {
    suggestions.push("Gin tonic registrabile senza drammi: attenzione solo a non berlo a stomaco vuoto.");
  }

  if (remainingKcal <= 450) {
    suggestions.push("Per il prossimo pasto punta su proteine e verdure, con pochi grassi.");
  }

  if (consumed.carbsG > target.carbsG.max * 0.75) {
    suggestions.push("Carboidrati già ben presenti: a cena tieni riso, pasta o pane molto misurati.");
  }

  if (workoutLogs.some((log) => log.completed && (log.activeCalories ?? 0) > 450)) {
    suggestions.push("Allenamento intenso: non mangiare indietro tutto, valuta solo +100/+150 kcal se hai fame vera.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Giornata lineare: proteine prioritarie, porzioni piccole e acqua regolare.");
  }

  return suggestions;
}

function buildRefluxNotes(profile: UserProfile, plannedMeals: MealTemplate[], tags: DayTag[]) {
  const notes = new Set<string>();

  plannedMeals.forEach((meal) => {
    if (meal.refluxNote) notes.add(meal.refluxNote);
  });

  if (tags.includes("eatingOut")) {
    notes.add("Cena fuori: un piatto solo, evita porzioni troppo abbondanti.");
  }

  profile.sleeveRefluxRules.slice(0, 3).forEach((rule) => notes.add(rule));

  return Array.from(notes);
}
