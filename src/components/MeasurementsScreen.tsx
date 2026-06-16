"use client";

import { Save, Scale, Trash2 } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import type { WaistEntry, WeightEntry } from "@/domain/types";
import { calculateWeightTrend } from "@/logic/calculateWeightTrend";

type MeasurementsScreenProps = {
  date: string;
  weightEntries: WeightEntry[];
  waistEntries: WaistEntry[];
  onSaveWeight: (entry: WeightEntry) => Promise<void>;
  onSaveWaist: (entry: WaistEntry) => Promise<void>;
  onDeleteWeight: (id: string) => Promise<void>;
  onDeleteWaist: (id: string) => Promise<void>;
};

export function MeasurementsScreen({
  date,
  weightEntries,
  waistEntries,
  onSaveWeight,
  onSaveWaist,
  onDeleteWeight,
  onDeleteWaist,
}: MeasurementsScreenProps) {
  const todayWeight = weightEntries.find((entry) => entry.date === date);
  const todayWaist = waistEntries.find((entry) => entry.date === date);
  const [weightKg, setWeightKg] = useState(todayWeight ? String(todayWeight.weightKg) : "");
  const [weightNote, setWeightNote] = useState(todayWeight?.note ?? "");
  const [waistCm, setWaistCm] = useState(todayWaist ? String(todayWaist.waistCm) : "");
  const [waistNote, setWaistNote] = useState(todayWaist?.note ?? "");
  const trend = useMemo(() => calculateWeightTrend(weightEntries), [weightEntries]);

  async function handleWeightSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedWeight = parseNumber(weightKg);
    if (!parsedWeight) return;

    const now = new Date().toISOString();
    await onSaveWeight({
      id: todayWeight?.id ?? createId(),
      date,
      weightKg: roundOneDecimal(parsedWeight),
      note: weightNote.trim() || undefined,
      createdAt: todayWeight?.createdAt ?? now,
      updatedAt: todayWeight ? now : undefined,
    });
  }

  async function handleWaistSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const parsedWaist = parseNumber(waistCm);
    if (!parsedWaist) return;

    const now = new Date().toISOString();
    await onSaveWaist({
      id: todayWaist?.id ?? createId(),
      date,
      waistCm: roundOneDecimal(parsedWaist),
      note: waistNote.trim() || undefined,
      createdAt: todayWaist?.createdAt ?? now,
      updatedAt: todayWaist ? now : undefined,
    });
  }

  const recentWeights = [...weightEntries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 7);
  const recentWaists = [...waistEntries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-5">
      <header className="mb-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <Scale size={18} />
          <span>Peso & Misure</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight">Peso & Misure</h1>
        <p className="mt-2 text-base leading-relaxed text-muted">Non giudicare il singolo giorno: usa la media settimanale.</p>
      </header>

      <section className="mb-4 rounded-lg border border-accent-soft bg-accent-soft p-4 text-accent-strong">
        <h2 className="text-lg font-bold">Trend peso</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          <Metric label="Ultimo" value={trend.latestWeight ? `${trend.latestWeight.weightKg} kg` : "n/d"} />
          <Metric label="Media 7g" value={trend.currentSevenDayAverage ? `${trend.currentSevenDayAverage} kg` : "n/d"} />
          <Metric
            label="Var. sett."
            value={trend.weeklyDifference === undefined ? "n/d" : `${trend.weeklyDifference > 0 ? "+" : ""}${trend.weeklyDifference} kg`}
          />
        </div>
        <p className="mt-3 text-sm leading-relaxed">{trend.message}</p>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Peso di oggi</h2>
        {todayWeight ? <p className="mt-1 text-sm text-muted">Già inserito: {todayWeight.weightKg} kg</p> : null}
        <form onSubmit={handleWeightSubmit} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm font-semibold text-muted">Peso kg</span>
            <input
              inputMode="decimal"
              value={weightKg}
              onChange={(event) => setWeightKg(event.target.value)}
              placeholder="110"
              className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-muted">Nota</span>
            <input
              value={weightNote}
              onChange={(event) => setWeightNote(event.target.value)}
              placeholder="Es. test peso"
              className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted"
            />
          </label>
          <button type="submit" className="flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-accent text-base font-bold text-white">
            <Save size={19} />
            Salva peso
          </button>
        </form>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Circonferenza vita</h2>
        {todayWaist ? <p className="mt-1 text-sm text-muted">Già inserita: {todayWaist.waistCm} cm</p> : null}
        <form onSubmit={handleWaistSubmit} className="mt-4 space-y-3">
          <label className="block">
            <span className="text-sm font-semibold text-muted">Vita cm</span>
            <input
              inputMode="decimal"
              value={waistCm}
              onChange={(event) => setWaistCm(event.target.value)}
              placeholder="115"
              className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-muted">Nota</span>
            <input
              value={waistNote}
              onChange={(event) => setWaistNote(event.target.value)}
              placeholder="Mattina, stesso punto"
              className="mt-2 h-12 w-full rounded-lg border border-border bg-background px-3 text-base text-foreground placeholder:text-muted"
            />
          </label>
          <button type="submit" className="flex h-13 w-full items-center justify-center gap-2 rounded-lg bg-accent text-base font-bold text-white">
            <Save size={19} />
            Salva vita
          </button>
        </form>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Storico recente</h2>
        <div className="mt-4 space-y-3">
          <HistoryBlock title="Peso" empty="Nessun peso salvato." entries={recentWeights} unit="kg" getValue={(entry) => entry.weightKg} onDelete={onDeleteWeight} />
          <HistoryBlock title="Vita" empty="Nessuna misura vita salvata." entries={recentWaists} unit="cm" getValue={(entry) => entry.waistCm} onDelete={onDeleteWaist} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-warning-soft p-4 text-sm leading-relaxed text-foreground">
        <p>Peso: puoi registrarlo quasi ogni giorno.</p>
        <p className="mt-1">Vita: meglio 1 volta a settimana, al mattino, sempre nello stesso punto.</p>
        <p className="mt-1 font-bold">Non giudicare il singolo giorno: usa la media settimanale.</p>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-surface px-2 py-2">
      <div className="text-xs font-bold uppercase text-muted">{label}</div>
      <div className="mt-1 text-base font-bold text-foreground">{value}</div>
    </div>
  );
}

function HistoryBlock<T extends WeightEntry | WaistEntry>({
  title,
  empty,
  entries,
  unit,
  getValue,
  onDelete,
}: {
  title: string;
  empty: string;
  entries: T[];
  unit: string;
  getValue: (entry: T) => number;
  onDelete: (id: string) => Promise<void>;
}) {
  return (
    <div className="rounded-lg bg-background p-3">
      <h3 className="text-base font-bold">{title}</h3>
      {entries.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      ) : (
        <div className="mt-3 space-y-2">
          {entries.map((entry) => (
            <article key={entry.id} className="rounded-lg bg-surface p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-bold">
                    {getValue(entry)} {unit}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-muted">{entry.date}</div>
                  {entry.note ? <p className="mt-1 text-sm text-muted">{entry.note}</p> : null}
                </div>
                <button type="button" onClick={() => onDelete(entry.id)} className="flex h-10 items-center gap-1 rounded-lg px-2 text-sm font-bold text-warning">
                  <Trash2 size={16} />
                  Elimina
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function parseNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return undefined;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function roundOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
