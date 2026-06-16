import type { MealPrepItem } from "@/domain/types";

export const freezerLunches: MealPrepItem[] = [
  {
    id: "lunch-chicken-rice-zucchini",
    title: "Bowl pollo/tacchino",
    description: "Pollo o tacchino cotto 170 g + riso basmati 55 g da crudo (circa 140-165 g cotto) + zucchine/carote porzione libera + 1 cucchiaino olio EVO.",
    ingredients: ["Pollo/tacchino", "Riso", "Zucchine", "Carote", "Olio EVO"],
    quantity: "1 porzione freezer",
    note: "freezer",
    prepared: false,
  },
  {
    id: "lunch-turkey-quinoa-carrots",
    title: "Bowl pollo/tacchino",
    description: "Tacchino cotto 170 g + quinoa 55 g da crudo (circa 140-160 g cotta) + carote/zucchine porzione libera + 1 cucchiaino olio EVO.",
    ingredients: ["Tacchino", "Quinoa", "Carote", "Zucchine", "Olio EVO"],
    quantity: "1 porzione freezer",
    note: "freezer",
    prepared: false,
  },
  {
    id: "lunch-salmon-rice-broccoli",
    title: "Bowl salmone",
    description: "Salmone 150 g + riso 55 g da crudo (circa 140-165 g cotto) + broccoli porzione libera + 1 cucchiaino olio EVO.",
    ingredients: ["Salmone", "Riso", "Broccoli", "Olio EVO"],
    quantity: "1 porzione freezer",
    note: "freezer",
    prepared: false,
  },
  {
    id: "lunch-legumes-protein-buckwheat",
    title: "Bowl legumi + proteina",
    description: "Legumi 120 g sgocciolati + proteina magra cotta 120 g + grano saraceno 50 g da crudo (circa 130-150 g cotto) + spinaci porzione libera.",
    ingredients: ["Legumi", "Proteina magra", "Grano saraceno", "Spinaci"],
    quantity: "1 porzione freezer",
    note: "freezer",
    prepared: false,
  },
  {
    id: "lunch-lean-beef-rice-beans",
    title: "Bowl manzo magro",
    description: "Manzo magro cotto 160 g + riso 55 g da crudo (circa 140-165 g cotto) + fagiolini porzione libera + 1 cucchiaino olio EVO.",
    ingredients: ["Manzo magro", "Riso", "Fagiolini", "Olio EVO"],
    quantity: "1 porzione freezer",
    note: "freezer",
    prepared: false,
  },
];

export const freezerDinners: MealPrepItem[] = [
  {
    id: "dinner-turkey-meatballs",
    title: "Polpette di tacchino",
    description: "Polpette di tacchino + patate 250-300 g peso crudo + zucchine porzione libera. Porzione piccola e completa.",
    ingredients: ["Tacchino", "Patate", "Zucchine"],
    quantity: "1 cena",
    note: "solo Fabio / emergenza",
    prepared: false,
  },
  {
    id: "dinner-lean-ragu",
    title: "Ragu magro",
    description: "Ragu magro + pasta senza glutine 60-70 g da crudo oppure riso 60-70 g da crudo.",
    ingredients: ["Manzo magro", "Pasta GF o riso", "Verdure cotte"],
    quantity: "1 cena",
    note: "solo Fabio / emergenza",
    prepared: false,
  },
  {
    id: "dinner-salmon-rice-broccoli",
    title: "Salmone + riso",
    description: "Salmone 150 g + riso 60 g da crudo (circa 150-180 g cotto) + broccoli porzione libera.",
    ingredients: ["Salmone", "Riso", "Broccoli"],
    quantity: "1 cena",
    note: "solo Fabio / emergenza",
    prepared: false,
  },
  {
    id: "dinner-light-curry-chicken",
    title: "Pollo al curry leggero",
    description: "Pollo al curry leggero + riso 60 g da crudo (circa 150-180 g cotto) + verdure cotte porzione libera, senza appesantire la sera.",
    ingredients: ["Pollo", "Riso", "Verdure", "Curry leggero"],
    quantity: "1 cena",
    note: "solo Fabio / emergenza",
    prepared: false,
  },
];

export const mealPrepReminder = "Sposta dal freezer al frigo la sera prima.";
