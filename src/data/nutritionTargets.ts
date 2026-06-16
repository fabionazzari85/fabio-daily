import type { NutritionTargetDefinition } from "@/domain/types";

export const nutritionTargets: NutritionTargetDefinition[] = [
  {
    dayType: "homeWorkout",
    label: "Allenamento casa",
    target: {
      kcal: { min: 1800, max: 1800 },
      proteinG: { min: 160, max: 160 },
      carbsG: { min: 150, max: 180 },
      fatG: { min: 45, max: 55 },
    },
    note: "Giornata attiva: proteine alte e carboidrati gestiti intorno ai pasti.",
  },
  {
    dayType: "walkRun",
    label: "Camminata/corsa",
    target: {
      kcal: { min: 1800, max: 1800 },
      proteinG: { min: 155, max: 165 },
      carbsG: { min: 150, max: 180 },
      fatG: { min: 45, max: 55 },
    },
    note: "Movimento costante, senza mangiare indietro automaticamente le calorie attive.",
  },
  {
    dayType: "recovery",
    label: "Recupero",
    target: {
      kcal: { min: 1700, max: 1700 },
      proteinG: { min: 155, max: 165 },
      carbsG: { min: 110, max: 140 },
      fatG: { min: 50, max: 60 },
    },
    note: "Controllo semplice, cena non troppo abbondante.",
  },
  {
    dayType: "sundayFreeMeal",
    label: "Domenica con pranzo libero",
    target: {
      kcal: { min: 1700, max: 1900 },
      proteinG: { min: 150, max: 165 },
      carbsG: { min: 120, max: 180 },
      fatG: { min: 45, max: 65 },
    },
    note: "Pasto libero sì, giornata libera no.",
  },
  {
    dayType: "travelCarMealPrep",
    label: "Trasferta in auto con meal prep",
    target: {
      kcal: { min: 1800, max: 1800 },
      proteinG: { min: 155, max: 165 },
      carbsG: { min: 135, max: 170 },
      fatG: { min: 45, max: 60 },
    },
    note: "Meal prep in borsa frigo, kit auto e una cena fuori controllata.",
  },
  {
    dayType: "travelFarNoMealPrep",
    label: "Trasferta lontana senza meal prep",
    target: {
      kcal: { min: 1800, max: 1900 },
      proteinG: { min: 150, max: 165 },
      carbsG: { min: 130, max: 180 },
      fatG: { min: 45, max: 65 },
    },
    note: "Controllo pratico fuori casa: un piatto solo e proteine prioritarie.",
  },
];
