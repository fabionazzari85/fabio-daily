import type { MealLogCategory, MealSlot } from "@/domain/types";

export const mealSlotOptions: Array<{ value: MealSlot; label: string }> = [
  { value: "breakfast", label: "Colazione" },
  { value: "lunch", label: "Pranzo" },
  { value: "snack", label: "Spuntino" },
  { value: "dinner", label: "Cena" },
  { value: "afterDinner", label: "Dopo cena" },
  { value: "extra", label: "Extra" },
];

export const mealLogCategoryOptions: Array<{ value: MealLogCategory; label: string }> = [
  { value: "followed", label: "Pasto rispettato" },
  { value: "modified", label: "Pasto modificato" },
  { value: "skipped", label: "Pasto saltato" },
  { value: "eatingOut", label: "Cena fuori" },
  { value: "aperitif", label: "Aperitivo" },
  { value: "dessertSnack", label: "Dolce/snack" },
  { value: "labTaste", label: "Assaggio laboratorio" },
  { value: "extraHunger", label: "Fame extra" },
];
