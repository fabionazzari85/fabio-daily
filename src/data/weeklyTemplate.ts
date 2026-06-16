import type { DayTag, WorkoutPlan } from "@/domain/types";

type WeekdayTemplate = {
  label: string;
  defaultTags: DayTag[];
  workout: WorkoutPlan;
};

export const weeklyTemplate: Record<number, WeekdayTemplate> = {
  0: {
    label: "Domenica",
    defaultTags: ["recovery", "sundayFreeMeal"],
    workout: {
      type: "recovery",
      title: "Recupero + Meal Prep",
      durationMin: { min: 0, max: 0 },
      sourceHint: "Manuale",
    },
  },
  1: {
    label: "Lunedì",
    defaultTags: ["homeWorkout"],
    workout: {
      type: "homeFitness",
      title: "Apple Fitness+ casa",
      durationMin: { min: 40, max: 45 },
      sourceHint: "Apple Fitness+",
    },
  },
  2: {
    label: "Martedì",
    defaultTags: ["walkRun"],
    workout: {
      type: "walkRun",
      title: "Camminata/corsa",
      durationMin: { min: 45, max: 60 },
      sourceHint: "Apple Watch",
    },
  },
  3: {
    label: "Mercoledì",
    defaultTags: ["homeWorkout"],
    workout: {
      type: "homeFitness",
      title: "Apple Fitness+ casa",
      durationMin: { min: 40, max: 45 },
      sourceHint: "Apple Fitness+",
    },
  },
  4: {
    label: "Giovedì",
    defaultTags: ["walkRun"],
    workout: {
      type: "walkRun",
      title: "Camminata/corsa",
      durationMin: { min: 45, max: 60 },
      sourceHint: "Apple Watch",
    },
  },
  5: {
    label: "Venerdì",
    defaultTags: ["homeWorkout"],
    workout: {
      type: "homeFitness",
      title: "Apple Fitness+ casa",
      durationMin: { min: 40, max: 45 },
      sourceHint: "Apple Fitness+",
    },
  },
  6: {
    label: "Sabato",
    defaultTags: ["recovery"],
    workout: {
      type: "recovery",
      title: "Recupero",
      durationMin: { min: 0, max: 0 },
      sourceHint: "Manuale",
    },
  },
};
