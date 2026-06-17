"use client";

import { HeartPulse, ShieldCheck, User } from "lucide-react";
import { rawWeightNote } from "@/data/mealPrepTemplates";
import { nutritionTargets } from "@/data/nutritionTargets";
import type { UserProfile } from "@/domain/types";

type ProfileSettingsScreenProps = {
  profile: UserProfile;
};

const futureIntegrations = [
  "Apple Health: planned / not active",
  "Apple Watch: planned / not active",
  "Withings: planned / not active",
  "Calendario personale: non attivo",
  "Foto-pasto AI: non attivo",
  "Notifiche: non attive",
  "Cloud sync: non attivo",
];

export function ProfileSettingsScreen({ profile }: ProfileSettingsScreenProps) {
  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-5">
      <header className="mb-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <User size={18} />
          <span>Profilo</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight">Profilo & Impostazioni</h1>
        <p className="mt-2 text-base leading-relaxed text-muted">Regole personali dell’app, senza pannelli complicati.</p>
      </header>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Fabio</h2>
        <div className="mt-4 grid grid-cols-2 gap-2">
          <InfoTile label="Altezza" value={`${profile.heightCm} cm`} />
          <InfoTile label="Peso iniziale" value={`${profile.startingWeightKg} kg`} />
          <InfoTile label="Peso obiettivo" value={`${profile.targetWeightKg} kg`} />
          <InfoTile label="Pasti" value={profile.preferences.mealsPerDay} />
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">Obiettivo: dimagrire mantenendo forza e massa muscolare.</p>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <ShieldCheck className="text-accent" size={22} />
          <h2 className="text-xl font-bold">Regole personali</h2>
        </div>
        <InfoList
          items={[
            "Celiachia: sì",
            "Sleeve gastrectomy: sì",
            "Reflusso post sleeve: sì",
            "Senza glutine obbligatorio",
            "Latticini preferibilmente delattosati",
            "Pesce: 2-3 volte a settimana",
            "Pasto libero: domenica pranzo dai genitori",
            "Alcol: gin tonic 1 volta/settimana, a volte 2",
          ]}
        />
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Alimentazione / esclusioni</h2>
        <InfoList
          items={[
            "No peperoni",
            "No pomodori crudi",
            "Cena abbondante = possibile trigger reflusso",
            "Proteine prima, poi verdure, poi carboidrati",
            rawWeightNote,
            "Carne, pollo, tacchino, pesce, riso, quinoa, grano saraceno, pasta e patate: usa peso da crudo.",
            "Legumi in barattolo: peso cotto/scolato perche gia cotti.",
            "Tonno/salmone in busta: peso sgocciolato/confezione perche gia pronto.",
            ...profile.sleeveRefluxRules,
          ]}
        />
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Target giornata</h2>
        <div className="mt-4 space-y-2">
          {nutritionTargets.map((target) => (
            <article key={target.dayType} className="rounded-lg bg-background p-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold">{target.label}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{target.note}</p>
                </div>
                <div className="shrink-0 text-right text-base font-bold text-accent-strong">
                  {target.target.kcal.min === target.target.kcal.max
                    ? `${target.target.kcal.max}`
                    : `${target.target.kcal.min}-${target.target.kcal.max}`}{" "}
                  kcal
                </div>
              </div>
              <p className="mt-2 text-sm font-semibold text-muted">
                Proteine {target.target.proteinG.min}-{target.target.proteinG.max} g · Carbo {target.target.carbsG.min}-{target.target.carbsG.max} g
              </p>
            </article>
          ))}
        </div>
        <p className="mt-3 rounded-lg bg-accent-soft p-3 text-sm font-bold text-accent-strong">Proteine target: circa 155-170 g/die.</p>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <div className="mb-3 flex items-center gap-2">
          <HeartPulse className="text-accent" size={22} />
          <h2 className="text-xl font-bold">Sorgenti future</h2>
        </div>
        <InfoList
          items={[
            "Workout guidati casa: Apple Fitness+",
            "Corsa/camminata: Apple Watch",
            "Dati attivita futuri: Apple Health",
            "Peso futuro: Withings / Apple Health",
            "MVP PWA: workout inserito manualmente.",
            "Versione iOS futura: import automatico da Apple Health / Apple Watch.",
            "Dati futuri: workout completati, camminata/corsa, durata, calorie attive, passi.",
            "Prossimo step: app nativa iPhone.",
            "Obiettivo futuro: aggiornamenti automatici da Apple Health, Apple Watch, calendario e bilancia smart.",
            "App nativa futura: import workout, durata allenamento, calorie attive, camminata/corsa e passi.",
            "App nativa futura: peso corporeo da Withings o Apple Health.",
            "App nativa futura: calendario per capire casa, trasferta e giornate con Edoardo.",
            "App nativa futura: aggiornamento automatico della Home e ricalcolo giornaliero più intelligente.",
            "Le calorie attivita non saranno aggiunte automaticamente al budget alimentare.",
          ]}
        />
        <p className="mt-3 rounded-lg bg-background p-3 text-sm leading-relaxed text-muted">
          L’app non crea workout complessi: organizza dieta e routine leggendo in futuro i dati da Apple Health/Watch/Withings.
        </p>
      </section>

      <section className="rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Integrazioni future</h2>
        <InfoList items={futureIntegrations} />
      </section>
    </main>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-background p-3">
      <div className="text-xs font-bold uppercase text-muted">{label}</div>
      <div className="mt-1 text-base font-bold text-foreground">{value}</div>
    </div>
  );
}

function InfoList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted">
      {items.map((item) => (
        <li key={item} className="rounded-lg bg-background px-3 py-2">
          {item}
        </li>
      ))}
    </ul>
  );
}
