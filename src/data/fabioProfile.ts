import type { UserProfile } from "@/domain/types";

export const fabioProfile: UserProfile = {
  id: "fabio",
  name: "Fabio",
  heightCm: 183,
  startingWeightKg: 110,
  targetWeightKg: 90,
  goals: ["Dimagrire", "Mantenere forza", "Proteggere massa muscolare"],
  conditions: ["Celiachia", "Sleeve gastrectomy", "Reflusso post sleeve"],
  preferences: {
    mealsPerDay: "3 pasti piccoli + 1 spuntino",
    glutenFree: true,
    lactoseFreePreferred: true,
    fishPerWeek: "2-3 volte/settimana",
    water: "Oltre 2 litri al giorno",
    alcohol: "Gin tonic 1 volta/settimana, a volte 2",
  },
  exclusions: ["Glutine", "Peperoni", "Pomodori crudi", "Latticini non delattosati se possibile"],
  sleeveRefluxRules: [
    "Pasti piccoli.",
    "Proteine prima, poi verdure, poi carboidrati.",
    "Evita cena troppo abbondante.",
    "Evita troppi grassi in un solo pasto.",
    "Attenzione ad alcol a stomaco vuoto.",
    "Se ceni dopo le 20:30, scegli una cena più leggera.",
  ],
};
