import type { MealTemplate } from "@/domain/types";

export const homeWorkoutMealTemplates: MealTemplate[] = [
  {
    id: "home-workout-breakfast",
    slot: "breakfast",
    title: "Colazione post workout",
    description: "Shaker proteico senza glutine + banana. Piccolo, rapido, proteico.",
    estimatedMacros: { kcal: 280, proteinG: 30, carbsG: 34, fatG: 4 },
    alternatives: [
      "Skyr delattosato 250 g + banana",
      "Yogurt proteico delattosato pronto + frutto",
      "Overnight oats proteico GF",
    ],
  },
  {
    id: "home-workout-lunch",
    slot: "lunch",
    title: "Bowl pollo/tacchino",
    description: "Pollo/tacchino 220-250 g da crudo + riso basmati 55 g da crudo (circa 140-165 g cotto) + zucchine/carote 200-250 g da crudo o porzione libera + 1 cucchiaino olio EVO.",
    estimatedMacros: { kcal: 500, proteinG: 47, carbsG: 52, fatG: 12 },
    alternatives: ["Bowl salmone", "Bowl legumi + proteina", "Bowl manzo magro"],
    refluxNote: "Porzione regolare e ben masticata: proteine prima.",
  },
  {
    id: "home-workout-snack",
    slot: "snack",
    title: "Gallette GF + tonno",
    description: "2-3 gallette senza glutine + tonno naturale 80-100 g sgocciolato/confezione.",
    estimatedMacros: { kcal: 250, proteinG: 26, carbsG: 28, fatG: 4 },
    alternatives: ["Yogurt proteico delattosato + frutto", "Barretta proteica GF + frutto"],
  },
  {
    id: "home-workout-dinner",
    slot: "dinner",
    title: "Salmone + patate + broccoli",
    description: "Salmone 180-200 g da crudo o filetto surgelato monoporzione + patate 250-300 g da crudo + broccoli 200-250 g da crudo o porzione libera.",
    estimatedMacros: { kcal: 550, proteinG: 43, carbsG: 48, fatG: 20 },
    alternatives: ["Pesce bianco 180-220 g da crudo + patate 250-300 g da crudo + verdure", "Carne magra 200-220 g da crudo + riso 60-70 g da crudo + verdure", "Uova + verdure + pane GF pesato"],
    refluxNote: "Evita cena troppo abbondante, soprattutto dopo le 20:30.",
  },
  {
    id: "home-workout-after-dinner",
    slot: "afterDinner",
    title: "Dopo cena opzionale",
    description: "Ghiacciolo piccolo oppure yogurt delattosato piccolo, solo se serve davvero.",
    estimatedMacros: { kcal: 80, proteinG: 8, carbsG: 10, fatG: 1 },
    alternatives: ["Tisana", "2 gallette pesate", "Niente se c'e reflusso"],
    refluxNote: "Se reflusso attivo o cena tardi, meglio evitare snack.",
  },
];

export const walkRunMealTemplates: MealTemplate[] = [
  {
    id: "walkrun-breakfast",
    slot: "breakfast",
    title: "Skyr + frutta + avena GF",
    description: "Skyr delattosato 250 g + frutta + avena senza glutine 25-30 g.",
    estimatedMacros: { kcal: 330, proteinG: 32, carbsG: 42, fatG: 5 },
    alternatives: ["Shaker proteico + banana", "Yogurt proteico delattosato pronto + frutto"],
  },
  {
    id: "walkrun-lunch",
    slot: "lunch",
    title: "Bowl riso/quinoa + proteina",
    description: "Riso/quinoa/grano saraceno 50-60 g da crudo + proteina 220-250 g da crudo + verdure 200-250 g da crudo o porzione libera + 1 cucchiaino olio EVO.",
    estimatedMacros: { kcal: 520, proteinG: 45, carbsG: 58, fatG: 12 },
    alternatives: ["Bowl pollo/tacchino", "Bowl salmone", "Poke GF controllato"],
    refluxNote: "Proteine prima, poi verdure, poi carboidrati.",
  },
  {
    id: "walkrun-snack",
    slot: "snack",
    title: "Barretta proteica GF + frutto",
    description: "Barretta proteica senza glutine + un frutto, pratica se sei fuori.",
    estimatedMacros: { kcal: 260, proteinG: 22, carbsG: 34, fatG: 6 },
    alternatives: ["Gallette GF + tonno naturale", "Yogurt proteico delattosato + frutto"],
  },
  {
    id: "walkrun-dinner",
    slot: "dinner",
    title: "Pasta SG con ragu magro",
    description: "Pasta senza glutine 60-70 g da crudo + ragu magro da circa 180-220 g carne cruda, oppure pesce 180-220 g da crudo + patate 250-300 g da crudo.",
    estimatedMacros: { kcal: 560, proteinG: 45, carbsG: 60, fatG: 16 },
    alternatives: ["Pesce 180-220 g da crudo + patate 250-300 g da crudo + verdure", "Risotto semplice con riso 60-70 g da crudo + proteina", "Carne magra 200-220 g da crudo + riso 60-70 g da crudo + verdure"],
    refluxNote: "Cena completa ma non gigante: meglio chiudere prima che sentirsi pieni.",
  },
  {
    id: "walkrun-after-dinner",
    slot: "afterDinner",
    title: "Dopo cena opzionale",
    description: "Yogurt delattosato piccolo o tisana, solo se fame vera.",
    estimatedMacros: { kcal: 90, proteinG: 9, carbsG: 11, fatG: 1 },
    alternatives: ["Ghiacciolo piccolo", "Tisana", "Niente se c'e reflusso"],
    refluxNote: "Se reflusso attivo o cena tardi, meglio evitare snack.",
  },
];

export const recoveryMealTemplates: MealTemplate[] = [
  {
    id: "recovery-breakfast",
    slot: "breakfast",
    title: "Skyr/yogurt delattosato + frutta",
    description: "Skyr o yogurt proteico delattosato + frutta. Avena GF solo se serve energia.",
    estimatedMacros: { kcal: 280, proteinG: 30, carbsG: 30, fatG: 4 },
    alternatives: ["Shaker proteico + frutto", "Yogurt proteico pronto"],
  },
  {
    id: "recovery-lunch",
    slot: "lunch",
    title: "Bowl proteica ridotta",
    description: "Proteina 200-220 g da crudo + riso/quinoa/grano saraceno 40-50 g da crudo oppure patate 200-250 g da crudo + verdure 200-250 g da crudo o porzione libera.",
    estimatedMacros: { kcal: 470, proteinG: 48, carbsG: 42, fatG: 12 },
    alternatives: ["Bowl pollo/tacchino con riso 40-50 g da crudo", "Bowl legumi + proteina + grano saraceno 40-50 g da crudo", "Insalata tiepida proteica GF"],
    refluxNote: "Porzione piccola e masticazione lenta.",
  },
  {
    id: "recovery-snack",
    slot: "snack",
    title: "Yogurt proteico o frutto + proteina",
    description: "Yogurt proteico delattosato oppure frutto + tonno/uova/skyr.",
    estimatedMacros: { kcal: 220, proteinG: 24, carbsG: 24, fatG: 4 },
    alternatives: ["Gallette GF + tonno", "Barretta proteica GF se sei fuori"],
  },
  {
    id: "recovery-dinner",
    slot: "dinner",
    title: "Proteina + verdure + carbo controllato",
    description: "Pesce/carne 180-220 g da crudo oppure uova + verdure 200-250 g da crudo o porzione libera + patate 200-250 g da crudo oppure pasta/riso 50-60 g da crudo.",
    estimatedMacros: { kcal: 500, proteinG: 48, carbsG: 35, fatG: 16 },
    alternatives: ["Cena freezer semplice", "Pesce 180-220 g da crudo + verdure + patate 200-250 g da crudo", "Uova + verdure + pane GF"],
    refluxNote: "Recupero: cena ordinata e non tardiva, senza rincorrere fame nervosa.",
  },
  {
    id: "recovery-after-dinner",
    slot: "afterDinner",
    title: "Dopo cena opzionale",
    description: "Tisana o yogurt piccolo solo se serve. Se e solo voglia, chiudi qui.",
    estimatedMacros: { kcal: 80, proteinG: 8, carbsG: 10, fatG: 1 },
    alternatives: ["Ghiacciolo piccolo", "Tisana", "Niente se c'e reflusso"],
    refluxNote: "Se reflusso attivo o cena tardi, meglio evitare snack.",
  },
];

export const standardMealTemplates = recoveryMealTemplates;

export const travelCarMealTemplates: MealTemplate[] = [
  {
    id: "travel-car-breakfast",
    slot: "breakfast",
    title: "Colazione casa/hotel",
    description: "Yogurt, frutta, semi, cappuccino; se proteine basse, barretta GF o shaker.",
    estimatedMacros: { kcal: 350, proteinG: 30, carbsG: 35, fatG: 10 },
  },
  {
    id: "travel-car-lunch",
    slot: "lunch",
    title: "Meal prep in borsa frigo",
    description: "Bowl freezer gia porzionata: proteina da crudo gia indicata in prep + riso/quinoa/grano saraceno 50-60 g da crudo.",
    estimatedMacros: { kcal: 520, proteinG: 45, carbsG: 55, fatG: 14 },
  },
  {
    id: "travel-car-snack",
    slot: "snack",
    title: "Kit auto",
    description: "Barretta proteica GF + frutto o crackers GF pesati.",
    estimatedMacros: { kcal: 260, proteinG: 22, carbsG: 30, fatG: 7 },
  },
  {
    id: "travel-car-dinner",
    slot: "dinner",
    title: "Cena fuori: un piatto solo",
    description: "Pesce/tagliata/poke GF con proteina, oppure pasta GF 60-70 g da crudo se disponibile come porzione chiara.",
    estimatedMacros: { kcal: 650, proteinG: 45, carbsG: 65, fatG: 22 },
  },
];

export const travelFarMealTemplates: MealTemplate[] = [
  {
    id: "travel-far-breakfast",
    slot: "breakfast",
    title: "Hotel breakfast preset",
    description: "Yogurt, frutta, semi, 10-15 g frutta secca, cappuccino, eventuale barretta GF.",
    estimatedMacros: { kcal: 420, proteinG: 32, carbsG: 40, fatG: 15 },
  },
  {
    id: "travel-far-lunch",
    slot: "lunch",
    title: "Pranzo fuori controllato",
    description: "Bar, ristorante o supermercato: proteine prioritarie e carboidrato semplice senza glutine. Quando puoi, usa porzioni crude dichiarate o etichette.",
    estimatedMacros: { kcal: 580, proteinG: 40, carbsG: 60, fatG: 18 },
  },
  {
    id: "travel-far-snack",
    slot: "snack",
    title: "Kit emergenza",
    description: "Barretta proteica GF, frutto o yogurt proteico se disponibile.",
    estimatedMacros: { kcal: 240, proteinG: 22, carbsG: 26, fatG: 6 },
  },
  {
    id: "travel-far-dinner",
    slot: "dinner",
    title: "Cena fuori: un piatto solo",
    description: "Scegli un piatto completo, senza inseguire la perfezione.",
    estimatedMacros: { kcal: 700, proteinG: 45, carbsG: 70, fatG: 24 },
  },
];

export const sundayFreeMealTemplates: MealTemplate[] = [
  {
    id: "sunday-light-breakfast",
    slot: "breakfast",
    title: "Colazione leggera",
    description: "Yogurt delattosato o shaker leggero + frutto.",
    estimatedMacros: { kcal: 280, proteinG: 28, carbsG: 28, fatG: 5 },
  },
  {
    id: "sunday-free-lunch",
    slot: "lunch",
    title: "Pranzo libero controllato",
    description: "Dai genitori verso le 13:00. Primo oppure secondo, senza trasformare la giornata in libera.",
    estimatedMacros: { kcal: 850, proteinG: 45, carbsG: 90, fatG: 30 },
  },
  {
    id: "sunday-protein-dinner",
    slot: "dinner",
    title: "Cena leggera proteica",
    description: "Pesce/carne 180-220 g da crudo oppure uova + verdure 200-250 g da crudo o porzione libera, pochi grassi e porzione piccola.",
    estimatedMacros: { kcal: 420, proteinG: 45, carbsG: 20, fatG: 16 },
    refluxNote: "Cena leggera: aiuta anche il reflusso post sleeve.",
  },
];
