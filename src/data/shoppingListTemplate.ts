import type { ShoppingListCategory } from "@/domain/types";

const items = (entries: Array<string | { label: string; quantity?: string }>) =>
  entries.map((entry, index) => {
    const label = typeof entry === "string" ? entry : entry.label;

    return {
      id: label.toLowerCase().replaceAll(" ", "-").replaceAll("/", "-") + `-${index}`,
      label,
      quantity: typeof entry === "string" ? undefined : entry.quantity,
      checked: false,
    };
  });

export const shoppingListTemplate: ShoppingListCategory[] = [
  {
    id: "proteins",
    title: "Proteine",
    items: items([
      { label: "Pollo/tacchino", quantity: "900-1000 g" },
      { label: "Salmone surgelato monoporzione", quantity: "2-3 porzioni" },
      "Pesce bianco",
      { label: "Manzo magro", quantity: "300-400 g" },
      "Uova",
      "Tonno naturale/salmone in busta",
      "Skyr/yogurt greco delattosato",
      "Proteine in polvere",
      "Barrette proteiche senza glutine",
    ]),
  },
  {
    id: "gluten-free-carbs",
    title: "Carboidrati senza glutine",
    items: items([
      { label: "Riso da pesare a crudo", quantity: "500 g" },
      { label: "Quinoa da pesare a crudo", quantity: "250 g" },
      { label: "Grano saraceno da pesare a crudo", quantity: "250 g" },
      { label: "Pasta senza glutine da pesare a crudo", quantity: "500 g" },
      { label: "Patate peso crudo", quantity: "1 kg" },
      "Avena certificata senza glutine",
      "Gallette/crackers senza glutine",
      "Pane senza glutine",
    ]),
  },
  {
    id: "legumes",
    title: "Legumi",
    items: items(["Lenticchie", "Ceci", "Fagioli", "Piselli"]),
  },
  {
    id: "vegetables",
    title: "Verdure",
    items: items(["Zucchine", "Carote", "Broccoli", "Fagiolini", "Spinaci", "Cavolfiore", "Melanzane", "Zucca", "Insalata"]),
  },
  {
    id: "fruit",
    title: "Frutta",
    items: items(["Banane", "Mele", "Pere", "Frutti di bosco", "Altra frutta"]),
  },
  {
    id: "extras",
    title: "Extra",
    items: items(["Olio EVO", "Semi", "Frutta secca", "Cacao amaro", "Ghiaccioli piccoli"]),
  },
];
