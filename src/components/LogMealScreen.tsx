"use client";

import { ArrowLeft, Save, Utensils } from "lucide-react";
import { FormEvent, useState } from "react";
import { mealLogCategoryOptions, mealSlotOptions } from "@/data/mealLogOptions";
import type { MealLog, MealLogCategory, MealLogDraft, MealSlot } from "@/domain/types";

type LogMealScreenProps = {
  date: string;
  onSave: (mealLog: MealLog) => Promise<void>;
  onCancel: () => void;
  initialMealLog?: MealLog | null;
  initialDraft?: MealLogDraft | null;
};

export function LogMealScreen({ date, onSave, onCancel, initialMealLog, initialDraft }: LogMealScreenProps) {
  const isEditing = Boolean(initialMealLog);
  const seed = initialMealLog ?? initialDraft;
  const [slot, setSlot] = useState<MealSlot>(seed?.slot ?? "lunch");
  const [category, setCategory] = useState<MealLogCategory>(initialMealLog?.category ?? initialDraft?.category ?? "modified");
  const [description, setDescription] = useState(seed?.description ?? "");
  const [kcal, setKcal] = useState(seed?.macros?.kcal ? String(seed.macros.kcal) : "");
  const [proteinG, setProteinG] = useState(optionalString(seed?.macros?.proteinG));
  const [carbsG, setCarbsG] = useState(optionalString(seed?.macros?.carbsG));
  const [fatG, setFatG] = useState(optionalString(seed?.macros?.fatG));
  const [notes, setNotes] = useState(seed?.notes ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedKcal = parseNumber(kcal);
    if (!description.trim()) {
      setError("Aggiungi una descrizione semplice del pasto.");
      return;
    }

    if (!parsedKcal || parsedKcal <= 0) {
      setError("Inserisci una stima kcal maggiore di zero.");
      return;
    }

    setSaving(true);
    await onSave({
      id: initialMealLog?.id ?? createId(),
      date,
      slot,
      category,
      description: description.trim(),
      macros: {
        kcal: Math.round(parsedKcal),
        proteinG: optionalNumber(proteinG),
        carbsG: optionalNumber(carbsG),
        fatG: optionalNumber(fatG),
      },
      notes: notes.trim() || undefined,
    });
    setSaving(false);
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-5">
      <header className="mb-5">
        <button
          type="button"
          onClick={onCancel}
          className="mb-4 flex h-11 items-center gap-2 rounded-lg px-1 text-sm font-bold text-accent-strong"
        >
          <ArrowLeft size={20} />
          Annulla
        </button>
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Utensils size={18} />
          <span>{isEditing ? "Modifica pasto" : "Log Pasto"}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight">{isEditing ? "Correggi il pasto" : "Cosa hai mangiato?"}</h1>
        <p className="mt-2 text-base leading-relaxed text-muted">
          {initialDraft?.description
            ? "Ho precompilato dal piano di oggi. Correggi pure quello che e cambiato."
            : "Inserisci una stima pratica. Meglio un dato semplice oggi che una precisione perfetta mai."}
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4">
        <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <label className="block text-sm font-semibold text-muted" htmlFor="meal-slot">
            Pasto
          </label>
          <select
            id="meal-slot"
            value={slot}
            onChange={(event) => setSlot(event.target.value as MealSlot)}
            className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground"
          >
            {mealSlotOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <label className="mt-4 block text-sm font-semibold text-muted" htmlFor="meal-category">
            Categoria rapida
          </label>
          <select
            id="meal-category"
            value={category}
            onChange={(event) => setCategory(event.target.value as MealLogCategory)}
            className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground"
          >
            {mealLogCategoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </section>

        <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <label className="block text-sm font-semibold text-muted" htmlFor="meal-description">
            Descrizione
          </label>
          <textarea
            id="meal-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Es. risotto + dolce, bowl pollo, yogurt proteico..."
            rows={4}
            className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-3 text-base text-foreground placeholder:text-muted"
          />

          <label className="mt-4 block text-sm font-semibold text-muted" htmlFor="meal-kcal">
            Kcal stimate
          </label>
          <input
            id="meal-kcal"
            inputMode="numeric"
            value={kcal}
            onChange={(event) => setKcal(event.target.value)}
            placeholder="Es. 520"
            className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted"
          />
        </section>

        <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
          <div className="text-sm font-semibold text-muted">Macro opzionali</div>
          <p className="mt-1 text-sm leading-relaxed text-muted">Se non le sai, lascia vuoto: verranno scalate solo le kcal.</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            <MacroInput label="Proteine" value={proteinG} onChange={setProteinG} />
            <MacroInput label="Carbo" value={carbsG} onChange={setCarbsG} />
            <MacroInput label="Grassi" value={fatG} onChange={setFatG} />
          </div>

          <label className="mt-4 block text-sm font-semibold text-muted" htmlFor="meal-notes">
            Note
          </label>
          <textarea
            id="meal-notes"
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder="Fame, reflusso, cena tardi, contesto..."
            rows={3}
            className="mt-2 w-full resize-none rounded-lg border border-border bg-background px-3 py-3 text-base text-foreground placeholder:text-muted"
          />
        </section>

        {error ? <p className="rounded-lg bg-warning-soft px-3 py-2 text-sm font-medium text-warning">{error}</p> : null}

        <div className="sticky bottom-24 z-10 space-y-2 rounded-lg border border-border bg-surface/95 p-2 shadow-lg backdrop-blur">
          <button
            type="submit"
            disabled={saving}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-lg bg-accent text-base font-bold text-white disabled:opacity-70"
          >
            <Save size={20} />
            {saving ? "Salvataggio..." : isEditing ? "Salva modifiche" : "Salva pasto"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-12 w-full items-center justify-center rounded-lg border border-border bg-background text-base font-bold text-foreground"
          >
            Annulla
          </button>
        </div>
      </form>
    </main>
  );
}

function MacroInput({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold text-muted">{label}</span>
      <input
        inputMode="numeric"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="g"
        className="mt-1 h-11 w-full rounded-lg border border-border bg-background px-2 text-base text-foreground placeholder:text-muted"
      />
    </label>
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
