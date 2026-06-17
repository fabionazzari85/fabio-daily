"use client";

import { Dumbbell, Save, Trash2 } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import type { EffortLevel, EnergyLevel, WorkoutLog, WorkoutPlan } from "@/domain/types";

type WorkoutScreenProps = {
  date: string;
  workoutPlan: WorkoutPlan;
  workoutLog: WorkoutLog | null;
  onSave: (log: WorkoutLog) => Promise<void>;
  onDelete: () => Promise<void>;
};

const energyOptions: EnergyLevel[] = ["bassa", "media", "alta"];
const effortOptions: EffortLevel[] = ["leggero", "giusto", "duro"];

export function WorkoutScreen({ date, workoutPlan, workoutLog, onSave, onDelete }: WorkoutScreenProps) {
  const [completed, setCompleted] = useState(workoutLog?.completed ?? false);
  const [durationMinutes, setDurationMinutes] = useState(optionalString(workoutLog?.durationMinutes));
  const [activeCalories, setActiveCalories] = useState(optionalString(workoutLog?.activeCalories));
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(workoutLog?.energyLevel ?? "media");
  const [effortLevel, setEffortLevel] = useState<EffortLevel>(workoutLog?.effortLevel ?? "giusto");
  const [notes, setNotes] = useState(workoutLog?.notes ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setCompleted(workoutLog?.completed ?? false);
    setDurationMinutes(optionalString(workoutLog?.durationMinutes));
    setActiveCalories(optionalString(workoutLog?.activeCalories));
    setEnergyLevel(workoutLog?.energyLevel ?? "media");
    setEffortLevel(workoutLog?.effortLevel ?? "giusto");
    setNotes(workoutLog?.notes ?? "");
  }, [workoutLog]);

  const isRecovery = workoutPlan.type === "recovery";
  const isIntense = (parseNumber(activeCalories) ?? 0) >= 400 || effortLevel === "duro";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const now = new Date().toISOString();
    setSaving(true);
    await onSave({
      id: workoutLog?.id ?? createId(),
      date,
      plannedType: workoutPlan.title,
      completed,
      durationMinutes: optionalNumber(durationMinutes),
      activeCalories: optionalNumber(activeCalories),
      energyLevel,
      effortLevel,
      notes: notes.trim() || undefined,
      createdAt: workoutLog?.createdAt ?? now,
      updatedAt: workoutLog ? now : undefined,
    });
    setSaving(false);
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-5">
      <header className="mb-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Dumbbell size={18} />
          <span>Workout</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight">Allenamento di oggi</h1>
        <p className="mt-2 text-base leading-relaxed text-muted">
          {isRecovery ? "Oggi recupero: movimento leggero solo se ti fa stare meglio." : "Segna solo cosa hai fatto davvero, senza complicarla."}
        </p>
      </header>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="text-sm font-semibold text-muted">Previsto</div>
        <h2 className="mt-1 text-2xl font-bold">{workoutPlan.title}</h2>
        <p className="mt-2 text-base text-muted">
          {workoutPlan.durationMin.max > 0 ? `${workoutPlan.durationMin.min}-${workoutPlan.durationMin.max} min` : "Recupero"} · Fonte consigliata:{" "}
          {workoutPlan.sourceHint}
        </p>
        <p className="mt-3 rounded-lg bg-background p-3 text-sm leading-relaxed text-muted">
          MVP PWA: workout inserito manualmente. Versione iOS futura: import automatico da Apple Health / Apple Watch per workout completati,
          camminata/corsa, durata, calorie attive e passi.
        </p>
      </section>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <button
            type="button"
            onClick={() => setCompleted((value) => !value)}
            className={`flex h-14 w-full items-center justify-center rounded-lg text-base font-bold ${
              completed ? "bg-accent text-white" : "border border-border bg-background text-foreground"
            }`}
          >
            {completed ? "Workout fatto" : isRecovery ? "Segna mobilità/recupero fatto" : "Segna come fatto"}
          </button>
          {!completed ? (
            <p className="mt-3 text-sm leading-relaxed text-muted">Workout non ancora segnato. Se salta, manteniamo il piano e ripartiamo domani.</p>
          ) : null}
        </section>

        <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="text-sm font-semibold text-muted">Durata reale</span>
              <input
                inputMode="numeric"
                value={durationMinutes}
                onChange={(event) => setDurationMinutes(event.target.value)}
                placeholder="42"
                className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-muted">Kcal attive</span>
              <input
                inputMode="numeric"
                value={activeCalories}
                onChange={(event) => setActiveCalories(event.target.value)}
                placeholder="280"
                className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted"
              />
            </label>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <SegmentedSelect label="Energia" options={energyOptions} value={energyLevel} onChange={setEnergyLevel} />
            <SegmentedSelect label="Fatica" options={effortOptions} value={effortLevel} onChange={setEffortLevel} />
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-muted">Note</span>
            <textarea
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Come è andata, eventuale fame, recupero..."
              rows={4}
              className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-3 text-base text-foreground placeholder:text-muted"
            />
          </label>
        </section>

        <section className="rounded-lg border border-accent-soft bg-accent-soft p-4 text-sm leading-relaxed text-accent-strong">
          <p className="font-bold">Le calorie attività sono un indicatore, non un bonus automatico da rimangiare.</p>
          <p className="mt-2">Apple Health / Apple Watch: planned / not active.</p>
          {isIntense ? <p className="mt-2">Se hai fame vera o calo energetico, valuta uno spuntino proteico controllato.</p> : null}
        </section>

        <div className="sticky bottom-24 z-10 space-y-2 rounded-lg border border-border bg-surface/95 p-2 shadow-lg backdrop-blur">
          <button
            type="submit"
            disabled={saving}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-accent text-base font-bold text-white disabled:opacity-70"
          >
            <Save size={20} />
            {saving ? "Salvataggio..." : "Salva workout"}
          </button>
          {workoutLog ? (
            <button
              type="button"
              onClick={onDelete}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-base font-bold text-warning"
            >
              <Trash2 size={18} />
              Elimina log workout
            </button>
          ) : null}
        </div>
      </form>
    </main>
  );
}

function SegmentedSelect<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: T[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-muted">{label}</legend>
      <div className="mt-2 space-y-2">
        {options.map((option) => (
          <button
            type="button"
            key={option}
            onClick={() => onChange(option)}
            className={`h-11 w-full rounded-lg text-sm font-bold capitalize ${
              value === option ? "bg-accent text-white" : "border border-border bg-background text-foreground"
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function optionalNumber(value: string) {
  const parsed = parseNumber(value);
  return parsed === undefined ? undefined : Math.round(parsed);
}

function optionalString(value: number | undefined) {
  return value === undefined ? "" : String(value);
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
