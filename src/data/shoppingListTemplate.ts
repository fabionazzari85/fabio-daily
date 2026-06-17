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
      { label: "Pollo/tacchino per pranzi batch", quantity: "700-750 g da crudo" },
      { label: "Tacchino/pollo macinato per polpette/hamburger", quantity: "900-1200 g da crudo" },
      { label: "Pollo per curry/speziato", quantity: "900-1200 g da crudo" },
      { label: "Salmone monoporzione", quantity: "1-2 filetti da 180-200 g da crudo/surgelati" },
      { label: "Manzo magro", quantity: "200-220 g da crudo" },
      { label: "Carne macinata magra per ragu", quantity: "800-1000 g da crudo" },
      { label: "Tonno/salmone in busta", quantity: "peso sgocciolato/confezione" },
      "Uova",
      { label: "Legumi in barattolo", quantity: "peso cotto/scolato" },
      "Skyr/yogurt greco delattosato",
      "Proteine in polvere",
      "Barrette proteiche senza glutine",
    ]),
  },
  {
    id: "gluten-free-carbs",
    title: "Carboidrati senza glutine",
    items: items([
      { label: "Riso basmati da pesare a crudo", quantity: "500 g" },
      { label: "Quinoa da pesare a crudo", quantity: "250 g" },
      { label: "Grano saraceno da pesare a crudo", quantity: "250 g" },
      { label: "Pasta senza glutine da pesare a crudo", quantity: "500 g" },
      { label: "Patate peso crudo", quantity: "1-2 kg" },
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
    title: "Verdure batch",
    items: items([
      { label: "Zucchine", quantity: "batch pranzi/cene" },
      { label: "Carote", quantity: "batch pranzi/cene" },
      { label: "Broccoli", quantity: "batch pranzi/cene" },
      { label: "Fagiolini", quantity: "batch pranzi/cene" },
      { label: "Spinaci", quantity: "batch pranzi/cene" },
      { label: "Cavolfiore", quantity: "batch pranzi/cene" },
      { label: "Verdure miste", quantity: "porzione libera" },
      "Zucca",
      "Insalata",
    ]),
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
