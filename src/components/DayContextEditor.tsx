"use client";

import { useState } from "react";
import { RotateCcw, Save, X } from "lucide-react";
import type { DayContext, DayFamily, DayLocation } from "@/domain/types";
import { createDefaultDayContext, familyLabel, locationLabel } from "@/logic/dayContext";

type DayContextEditorProps = {
  date: string;
  value: DayContext;
  onSave: (context: DayContext) => void;
  onReset: () => void;
  onCancel: () => void;
};

const locationOptions: { value: DayLocation; label: string }[] = [
  { value: "home", label: "A casa" },
  { value: "car_travel", label: "Trasferta in auto" },
  { value: "far_travel", label: "Trasferta lontana / hotel" },
];

const familyOptions: { value: DayFamily; label: string }[] = [
  { value: "with_edoardo", label: "Con Edoardo" },
  { value: "without_edoardo", label: "Senza Edoardo" },
  { value: "unset", label: "Non impostato" },
];

export function DayContextEditor({ date, value, onSave, onReset, onCancel }: DayContextEditorProps) {
  const [context, setContext] = useState(value);

  function updateLocation(location: DayLocation) {
    setContext({ ...context, location });
  }

  function updateFamily(family: DayFamily) {
    setContext({ ...context, family });
  }

  function toggleFlag(flag: keyof DayContext["flags"]) {
    setContext({ ...context, flags: { ...context.flags, [flag]: !context.flags[flag] } });
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-5">
      <header className="mb-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-muted">Giornata di oggi</p>
            <h1 className="mt-2 text-3xl font-bold leading-tight">Modifica giornata</h1>
          </div>
          <button type="button" onClick={onCancel} className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-surface text-foreground" aria-label="Chiudi">
            <X size={20} />
          </button>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Scelte manuali salvate solo per oggi. Influenzano pasti, target e note operative della Home.
        </p>
      </header>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Luogo / situazione</h2>
        <div className="mt-3 grid gap-2">
          {locationOptions.map((option) => (
            <ChoiceButton key={option.value} selected={context.location === option.value} label={option.label} onClick={() => updateLocation(option.value)} />
          ))}
        </div>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Famiglia</h2>
        <div className="mt-3 grid gap-2">
          {familyOptions.map((option) => (
            <ChoiceButton key={option.value} selected={context.family === option.value} label={option.label} onClick={() => updateFamily(option.value)} />
          ))}
        </div>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Extra giornata</h2>
        <div className="mt-3 grid gap-2">
          <ChoiceButton selected={context.flags.dinnerOut} label="Cena fuori" onClick={() => toggleFlag("dinnerOut")} />
          <ChoiceButton selected={context.flags.aperitif} label="Aperitivo / gin tonic" onClick={() => toggleFlag("aperitif")} />
          <ChoiceButton selected={context.flags.skippedWorkout} label="Allenamento saltato" onClick={() => toggleFlag("skippedWorkout")} />
          <ChoiceButton selected={context.flags.recoveryDay} label="Giorno recupero" onClick={() => toggleFlag("recoveryDay")} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-lg font-bold">Riepilogo</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {locationLabel(context.location)} · {familyLabel(context.family)}
          {context.flags.dinnerOut ? " · Cena fuori" : ""}
          {context.flags.aperitif ? " · Aperitivo" : ""}
          {context.flags.skippedWorkout ? " · Allenamento saltato" : ""}
          {context.flags.recoveryDay ? " · Recupero" : ""}
        </p>
        <button type="button" onClick={() => onSave(context)} className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-accent text-base font-bold text-white">
          <Save size={20} />
          Salva giornata
        </button>
        <button
          type="button"
          onClick={() => {
            setContext(createDefaultDayContext(date));
            onReset();
          }}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-border bg-background text-base font-bold text-foreground"
        >
          <RotateCcw size={20} />
          Reset giornata
        </button>
      </section>
    </main>
  );
}

function ChoiceButton({ selected, label, onClick }: { selected: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-12 rounded-lg border px-4 py-3 text-left text-base font-bold ${
        selected ? "border-accent bg-accent-soft text-accent-strong" : "border-border bg-background text-foreground"
      }`}
    >
      {label}
    </button>
  );
}
