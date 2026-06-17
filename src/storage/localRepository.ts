import type { DayContext, DayTag, MealLog, MealPrepState, ShoppingListCategory, WaistEntry, WeightEntry, WorkoutLog } from "@/domain/types";

export type LocalRepository = {
  saveMealLog(log: MealLog): Promise<void>;
  getMealLogsByDate(date: string): Promise<MealLog[]>;
  deleteMealLog(date: string, id: string): Promise<void>;
  saveWorkoutLog(log: WorkoutLog): Promise<void>;
  getWorkoutLogByDate(date: string): Promise<WorkoutLog | null>;
  deleteWorkoutLog(date: string): Promise<void>;
  saveWeightEntry(entry: WeightEntry): Promise<void>;
  getWeightEntries(): Promise<WeightEntry[]>;
  deleteWeightEntry(id: string): Promise<void>;
  saveWaistEntry(entry: WaistEntry): Promise<void>;
  getWaistEntries(): Promise<WaistEntry[]>;
  deleteWaistEntry(id: string): Promise<void>;
  saveDayTags(date: string, tags: DayTag[]): Promise<void>;
  getDayTags(date: string): Promise<DayTag[]>;
  saveDayContext(context: DayContext): Promise<void>;
  getDayContext(date: string): Promise<DayContext | null>;
  resetDayContext(date: string): Promise<void>;
  getMealPrepState(weekId: string): Promise<MealPrepState | null>;
  saveMealPrepState(weekId: string, state: MealPrepState): Promise<void>;
  getShoppingListState(weekId: string): Promise<ShoppingListCategory[] | null>;
  saveShoppingListState(weekId: string, state: ShoppingListCategory[]): Promise<void>;
  resetMealPrepWeek(weekId: string): Promise<void>;
};

const memoryStore = {
  mealLogs: new Map<string, MealLog[]>(),
  workoutLogs: new Map<string, WorkoutLog>(),
  weightEntries: [] as WeightEntry[],
  waistEntries: [] as WaistEntry[],
  dayTags: new Map<string, DayTag[]>(),
  dayContexts: new Map<string, DayContext>(),
  mealPrepStates: new Map<string, MealPrepState>(),
  shoppingListStates: new Map<string, ShoppingListCategory[]>(),
};

export const mockLocalRepository: LocalRepository = {
  async saveMealLog(log) {
    const logs = memoryStore.mealLogs.get(log.date) ?? [];
    memoryStore.mealLogs.set(log.date, [...logs.filter((item) => item.id !== log.id), log]);
  },
  async getMealLogsByDate(date) {
    return memoryStore.mealLogs.get(date) ?? [];
  },
  async deleteMealLog(date, id) {
    const logs = memoryStore.mealLogs.get(date) ?? [];
    memoryStore.mealLogs.set(
      date,
      logs.filter((item) => item.id !== id),
    );
  },
  async saveWorkoutLog(log) {
    memoryStore.workoutLogs.set(log.date, log);
  },
  async getWorkoutLogByDate(date) {
    return memoryStore.workoutLogs.get(date) ?? null;
  },
  async deleteWorkoutLog(date) {
    memoryStore.workoutLogs.delete(date);
  },
  async saveWeightEntry(entry) {
    memoryStore.weightEntries = [...memoryStore.weightEntries.filter((item) => item.id !== entry.id), entry];
  },
  async getWeightEntries() {
    return memoryStore.weightEntries;
  },
  async deleteWeightEntry(id) {
    memoryStore.weightEntries = memoryStore.weightEntries.filter((item) => item.id !== id);
  },
  async saveWaistEntry(entry) {
    memoryStore.waistEntries = [...memoryStore.waistEntries.filter((item) => item.id !== entry.id), entry];
  },
  async getWaistEntries() {
    return memoryStore.waistEntries;
  },
  async deleteWaistEntry(id) {
    memoryStore.waistEntries = memoryStore.waistEntries.filter((item) => item.id !== id);
  },
  async saveDayTags(date, tags) {
    memoryStore.dayTags.set(date, tags);
  },
  async getDayTags(date) {
    return memoryStore.dayTags.get(date) ?? [];
  },
  async saveDayContext(context) {
    memoryStore.dayContexts.set(context.date, context);
  },
  async getDayContext(date) {
    return memoryStore.dayContexts.get(date) ?? null;
  },
  async resetDayContext(date) {
    memoryStore.dayContexts.delete(date);
  },
  async getMealPrepState(weekId) {
    return memoryStore.mealPrepStates.get(weekId) ?? null;
  },
  async saveMealPrepState(weekId, state) {
    memoryStore.mealPrepStates.set(weekId, state);
  },
  async getShoppingListState(weekId) {
    return memoryStore.shoppingListStates.get(weekId) ?? null;
  },
  async saveShoppingListState(weekId, state) {
    memoryStore.shoppingListStates.set(weekId, state);
  },
  async resetMealPrepWeek(weekId) {
    memoryStore.mealPrepStates.delete(weekId);
    memoryStore.shoppingListStates.delete(weekId);
  },
};
