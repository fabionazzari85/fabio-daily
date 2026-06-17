import { AlertTriangle, CalendarDays, Dumbbell, Flame, Pencil, PlusCircle, Scale, ShoppingBasket, Trash2, User, Utensils } from "lucide-react";
import { mealLogCategoryOptions, mealSlotOptions } from "@/data/mealLogOptions";
import { rawWeightNote } from "@/data/mealPrepTemplates";
import type { DayContext, MealLog, MealLogCategory, MealLogDraft, MealSlot, MealTemplate, TodayPlan, WeightEntry } from "@/domain/types";
import { calculateWeightTrend } from "@/logic/calculateWeightTrend";
import { formatDayContextSummary } from "@/logic/dayContext";
import { formatItalianDate } from "@/logic/date";
import { MacroPill } from "@/components/MacroPill";

type HomeDashboardProps = {
  plan: TodayPlan;
  displayDate: Date;
  mealLogs: MealLog[];
  workoutLog: import("@/domain/types").WorkoutLog | null;
  weightEntries: WeightEntry[];
  loaded: boolean;
  dayContext: DayContext;
  onLogMeal: (draft?: MealLogDraft) => void;
  onEditDayContext: () => void;
  onDeleteMealLog: (mealLog: MealLog) => void;
  onEditMealLog: (mealLog: MealLog) => void;
  onOpenPrep: () => void;
  onOpenWorkout: () => void;
  onOpenMeasurements: () => void;
  onOpenProfile: () => void;
};

export function HomeDashboard({
  plan,
  displayDate,
  mealLogs,
  workoutLog,
  weightEntries,
  loaded,
  dayContext,
  onLogMeal,
  onEditDayContext,
  onDeleteMealLog,
  onEditMealLog,
  onOpenPrep,
  onOpenWorkout,
  onOpenMeasurements,
  onOpenProfile,
}: HomeDashboardProps) {
  const kcalTargetLabel =
    plan.nutritionTarget.kcal.min === plan.nutritionTarget.kcal.max
      ? `${plan.nutritionTarget.kcal.max}`
      : `${plan.nutritionTarget.kcal.min}-${plan.nutritionTarget.kcal.max}`;
  const weightTrend = calculateWeightTrend(weightEntries);

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-5">
      <header className="mb-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <CalendarDays size={17} />
          <span className="capitalize">{formatItalianDate(displayDate)}</span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold leading-tight text-foreground">Oggi</h1>
            <p className="mt-1 text-base text-muted">{plan.dayLabel}</p>
          </div>
          <div className="rounded-lg bg-accent-soft px-3 py-2 text-right">
            <div className="text-xs font-semibold uppercase tracking-wide text-accent-strong">Residue</div>
            <div className="text-2xl font-bold text-accent-strong">{plan.remaining.kcal}</div>
            <div className="text-xs text-accent-strong">kcal</div>
          </div>
        </div>
      </header>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-muted">Target giorno</div>
            <div className="mt-1 text-2xl font-bold">{kcalTargetLabel} kcal</div>
          </div>
          <Flame className="text-accent" size={28} />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <MacroPill label="Consumate" value={`${plan.consumed.kcal} kcal`} />
          <MacroPill label="Proteine" value={macroRemainingLabel(mealLogs, "proteinG", plan.remaining.proteinG)} />
          <MacroPill label="Carbo" value={macroRemainingLabel(mealLogs, "carbsG", plan.remaining.carbsG)} />
          <MacroPill label="Grassi" value={macroRemainingLabel(mealLogs, "fatG", plan.remaining.fatG)} />
        </div>
      </section>

      <section className="mb-4 rounded-lg border border-accent bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Giornata di oggi</h2>
            <p className="mt-2 text-sm font-bold leading-relaxed text-accent-strong">{formatDayContextSummary(dayContext, plan.dayLabel)}</p>
          </div>
          <CalendarDays className="shrink-0 text-accent" size={24} />
        </div>
        <p className="text-sm leading-relaxed text-muted">Queste scelte aggiornano pasti, note operative e target della Home.</p>
        <button
          type="button"
          onClick={onEditDayContext}
          className="mt-3 flex h-11 w-full items-center justify-center rounded-lg bg-accent text-sm font-bold text-white"
        >
          Modifica giornata
        </button>
      </section>

      <section className="mb-4 rounded-lg border-2 border-accent bg-surface p-4 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Utensils className="text-accent" size={23} />
              <h2 className="text-xl font-bold">Pasti di oggi</h2>
            </div>
            <p className="mt-1 text-sm leading-relaxed text-muted">Cosa mangiare oggi. Meal Prep resta solo per preparare freezer e spesa.</p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-accent-strong">{rawWeightNote}</p>
          </div>
          <span className="shrink-0 rounded-lg bg-accent-soft px-2 py-1 text-sm font-bold text-accent-strong">{plan.plannedMeals.length}</span>
        </div>

        <div className="space-y-3">
          {plan.plannedMeals.map((meal) => (
            <article key={meal.id} className="rounded-lg border border-border bg-background p-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-semibold uppercase tracking-wide text-accent-strong">{mealLabel(meal.slot)}</div>
                  <h3 className="mt-1 text-lg font-bold leading-snug">{meal.title}</h3>
                </div>
                {meal.estimatedMacros ? (
                  <div className="shrink-0 text-right">
                    <div className="text-lg font-bold">{meal.estimatedMacros.kcal}</div>
                    <div className="text-xs text-muted">kcal</div>
                  </div>
                ) : null}
              </div>

              <p className="mt-2 text-sm leading-relaxed text-muted">{meal.description}</p>
              {meal.estimatedMacros ? (
                <p className="mt-2 text-xs font-semibold leading-relaxed text-foreground">{mealMacroLabel(meal)}</p>
              ) : null}
              {meal.alternatives?.length ? (
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  <span className="font-semibold text-foreground">Alternativa rapida:</span> {meal.alternatives[0]}
                </p>
              ) : null}

              <div className="mt-3 grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => onLogMeal(createPlannedMealDraft(meal))}
                  className="flex h-11 items-center justify-center gap-2 rounded-lg bg-accent text-sm font-bold text-white"
                >
                  <PlusCircle size={18} />
                  Registra questo pasto
                </button>
                <button
                  type="button"
                  onClick={() => onLogMeal({ slot: meal.slot, category: "modified" })}
                  className="flex h-11 items-center justify-center rounded-lg border border-border bg-surface text-sm font-bold text-foreground"
                >
                  Ho mangiato altro
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Utensils className="text-accent" size={22} />
          <h2 className="text-lg font-bold">Cosa fare ora</h2>
        </div>
        <p className="text-base leading-relaxed text-foreground">{plan.suggestions[0]}</p>
        {plan.suggestions.length > 1 ? (
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
            {plan.suggestions.slice(1).map((suggestion) => (
              <li key={suggestion}>{suggestion}</li>
            ))}
          </ul>
        ) : null}
        <button
          type="button"
          onClick={() => onLogMeal()}
          className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent text-base font-bold text-white"
        >
          <PlusCircle size={20} />
          Registra pasto
        </button>
        <button
          type="button"
          onClick={onOpenPrep}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-base font-bold text-foreground"
        >
          <ShoppingBasket size={20} />
          Meal Prep & Spesa
        </button>
        <button
          type="button"
          onClick={onOpenWorkout}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-base font-bold text-foreground"
        >
          <Dumbbell size={20} />
          Workout
        </button>
        <button
          type="button"
          onClick={onOpenMeasurements}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-base font-bold text-foreground"
        >
          <Scale size={20} />
          Inserisci peso
        </button>
        <button
          type="button"
          onClick={onOpenProfile}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-base font-bold text-foreground"
        >
          <User size={20} />
          Profilo
        </button>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Scale className="text-accent" size={22} />
          <h2 className="text-lg font-bold">Peso</h2>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <MacroPill label="Ultimo" value={weightTrend.latestWeight ? `${weightTrend.latestWeight.weightKg} kg` : "n/d"} />
          <MacroPill label="Media 7g" value={weightTrend.currentSevenDayAverage ? `${weightTrend.currentSevenDayAverage} kg` : "n/d"} />
          <MacroPill
            label="Var. sett."
            value={weightTrend.weeklyDifference === undefined ? "n/d" : `${weightTrend.weeklyDifference > 0 ? "+" : ""}${weightTrend.weeklyDifference} kg`}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">{weightTrend.message}</p>
        <button
          type="button"
          onClick={onOpenMeasurements}
          className="mt-3 flex h-11 w-full items-center justify-center rounded-lg bg-accent text-sm font-bold text-white"
        >
          Inserisci peso
        </button>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">Pasti registrati</h2>
          <span className="rounded-lg bg-background px-2 py-1 text-sm font-semibold text-muted">{mealLogs.length}</span>
        </div>
        {!loaded ? (
          <p className="text-sm text-muted">Carico i dati locali...</p>
        ) : mealLogs.length === 0 ? (
          <p className="text-sm leading-relaxed text-muted">Nessun pasto registrato oggi. Appena aggiungi il primo, la Home si ricalcola.</p>
        ) : (
          <div className="space-y-2">
            {mealLogs.map((log) => (
              <article key={log.id} className="rounded-lg bg-background p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wide text-accent-strong">{mealSlotLabel(log.slot)}</div>
                    <h3 className="mt-1 text-base font-bold">{log.description}</h3>
                    <p className="mt-1 text-sm text-muted">{mealCategoryLabel(log.category)}</p>
                    <p className="mt-2 text-xs leading-relaxed text-muted">{macroLogLabel(log)}</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-lg font-bold">{log.macros.kcal}</div>
                    <div className="text-xs text-muted">kcal</div>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onEditMealLog(log)}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-bold text-foreground"
                  >
                    <Pencil size={16} />
                    Modifica
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteMealLog(log)}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-surface text-sm font-bold text-warning"
                  >
                    <Trash2 size={16} />
                    Elimina
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <Dumbbell className="text-accent" size={22} />
          <h2 className="text-lg font-bold">Workout</h2>
        </div>
        <div className="text-base font-semibold">{plan.workoutPlan.title}</div>
        <p className="mt-1 text-sm text-muted">
          {plan.workoutPlan.durationMin.max > 0
            ? `${plan.workoutPlan.durationMin.min}-${plan.workoutPlan.durationMin.max} min`
            : "Recupero"}{" "}
          · Fonte futura: {plan.workoutPlan.sourceHint}
        </p>
        <div className="mt-3 rounded-lg bg-background p-3">
          {workoutLog?.completed ? (
            <>
              <p className="text-sm font-bold text-accent-strong">Workout completato</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {workoutLog.durationMinutes ? `${workoutLog.durationMinutes} min` : "Durata non inserita"}
                {workoutLog.activeCalories ? ` · ${workoutLog.activeCalories} kcal attive` : ""}
              </p>
              {workoutLog.energyLevel || workoutLog.effortLevel ? (
                <p className="mt-1 text-sm text-muted">
                  Energia {workoutLog.energyLevel ?? "n/d"} · Fatica {workoutLog.effortLevel ?? "n/d"}
                </p>
              ) : null}
            </>
          ) : (
            <p className="text-sm leading-relaxed text-muted">Workout non ancora segnato. Se salta, manteniamo il piano e ripartiamo domani.</p>
          )}
          <p className="mt-2 text-xs font-semibold leading-relaxed text-muted">Calorie attività non aggiunte automaticamente al budget.</p>
        </div>
        <button
          type="button"
          onClick={onOpenWorkout}
          className="mt-3 flex h-11 w-full items-center justify-center rounded-lg bg-accent text-sm font-bold text-white"
        >
          Apri Workout
        </button>
      </section>

      <section className="rounded-lg border border-border bg-warning-soft p-4">
        <div className="mb-3 flex items-center gap-2 text-warning">
          <AlertTriangle size={21} />
          <h2 className="text-lg font-bold">Sleeve / reflusso</h2>
        </div>
        <ul className="space-y-2 text-sm leading-relaxed text-foreground">
          {plan.refluxNotes.slice(0, 4).map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

function mealLabel(slot: TodayPlan["plannedMeals"][number]["slot"]) {
  return mealSlotLabel(slot);
}

function mealSlotLabel(slot: MealSlot) {
  return mealSlotOptions.find((option) => option.value === slot)?.label ?? slot;
}

function mealCategoryLabel(category: MealLogCategory) {
  return mealLogCategoryOptions.find((option) => option.value === category)?.label ?? category;
}

function createPlannedMealDraft(meal: MealTemplate): MealLogDraft {
  return {
    slot: meal.slot,
    category: "followed",
    description: `${meal.title}: ${meal.description}`,
    macros: meal.estimatedMacros,
    notes: meal.alternatives?.length ? `Alternativa rapida: ${meal.alternatives[0]}` : undefined,
  };
}

function mealMacroLabel(meal: MealTemplate) {
  const macros = meal.estimatedMacros;
  if (!macros) return "";

  const parts = [`Stima ${macros.kcal} kcal`];
  if (macros.proteinG !== undefined) parts.push(`P ${macros.proteinG} g`);
  if (macros.carbsG !== undefined) parts.push(`C ${macros.carbsG} g`);
  if (macros.fatG !== undefined) parts.push(`G ${macros.fatG} g`);
  return parts.join(" · ");
}

function macroRemainingLabel(mealLogs: MealLog[], macro: "proteinG" | "carbsG" | "fatG", remaining: number) {
  const hasEstimate = mealLogs.some((log) => log.macros[macro] !== undefined);
  return hasEstimate ? `${remaining} g rest.` : "Non stimate";
}

function macroLogLabel(log: MealLog) {
  const protein = log.macros.proteinG === undefined ? "P n/d" : `P ${log.macros.proteinG} g`;
  const carbs = log.macros.carbsG === undefined ? "C n/d" : `C ${log.macros.carbsG} g`;
  const fat = log.macros.fatG === undefined ? "G n/d" : `G ${log.macros.fatG} g`;
  return `${protein} · ${carbs} · ${fat}`;
}
