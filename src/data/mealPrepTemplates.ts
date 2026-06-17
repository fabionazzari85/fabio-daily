import type { MealPrepItem } from "@/domain/types";

export const rawWeightNote = "Pesi indicati da crudo, salvo diversa indicazione.";

export const lunchProteinBatch: MealPrepItem[] = [
  {
    id: "lunch-protein-chicken-turkey",
    title: "Pollo/tacchino batch",
    description: "3 porzioni. Pollo/tacchino 220-250 g da crudo per porzione; totale batch indicativo 700-750 g da crudo.",
    ingredients: ["Pollo/tacchino", "Riso", "Quinoa", "Grano saraceno", "Verdure miste"],
    quantity: "3 porzioni",
    note: "abbinabile con riso, quinoa, grano saraceno, verdure miste",
    prepared: false,
  },
  {
    id: "lunch-protein-salmon",
    title: "Salmone monoporzione",
    description: "1-2 porzioni. Salmone 180-200 g da crudo oppure 1 filetto monoporzione surgelato prima della cottura.",
    ingredients: ["Salmone", "Riso", "Quinoa", "Broccoli", "Zucchine", "Carote"],
    quantity: "1-2 porzioni",
    note: "porzione surgelata prima della cottura",
    prepared: false,
  },
  {
    id: "lunch-protein-legumes",
    title: "Legumi + proteina",
    description: "1-2 porzioni. Legumi cotti/scolati 120-150 g; rinforzo con tonno/salmone in busta, pollo o uova.",
    ingredients: ["Legumi scolati", "Tonno/salmone in busta", "Pollo", "Uova"],
    quantity: "1-2 porzioni",
    note: "legumi indicati cotti/scolati perche gia cotti",
    prepared: false,
  },
  {
    id: "lunch-protein-lean-beef",
    title: "Manzo magro o alternativa",
    description: "1 porzione. Manzo magro 200-220 g da crudo, abbinabile con riso, grano saraceno, fagiolini, carote o verdure miste.",
    ingredients: ["Manzo magro", "Riso", "Grano saraceno", "Fagiolini", "Carote"],
    quantity: "1 porzione",
    note: "proteina alternativa per variare le bowl",
    prepared: false,
  },
];

export const lunchCarbBatch: MealPrepItem[] = [
  {
    id: "lunch-carb-rice",
    title: "Riso basmati pranzo",
    description: "50-60 g da crudo per porzione. Diventa circa 130-180 g cotto, in base alla cottura.",
    ingredients: ["Riso basmati"],
    quantity: "5 porzioni possibili",
    note: "dato principale da crudo",
    prepared: false,
  },
  {
    id: "lunch-carb-quinoa",
    title: "Quinoa pranzo",
    description: "50-60 g da crudo per porzione. Diventa circa 130-180 g cotta, in base alla cottura.",
    ingredients: ["Quinoa"],
    quantity: "2-3 porzioni possibili",
    note: "dato principale da crudo",
    prepared: false,
  },
  {
    id: "lunch-carb-buckwheat",
    title: "Grano saraceno pranzo",
    description: "50-60 g da crudo per porzione. Diventa circa 130-180 g cotto, in base alla cottura.",
    ingredients: ["Grano saraceno"],
    quantity: "2-3 porzioni possibili",
    note: "dato principale da crudo",
    prepared: false,
  },
];

export const lunchVegetableBatch: MealPrepItem[] = [
  {
    id: "lunch-veg-zucchini-carrots",
    title: "Zucchine/carote batch",
    description: "Zucchine e carote 200-250 g da crudo per porzione oppure porzione libera. Preparale una volta sola.",
    ingredients: ["Zucchine", "Carote"],
    quantity: "batch pranzi",
    note: "usabili in piu bowl",
    prepared: false,
  },
  {
    id: "lunch-veg-broccoli-beans",
    title: "Broccoli/fagiolini batch",
    description: "Broccoli e fagiolini 200-250 g da crudo per porzione oppure porzione libera.",
    ingredients: ["Broccoli", "Fagiolini"],
    quantity: "batch pranzi",
    note: "usabili in piu bowl",
    prepared: false,
  },
  {
    id: "lunch-veg-mixed",
    title: "Spinaci/cavolfiore/verdure miste",
    description: "Verdure 200-250 g da crudo per porzione oppure porzione libera. Prepara un batch unico.",
    ingredients: ["Spinaci", "Cavolfiore", "Verdure miste"],
    quantity: "batch pranzi",
    note: "prepara una volta sola",
    prepared: false,
  },
];

export const lunchPortionExamples: MealPrepItem[] = [
  {
    id: "lunch-portion-chicken-rice",
    title: "Bowl pollo/tacchino + riso",
    description: "Pollo/tacchino 220-250 g da crudo + riso 55 g da crudo + zucchine/carote + 1 cucchiaino olio EVO.",
    ingredients: ["Pollo/tacchino", "Riso basmati", "Zucchine", "Carote", "Olio EVO"],
    quantity: "porzione pronta 1/5",
    note: "assemblata/freezer",
    prepared: false,
  },
  {
    id: "lunch-portion-chicken-quinoa",
    title: "Bowl pollo/tacchino + quinoa",
    description: "Pollo/tacchino 220-250 g da crudo + quinoa 55 g da crudo + broccoli + 1 cucchiaino olio EVO.",
    ingredients: ["Pollo/tacchino", "Quinoa", "Broccoli", "Olio EVO"],
    quantity: "porzione pronta 2/5",
    note: "assemblata/freezer",
    prepared: false,
  },
  {
    id: "lunch-portion-salmon-rice",
    title: "Bowl salmone + riso",
    description: "Salmone 180-200 g da crudo + riso 50 g da crudo + broccoli + 1 cucchiaino olio EVO.",
    ingredients: ["Salmone", "Riso basmati", "Broccoli", "Olio EVO"],
    quantity: "porzione pronta 3/5",
    note: "assemblata/freezer",
    prepared: false,
  },
  {
    id: "lunch-portion-legumes-buckwheat",
    title: "Bowl legumi + grano saraceno",
    description: "Legumi 120-150 g cotti/scolati + tonno/pollo + grano saraceno 50 g da crudo + verdure miste.",
    ingredients: ["Legumi scolati", "Tonno/pollo", "Grano saraceno", "Verdure miste"],
    quantity: "porzione pronta 4/5",
    note: "legumi gia cotti",
    prepared: false,
  },
  {
    id: "lunch-portion-beef-rice",
    title: "Bowl manzo magro + riso",
    description: "Manzo magro 200-220 g da crudo + riso 50 g da crudo + fagiolini/carote + 1 cucchiaino olio EVO.",
    ingredients: ["Manzo magro", "Riso basmati", "Fagiolini", "Carote", "Olio EVO"],
    quantity: "porzione pronta 5/5",
    note: "assemblata/freezer",
    prepared: false,
  },
];

export const dinnerProteinBatch: MealPrepItem[] = [
  {
    id: "dinner-protein-meatballs",
    title: "Polpette/hamburger tacchino o pollo",
    description: "4-5 porzioni. Macinato tacchino/pollo 220-250 g da crudo per porzione; totale batch 900-1200 g da crudo.",
    ingredients: ["Macinato tacchino/pollo", "Riso", "Patate", "Zucchine", "Broccoli"],
    quantity: "4-5 porzioni",
    note: "base freezer emergenza",
    prepared: false,
  },
  {
    id: "dinner-protein-spiced-chicken",
    title: "Pollo leggero speziato / curry leggero",
    description: "4-5 porzioni. Pollo 220-250 g da crudo per porzione; totale batch 900-1200 g da crudo.",
    ingredients: ["Pollo", "Spezie/curry leggero", "Riso", "Patate", "Verdure miste"],
    quantity: "4-5 porzioni",
    note: "base freezer emergenza",
    prepared: false,
  },
  {
    id: "dinner-protein-lean-ragu",
    title: "Ragu magro opzionale",
    description: "4-5 porzioni. Carne macinata magra 800-1000 g da crudo totali; porzione da circa 180-220 g carne cruda.",
    ingredients: ["Carne macinata magra", "Pasta SG", "Riso", "Verdure"],
    quantity: "4-5 porzioni",
    note: "utile anche per cena con Edoardo",
    prepared: false,
  },
];

export const dinnerSideBatch: MealPrepItem[] = [
  {
    id: "dinner-side-rice",
    title: "Riso basmati cena",
    description: "50-70 g da crudo per porzione, da abbinare a polpette, pollo speziato o ragu magro.",
    ingredients: ["Riso basmati"],
    quantity: "4-5 porzioni possibili",
    note: "dato principale da crudo",
    prepared: false,
  },
  {
    id: "dinner-side-pasta",
    title: "Pasta senza glutine",
    description: "60-70 g da crudo per porzione, soprattutto con ragu magro.",
    ingredients: ["Pasta senza glutine"],
    quantity: "4-5 porzioni possibili",
    note: "dato principale da crudo",
    prepared: false,
  },
  {
    id: "dinner-side-potatoes",
    title: "Patate cena",
    description: "Patate 250-300 g da crudo per porzione, da abbinare a polpette o pollo speziato.",
    ingredients: ["Patate"],
    quantity: "4-5 porzioni possibili",
    note: "peso crudo",
    prepared: false,
  },
  {
    id: "dinner-side-vegetables",
    title: "Verdure miste cotte",
    description: "Broccoli/zucchine/carote/fagiolini 200-250 g da crudo indicativi oppure porzione libera. Batch unico.",
    ingredients: ["Broccoli", "Zucchine", "Carote", "Fagiolini"],
    quantity: "batch cena",
    note: "porzione libera ok",
    prepared: false,
  },
];

export const dinnerPortionExamples: MealPrepItem[] = [
  {
    id: "dinner-portion-meatballs-rice",
    title: "Polpette + riso + broccoli",
    description: "Polpette da 220-250 g macinato crudo + riso 60 g da crudo + broccoli.",
    ingredients: ["Polpette", "Riso basmati", "Broccoli"],
    quantity: "cena assemblata",
    note: "solo Fabio / emergenza",
    prepared: false,
  },
  {
    id: "dinner-portion-meatballs-potatoes",
    title: "Polpette + patate + zucchine",
    description: "Polpette da 220-250 g macinato crudo + patate 250-300 g da crudo + zucchine.",
    ingredients: ["Polpette", "Patate", "Zucchine"],
    quantity: "cena assemblata",
    note: "solo Fabio / emergenza",
    prepared: false,
  },
  {
    id: "dinner-portion-chicken-rice",
    title: "Pollo speziato + riso",
    description: "Pollo speziato 220-250 g da crudo + riso 60 g da crudo + verdure miste.",
    ingredients: ["Pollo speziato", "Riso basmati", "Verdure miste"],
    quantity: "cena assemblata",
    note: "solo Fabio / emergenza",
    prepared: false,
  },
  {
    id: "dinner-portion-ragu-pasta",
    title: "Ragu magro + pasta SG",
    description: "Ragu magro da circa 180-220 g carne cruda + pasta SG 60-70 g da crudo.",
    ingredients: ["Ragu magro", "Pasta senza glutine"],
    quantity: "cena assemblata",
    note: "solo Fabio / emergenza",
    prepared: false,
  },
];

export const sharedSideBatch: MealPrepItem[] = [
  {
    id: "shared-side-zucchini-carrots",
    title: "Zucchine + carote",
    description: "200-250 g da crudo indicativi per porzione oppure porzione libera. Usabili per bowl pranzo e cene freezer.",
    ingredients: ["Zucchine", "Carote"],
    quantity: "batch condiviso",
    note: "pranzo + cena",
    prepared: false,
  },
  {
    id: "shared-side-broccoli-beans",
    title: "Broccoli + fagiolini",
    description: "200-250 g da crudo indicativi per porzione oppure porzione libera. Preparali una volta sola.",
    ingredients: ["Broccoli", "Fagiolini"],
    quantity: "batch condiviso",
    note: "pranzo + cena",
    prepared: false,
  },
  {
    id: "shared-side-mixed",
    title: "Spinaci/cavolfiore/verdure miste",
    description: "200-250 g da crudo indicativi per porzione oppure porzione libera. Abbinabili a proteine e carboidrati diversi.",
    ingredients: ["Spinaci", "Cavolfiore", "Verdure miste"],
    quantity: "batch condiviso",
    note: "pranzo + cena",
    prepared: false,
  },
  {
    id: "shared-side-potatoes",
    title: "Patate se previste per cena",
    description: "250-300 g da crudo per porzione. Preparale solo per le cene in cui servono.",
    ingredients: ["Patate"],
    quantity: "batch cena",
    note: "peso crudo",
    prepared: false,
  },
];

export const mealPrepReminder = "Sposta dal freezer al frigo la sera prima.";
export const sharedSidesNote = "Questi contorni possono essere usati sia per le bowl pranzo sia per le cene freezer. Preparali una volta sola e abbinali alle proteine della settimana.";
