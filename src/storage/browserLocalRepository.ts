"use client";

import type { DayTag, MealLog, MealPrepState, ShoppingListCategory, WaistEntry, WeightEntry, WorkoutLog } from "@/domain/types";
import type { LocalRepository } from "@/storage/localRepository";

const keys = {
  mealLogs: "fabio-daily:meal-logs",
  workoutLogs: "fabio-daily:workout-logs",
  weightEntries: "fabio-daily:weight-entries",
  waistEntries: "fabio-daily:waist-entries",
  dayTags: "fabio-daily:day-tags",
  mealPrepStates: "fabio-daily:meal-prep-states",
  shoppingListStates: "fabio-daily:shopping-list-states",
};

export const browserLocalRepository: LocalRepository = {
  async saveMealLog(log) {
    const logs = readRecord<MealLog[]>(keys.mealLogs, {});
    const dateLogs = logs[log.date] ?? [];
    writeRecord(keys.mealLogs, {
      ...logs,
      [log.date]: [...dateLogs.filter((item) => item.id !== log.id), log],
    });
  },
  async getMealLogsByDate(date) {
    return readRecord<MealLog[]>(keys.mealLogs, {})[date] ?? [];
  },
  async deleteMealLog(date, id) {
    const logs = readRecord<MealLog[]>(keys.mealLogs, {});
    const dateLogs = logs[date] ?? [];
    writeRecord(keys.mealLogs, {
      ...logs,
      [date]: dateLogs.filter((item) => item.id !== id),
    });
  },
  async saveWorkoutLog(log) {
    const logs = readRecord<WorkoutLog>(keys.workoutLogs, {});
    writeRecord(keys.workoutLogs, { ...logs, [log.date]: log });
  },
  async getWorkoutLogByDate(date) {
    return readRecord<WorkoutLog>(keys.workoutLogs, {})[date] ?? null;
  },
  async deleteWorkoutLog(date) {
    const logs = readRecord<WorkoutLog>(keys.workoutLogs, {});
    delete logs[date];
    writeRecord(keys.workoutLogs, logs);
  },
  async saveWeightEntry(entry) {
    const entries = readArray<WeightEntry>(keys.weightEntries);
    writeArray(keys.weightEntries, [...entries.filter((item) => item.id !== entry.id), entry]);
  },
  async getWeightEntries() {
    return readArray<WeightEntry>(keys.weightEntries);
  },
  async deleteWeightEntry(id) {
    const entries = readArray<WeightEntry>(keys.weightEntries);
    writeArray(
      keys.weightEntries,
      entries.filter((item) => item.id !== id),
    );
  },
  async saveWaistEntry(entry) {
    const entries = readArray<WaistEntry>(keys.waistEntries);
    writeArray(keys.waistEntries, [...entries.filter((item) => item.id !== entry.id), entry]);
  },
  async getWaistEntries() {
    return readArray<WaistEntry>(keys.waistEntries);
  },
  async deleteWaistEntry(id) {
    const entries = readArray<WaistEntry>(keys.waistEntries);
    writeArray(
      keys.waistEntries,
      entries.filter((item) => item.id !== id),
    );
  },
  async saveDayTags(date, tags) {
    const allTags = readRecord<DayTag[]>(keys.dayTags, {});
    writeRecord(keys.dayTags, { ...allTags, [date]: tags });
  },
  async getDayTags(date) {
    return readRecord<DayTag[]>(keys.dayTags, {})[date] ?? [];
  },
  async getMealPrepState(weekId) {
    return readRecord<MealPrepState>(keys.mealPrepStates, {})[weekId] ?? null;
  },
  async saveMealPrepState(weekId, state) {
    const states = readRecord<MealPrepState>(keys.mealPrepStates, {});
    writeRecord(keys.mealPrepStates, { ...states, [weekId]: state });
  },
  async getShoppingListState(weekId) {
    return readRecord<ShoppingListCategory[]>(keys.shoppingListStates, {})[weekId] ?? null;
  },
  async saveShoppingListState(weekId, state) {
    const states = readRecord<ShoppingListCategory[]>(keys.shoppingListStates, {});
    writeRecord(keys.shoppingListStates, { ...states, [weekId]: state });
  },
  async resetMealPrepWeek(weekId) {
    const mealPrepStates = readRecord<MealPrepState>(keys.mealPrepStates, {});
    const shoppingListStates = readRecord<ShoppingListCategory[]>(keys.shoppingListStates, {});
    delete mealPrepStates[weekId];
    delete shoppingListStates[weekId];
    writeRecord(keys.mealPrepStates, mealPrepStates);
    writeRecord(keys.shoppingListStates, shoppingListStates);
  },
};

function readArray<T>(key: string): T[] {
  if (typeof window === "undefined") return [];

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T[]) : [];
  } catch {
    return [];
  }
}

function writeArray<T>(key: string, value: T[]) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function readRecord<T>(key: string, fallback: Record<string, T>): Record<string, T> {
  if (typeof window === "undefined") return fallback;

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as Record<string, T>) : fallback;
  } catch {
    return fallback;
  }
}

function writeRecord<T>(key: string, value: Record<string, T>) {
  window.localStorage.setItem(key, JSON.stringify(value));
}
