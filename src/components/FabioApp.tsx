"use client";

import { useEffect, useMemo, useState } from "react";
import { BottomNavigation, type AppScreen } from "@/components/BottomNavigation";
import { HomeDashboard } from "@/components/HomeDashboard";
import { LogMealScreen } from "@/components/LogMealScreen";
import { MeasurementsScreen } from "@/components/MeasurementsScreen";
import { MealPrepShoppingScreen } from "@/components/MealPrepShoppingScreen";
import { ProfileSettingsScreen } from "@/components/ProfileSettingsScreen";
import { WorkoutScreen } from "@/components/WorkoutScreen";
import { fabioProfile } from "@/data/fabioProfile";
import type { DayTag, MealLog, MealLogDraft, WaistEntry, WeightEntry, WorkoutLog } from "@/domain/types";
import { getWeekId, toDateKey } from "@/logic/date";
import { generateTodayPlan } from "@/logic/generateTodayPlan";
import { browserLocalRepository } from "@/storage/browserLocalRepository";

const defaultActiveTags: DayTag[] = ["withoutEdoardo"];
const activeScreenKey = "fabio-daily:active-screen";

export function FabioApp() {
  const [activeScreen, setActiveScreen] = useState<AppScreen>("home");
  const [today] = useState(() => new Date());
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);
  const [activeTags, setActiveTags] = useState<DayTag[]>(defaultActiveTags);
  const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [waistEntries, setWaistEntries] = useState<WaistEntry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [editingMealLog, setEditingMealLog] = useState<MealLog | null>(null);
  const [mealLogDraft, setMealLogDraft] = useState<MealLogDraft | null>(null);

  const dateKey = toDateKey(today);
  const weekId = getWeekId(today);

  useEffect(() => {
    const savedScreen = window.localStorage.getItem(activeScreenKey);
    if (savedScreen === "home" || savedScreen === "prep" || savedScreen === "workout" || savedScreen === "measurements" || savedScreen === "profile") {
      setActiveScreen(savedScreen);
    }
  }, []);

  useEffect(() => {
    if (activeScreen === "home" || activeScreen === "prep" || activeScreen === "workout" || activeScreen === "measurements" || activeScreen === "profile") {
      window.localStorage.setItem(activeScreenKey, activeScreen);
    }
  }, [activeScreen]);

  useEffect(() => {
    let cancelled = false;

    async function loadLocalData() {
      const [storedMealLogs, storedTags, storedWorkoutLog, storedWeightEntries, storedWaistEntries] = await Promise.all([
        browserLocalRepository.getMealLogsByDate(dateKey),
        browserLocalRepository.getDayTags(dateKey),
        browserLocalRepository.getWorkoutLogByDate(dateKey),
        browserLocalRepository.getWeightEntries(),
        browserLocalRepository.getWaistEntries(),
      ]);

      if (!cancelled) {
        setMealLogs(storedMealLogs);
        setActiveTags(storedTags.length ? storedTags : defaultActiveTags);
        setWorkoutLog(storedWorkoutLog);
        setWeightEntries(storedWeightEntries);
        setWaistEntries(storedWaistEntries);
        setLoaded(true);
      }
    }

    loadLocalData();

    return () => {
      cancelled = true;
    };
  }, [dateKey]);

  const plan = useMemo(
    () => generateTodayPlan(today, activeTags, mealLogs, workoutLog ? [workoutLog] : [], fabioProfile),
    [activeTags, mealLogs, today, workoutLog],
  );

  async function handleSaveMealLog(mealLog: MealLog) {
    await browserLocalRepository.saveMealLog(mealLog);
    const nextMealLogs = await browserLocalRepository.getMealLogsByDate(dateKey);
    setMealLogs(nextMealLogs);
    setEditingMealLog(null);
    setMealLogDraft(null);
    setActiveScreen("home");
  }

  async function handleDeleteMealLog(mealLog: MealLog) {
    await browserLocalRepository.deleteMealLog(mealLog.date, mealLog.id);
    const nextMealLogs = await browserLocalRepository.getMealLogsByDate(dateKey);
    setMealLogs(nextMealLogs);
  }

  function handleEditMealLog(mealLog: MealLog) {
    setEditingMealLog(mealLog);
    setMealLogDraft(null);
    setActiveScreen("log");
  }

  function handleCancelLog() {
    setEditingMealLog(null);
    setMealLogDraft(null);
    setActiveScreen("home");
  }

  function handleStartMealLog(draft?: MealLogDraft) {
    setEditingMealLog(null);
    setMealLogDraft(draft ?? null);
    setActiveScreen("log");
  }

  async function handleSaveWorkoutLog(nextWorkoutLog: WorkoutLog) {
    await browserLocalRepository.saveWorkoutLog(nextWorkoutLog);
    setWorkoutLog(nextWorkoutLog);
    setActiveScreen("home");
  }

  async function handleDeleteWorkoutLog() {
    await browserLocalRepository.deleteWorkoutLog(dateKey);
    setWorkoutLog(null);
    setActiveScreen("home");
  }

  async function handleSaveWeightEntry(entry: WeightEntry) {
    await browserLocalRepository.saveWeightEntry(entry);
    setWeightEntries(await browserLocalRepository.getWeightEntries());
  }

  async function handleSaveWaistEntry(entry: WaistEntry) {
    await browserLocalRepository.saveWaistEntry(entry);
    setWaistEntries(await browserLocalRepository.getWaistEntries());
  }

  async function handleDeleteWeightEntry(id: string) {
    await browserLocalRepository.deleteWeightEntry(id);
    setWeightEntries(await browserLocalRepository.getWeightEntries());
  }

  async function handleDeleteWaistEntry(id: string) {
    await browserLocalRepository.deleteWaistEntry(id);
    setWaistEntries(await browserLocalRepository.getWaistEntries());
  }

  return (
    <>
      {activeScreen === "log" ? (
        <LogMealScreen date={dateKey} onSave={handleSaveMealLog} onCancel={handleCancelLog} initialMealLog={editingMealLog} initialDraft={mealLogDraft} />
      ) : activeScreen === "prep" ? (
        <MealPrepShoppingScreen weekId={weekId} />
      ) : activeScreen === "workout" ? (
        <WorkoutScreen date={dateKey} workoutPlan={plan.workoutPlan} workoutLog={workoutLog} onSave={handleSaveWorkoutLog} onDelete={handleDeleteWorkoutLog} />
      ) : activeScreen === "measurements" ? (
        <MeasurementsScreen
          date={dateKey}
          weightEntries={weightEntries}
          waistEntries={waistEntries}
          onSaveWeight={handleSaveWeightEntry}
          onSaveWaist={handleSaveWaistEntry}
          onDeleteWeight={handleDeleteWeightEntry}
          onDeleteWaist={handleDeleteWaistEntry}
        />
      ) : activeScreen === "profile" ? (
        <ProfileSettingsScreen profile={fabioProfile} />
      ) : (
        <HomeDashboard
          plan={plan}
          displayDate={today}
          mealLogs={mealLogs}
          workoutLog={workoutLog}
          weightEntries={weightEntries}
          loaded={loaded}
          onLogMeal={handleStartMealLog}
          onDeleteMealLog={handleDeleteMealLog}
          onEditMealLog={handleEditMealLog}
          onOpenPrep={() => setActiveScreen("prep")}
          onOpenWorkout={() => setActiveScreen("workout")}
          onOpenMeasurements={() => setActiveScreen("measurements")}
          onOpenProfile={() => setActiveScreen("profile")}
        />
      )}
      <BottomNavigation activeScreen={activeScreen} onNavigate={setActiveScreen} />
    </>
  );
}
