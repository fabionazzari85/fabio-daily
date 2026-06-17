import type { DayContext, DayTag } from "@/domain/types";

export function createDefaultDayContext(date: string): DayContext {
  return {
    date,
    location: "home",
    family: "unset",
    flags: {
      dinnerOut: false,
      aperitif: false,
      skippedWorkout: false,
      recoveryDay: false,
    },
  };
}

export function normalizeDayContext(date: string, context: DayContext | null): DayContext {
  const fallback = createDefaultDayContext(date);
  if (!context) return fallback;

  return {
    date,
    location: context.location ?? fallback.location,
    family: context.family ?? fallback.family,
    flags: {
      dinnerOut: context.flags?.dinnerOut ?? false,
      aperitif: context.flags?.aperitif ?? false,
      skippedWorkout: context.flags?.skippedWorkout ?? false,
      recoveryDay: context.flags?.recoveryDay ?? false,
    },
  };
}

export function dayContextToTags(context: DayContext): DayTag[] {
  const tags: DayTag[] = [];

  if (context.location === "car_travel") tags.push("travelCarMealPrep");
  if (context.location === "far_travel") tags.push("travelFarNoMealPrep");
  if (context.family === "with_edoardo") tags.push("withEdoardo");
  if (context.family === "without_edoardo") tags.push("withoutEdoardo");
  if (context.flags.dinnerOut) tags.push("eatingOut");
  if (context.flags.aperitif) tags.push("ginTonic");
  if (context.flags.skippedWorkout) tags.push("missedPlan");
  if (context.flags.recoveryDay) tags.push("recovery");

  return tags;
}

export function formatDayContextSummary(context: DayContext, dayLabel: string): string {
  const parts = [dayLabel, locationLabel(context.location)];

  if (context.family !== "unset") parts.push(familyLabel(context.family));
  if (context.flags.dinnerOut) parts.push("Cena fuori prevista");
  if (context.flags.aperitif) parts.push("Aperitivo previsto");
  if (context.flags.skippedWorkout) parts.push("Allenamento saltato");
  if (context.flags.recoveryDay) parts.push("Giorno recupero");

  return parts.join(" · ");
}

export function locationLabel(location: DayContext["location"]) {
  if (location === "car_travel") return "Trasferta in auto";
  if (location === "far_travel") return "Trasferta lontana / hotel";
  return "A casa";
}

export function familyLabel(family: DayContext["family"]) {
  if (family === "with_edoardo") return "Con Edoardo";
  if (family === "without_edoardo") return "Senza Edoardo";
  return "Famiglia non impostata";
}
