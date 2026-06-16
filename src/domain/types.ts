export type MealSlot = "breakfast" | "lunch" | "snack" | "dinner" | "afterDinner" | "extra";

export type MealLogCategory =
  | "followed"
  | "modified"
  | "skipped"
  | "eatingOut"
  | "aperitif"
  | "dessertSnack"
  | "labTaste"
  | "extraHunger";

export type DayTag =
  | "normal"
  | "withEdoardo"
  | "withoutEdoardo"
  | "homeWorkout"
  | "walkRun"
  | "recovery"
  | "travelCarMealPrep"
  | "travelFarNoMealPrep"
  | "eatingOut"
  | "ginTonic"
  | "sundayFreeMeal"
  | "missedPlan";

export type ResolvedDayType =
  | "homeWorkout"
  | "walkRun"
  | "recovery"
  | "travelCarMealPrep"
  | "travelFarNoMealPrep"
  | "sundayFreeMeal";

export type WorkoutType = "homeFitness" | "walkRun" | "recovery" | "lightMobility";
export type EnergyLevel = "bassa" | "media" | "alta";
export type EffortLevel = "leggero" | "giusto" | "duro";

export type MacroTarget = {
  kcal: {
    min: number;
    max: number;
  };
  proteinG: {
    min: number;
    max: number;
  };
  carbsG: {
    min: number;
    max: number;
  };
  fatG: {
    min: number;
    max: number;
  };
};

export type MacroValue = {
  kcal: number;
  proteinG?: number;
  carbsG?: number;
  fatG?: number;
};

export type UserProfile = {
  id: string;
  name: string;
  heightCm: number;
  startingWeightKg: number;
  targetWeightKg: number;
  goals: string[];
  conditions: string[];
  preferences: {
    mealsPerDay: string;
    glutenFree: boolean;
    lactoseFreePreferred: boolean;
    fishPerWeek: string;
    water: string;
    alcohol: string;
  };
  exclusions: string[];
  sleeveRefluxRules: string[];
};

export type NutritionTargetDefinition = {
  dayType: ResolvedDayType;
  label: string;
  target: MacroTarget;
  note: string;
};

export type MealTemplate = {
  id: string;
  slot: MealSlot;
  title: string;
  description: string;
  estimatedMacros?: MacroValue;
  tags?: DayTag[];
  alternatives?: string[];
  refluxNote?: string;
};

export type MealLog = {
  id: string;
  date: string;
  slot: MealSlot;
  category: MealLogCategory;
  description: string;
  macros: MacroValue;
  notes?: string;
};

export type MealLogDraft = {
  slot: MealSlot;
  category?: MealLogCategory;
  description?: string;
  macros?: Partial<MacroValue>;
  notes?: string;
};

export type WorkoutPlan = {
  type: WorkoutType;
  title: string;
  durationMin: {
    min: number;
    max: number;
  };
  sourceHint: "Apple Fitness+" | "Apple Watch" | "Manuale";
};

export type WorkoutLog = {
  id: string;
  date: string;
  plannedType: string;
  completed: boolean;
  durationMinutes?: number;
  activeCalories?: number;
  energyLevel?: EnergyLevel;
  effortLevel?: EffortLevel;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
};

export type WeightEntry = {
  id: string;
  date: string;
  weightKg: number;
  note?: string;
  createdAt: string;
  updatedAt?: string;
};

export type WaistEntry = {
  id: string;
  date: string;
  waistCm: number;
  note?: string;
  createdAt: string;
  updatedAt?: string;
};

export type ShoppingListItem = {
  id: string;
  label: string;
  quantity?: string;
  checked: boolean;
  custom?: boolean;
};

export type ShoppingListCategory = {
  id: string;
  title: string;
  items: ShoppingListItem[];
};

export type MealPrepItem = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  quantity: string;
  note: string;
  prepared: boolean;
};

export type MealPrepState = {
  weekId: string;
  lunches: MealPrepItem[];
  dinners: MealPrepItem[];
};

export type TodayPlan = {
  date: string;
  activeTags: DayTag[];
  resolvedDayType: ResolvedDayType;
  dayLabel: string;
  nutritionTarget: MacroTarget;
  plannedMeals: MealTemplate[];
  workoutPlan: WorkoutPlan;
  consumed: Required<MacroValue>;
  remaining: Required<MacroValue>;
  suggestions: string[];
  refluxNotes: string[];
};
