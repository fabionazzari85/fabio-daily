"use client";

import { Plus, RotateCcw, ShoppingBasket, Snowflake } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  dinnerPortionExamples,
  dinnerProteinBatch,
  dinnerSideBatch,
  lunchCarbBatch,
  lunchPortionExamples,
  lunchProteinBatch,
  lunchVegetableBatch,
  mealPrepReminder,
  rawWeightNote,
  sharedSideBatch,
  sharedSidesNote,
} from "@/data/mealPrepTemplates";
import { shoppingListTemplate } from "@/data/shoppingListTemplate";
import type { MealPrepItem, MealPrepState, ShoppingListCategory } from "@/domain/types";
import { browserLocalRepository } from "@/storage/browserLocalRepository";

type MealPrepShoppingScreenProps = {
  weekId: string;
};

type MealPrepSectionKey = Exclude<keyof MealPrepState, "weekId">;

export function MealPrepShoppingScreen({ weekId }: MealPrepShoppingScreenProps) {
  const [mealPrepState, setMealPrepState] = useState<MealPrepState>(() => createMealPrepState(weekId));
  const [shoppingList, setShoppingList] = useState<ShoppingListCategory[]>(() => cloneShoppingTemplate());
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemCategoryId, setNewItemCategoryId] = useState(shoppingListTemplate[0]?.id ?? "proteins");
  const [loaded, setLoaded] = useState(false);

  const preparedCount = useMemo(
    () => mealPrepSections(mealPrepState).filter((item) => item.prepared).length,
    [mealPrepState],
  );
  const prepTotal = useMemo(() => mealPrepSections(mealPrepState).length, [mealPrepState]);
  const shoppingCount = useMemo(
    () => shoppingList.reduce((total, category) => total + category.items.filter((item) => item.checked).length, 0),
    [shoppingList],
  );

  useEffect(() => {
    let cancelled = false;

    async function loadState() {
      const [storedMealPrep, storedShoppingList] = await Promise.all([
        browserLocalRepository.getMealPrepState(weekId),
        browserLocalRepository.getShoppingListState(weekId),
      ]);

      if (!cancelled) {
        setMealPrepState(normalizeMealPrepState(weekId, storedMealPrep));
        setShoppingList(storedShoppingList ?? cloneShoppingTemplate());
        setLoaded(true);
      }
    }

    loadState();

    return () => {
      cancelled = true;
    };
  }, [weekId]);

  async function toggleMealPrepItem(type: MealPrepSectionKey, id: string) {
    const nextState = {
      ...mealPrepState,
      [type]: mealPrepState[type].map((item) => (item.id === id ? { ...item, prepared: !item.prepared } : item)),
    };
    setMealPrepState(nextState);
    await browserLocalRepository.saveMealPrepState(weekId, nextState);
  }

  async function toggleShoppingItem(categoryId: string, itemId: string) {
    const nextList = shoppingList.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            items: category.items.map((item) => (item.id === itemId ? { ...item, checked: !item.checked } : item)),
          }
        : category,
    );
    setShoppingList(nextList);
    await browserLocalRepository.saveShoppingListState(weekId, nextList);
  }

  async function handleAddShoppingItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const label = newItemLabel.trim();
    if (!label) return;

    const nextList = shoppingList.map((category) =>
      category.id === newItemCategoryId
        ? {
            ...category,
            items: [
              ...category.items,
              {
                id: `custom-${Date.now()}`,
                label,
                checked: false,
                custom: true,
              },
            ],
          }
        : category,
    );

    setShoppingList(nextList);
    setNewItemLabel("");
    await browserLocalRepository.saveShoppingListState(weekId, nextList);
  }

  async function handleResetWeek() {
    const nextMealPrep = createMealPrepState(weekId);
    const nextShoppingList = cloneShoppingTemplate();
    await browserLocalRepository.resetMealPrepWeek(weekId);
    setMealPrepState(nextMealPrep);
    setShoppingList(nextShoppingList);
  }

  return (
    <main className="mx-auto min-h-screen max-w-md px-4 pb-28 pt-5">
      <header className="mb-5">
        <div className="flex items-center gap-2 text-sm font-medium text-muted">
          <ShoppingBasket size={18} />
          <span>Settimana {weekId}</span>
        </div>
        <h1 className="mt-3 text-3xl font-bold leading-tight">Meal Prep & Spesa</h1>
        <p className="mt-2 text-base leading-relaxed text-muted">Domenica cosa devo cucinare e comprare?</p>
      </header>

      <section className="mb-4 rounded-lg border border-accent-soft bg-accent-soft p-4">
        <div className="flex items-start gap-3">
          <Snowflake className="mt-1 shrink-0 text-accent-strong" size={22} />
          <div>
            <h2 className="text-base font-bold text-accent-strong">{mealPrepReminder}</h2>
            <p className="mt-1 text-sm leading-relaxed text-accent-strong">
              Basi/porzioni: {preparedCount}/{prepTotal} · Spesa: {shoppingCount} item comprati
            </p>
            <p className="mt-2 text-sm font-bold leading-relaxed text-accent-strong">{rawWeightNote}</p>
          </div>
        </div>
      </section>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Metodo batch</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">Prepara basi batch, combina porzioni, congela o usa durante la settimana.</p>
      </section>

      <BatchSection
        title="Pranzi freezer"
        subtitle="Basi preparate"
        groups={[
          { title: "Proteine per pranzi", key: "lunchProteins", items: mealPrepState.lunchProteins, label: "Preparato" },
          { title: "Carboidrati per pranzi", key: "lunchCarbs", items: mealPrepState.lunchCarbs, label: "Preparato" },
          { title: "Verdure batch per pranzi", key: "lunchVegetables", items: mealPrepState.lunchVegetables, label: "Preparato" },
          { title: "Porzioni assemblate", key: "lunchPortions", items: mealPrepState.lunchPortions, label: "Porzione pronta" },
        ]}
        onToggle={toggleMealPrepItem}
      />

      <BatchSection
        title="Cene freezer"
        subtitle="Basi da 4-5 porzioni, non 4 cene singole diverse"
        groups={[
          { title: "Proteine per cene emergenza", key: "dinnerProteins", items: mealPrepState.dinnerProteins, label: "Preparata" },
          { title: "Contorni e carboidrati batch cena", key: "dinnerSides", items: mealPrepState.dinnerSides, label: "Preparato" },
          { title: "Esempi combinazioni cena", key: "dinnerPortions", items: mealPrepState.dinnerPortions, label: "Porzione pronta" },
        ]}
        onToggle={toggleMealPrepItem}
      />

      <details open className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <summary className="cursor-pointer list-none text-xl font-bold">Contorni batch intercambiabili</summary>
        <p className="mt-3 text-sm leading-relaxed text-muted">{sharedSidesNote}</p>
        <div className="mt-4 space-y-3">
          {mealPrepState.sharedSides.map((item) => (
            <MealPrepChecklistItem key={item.id} item={item} label="Preparato" onToggle={() => toggleMealPrepItem("sharedSides", item.id)} />
          ))}
        </div>
      </details>

      <section className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <h2 className="text-xl font-bold">Lista spesa</h2>
        {!loaded ? <p className="mt-3 text-sm text-muted">Carico la settimana...</p> : null}

        <form onSubmit={handleAddShoppingItem} className="mt-4 rounded-lg bg-background p-3">
          <label className="block text-sm font-semibold text-muted" htmlFor="shopping-category">
            Aggiungi item
          </label>
          <div className="mt-2 grid grid-cols-[1fr_auto] gap-2">
            <input
              id="new-shopping-item"
              value={newItemLabel}
              onChange={(event) => setNewItemLabel(event.target.value)}
              placeholder="Es. limoni"
              className="h-12 min-w-0 rounded-lg border border-border bg-surface px-3 text-base text-foreground placeholder:text-muted"
            />
            <button type="submit" className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-white">
              <Plus size={22} />
            </button>
          </div>
          <select
            id="shopping-category"
            value={newItemCategoryId}
            onChange={(event) => setNewItemCategoryId(event.target.value)}
            className="mt-2 h-12 w-full rounded-lg border border-border bg-surface px-3 text-base text-foreground"
          >
            {shoppingList.map((category) => (
              <option key={category.id} value={category.id}>
                {category.title}
              </option>
            ))}
          </select>
        </form>

        <div className="mt-4 space-y-3">
          {shoppingList.map((category) => (
            <details key={category.id} open className="rounded-lg bg-background p-3">
              <summary className="cursor-pointer list-none text-base font-bold">{category.title}</summary>
              <div className="mt-3 space-y-2">
                {category.items.map((item) => (
                  <label key={item.id} className="flex min-h-12 items-center gap-3 rounded-lg bg-surface px-3 py-2">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleShoppingItem(category.id, item.id)}
                      className="h-6 w-6 accent-[var(--accent)]"
                    />
                    <span className="min-w-0 flex-1">
                      <span className={`block text-base font-semibold ${item.checked ? "text-muted line-through" : "text-foreground"}`}>
                        {item.label}
                      </span>
                      {item.quantity ? <span className="text-sm text-muted">{item.quantity}</span> : null}
                    </span>
                  </label>
                ))}
              </div>
            </details>
          ))}
        </div>
      </section>

      <button
        type="button"
        onClick={handleResetWeek}
        className="flex h-13 w-full items-center justify-center gap-2 rounded-lg border border-border bg-surface text-base font-bold text-foreground"
      >
        <RotateCcw size={19} />
        Rigenera da template
      </button>
    </main>
  );
}

function MealPrepChecklistItem({ item, label, onToggle }: { item: MealPrepItem; label: string; onToggle: () => void }) {
  return (
    <article className="rounded-lg bg-background p-3">
      <div className="flex items-start gap-3">
        <input type="checkbox" checked={item.prepared} onChange={onToggle} className="mt-1 h-7 w-7 shrink-0 accent-[var(--accent)]" />
        <div className="min-w-0 flex-1">
          <h3 className={`text-base font-bold ${item.prepared ? "text-muted line-through" : "text-foreground"}`}>{item.title}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">{item.description}</p>
          <div className="mt-2 flex flex-wrap gap-1">
            {item.ingredients.map((ingredient) => (
              <span key={ingredient} className="rounded-md bg-surface px-2 py-1 text-xs font-semibold text-muted">
                {ingredient}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {item.quantity} · {item.note}
          </p>
          <span className="mt-3 inline-flex rounded-lg border border-border bg-surface px-3 py-2 text-sm font-bold text-foreground">{label}</span>
        </div>
      </div>
    </article>
  );
}

function BatchSection({
  title,
  subtitle,
  groups,
  onToggle,
}: {
  title: string;
  subtitle: string;
  groups: Array<{ title: string; key: MealPrepSectionKey; items: MealPrepItem[]; label: string }>;
  onToggle: (type: MealPrepSectionKey, id: string) => void;
}) {
  return (
    <details open className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
      <summary className="cursor-pointer list-none">
        <div className="text-xl font-bold">{title}</div>
        <div className="mt-1 text-sm text-muted">{subtitle}</div>
      </summary>
      <div className="mt-4 space-y-4">
        {groups.map((group) => (
          <section key={group.key} className="rounded-lg bg-background p-3">
            <h3 className="text-base font-bold">{group.title}</h3>
            <div className="mt-3 space-y-3">
              {group.items.map((item) => (
                <MealPrepChecklistItem key={item.id} item={item} label={group.label} onToggle={() => onToggle(group.key, item.id)} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </details>
  );
}

function createMealPrepState(weekId: string): MealPrepState {
  return {
    weekId,
    lunchProteins: cloneMealPrepItems(lunchProteinBatch),
    lunchCarbs: cloneMealPrepItems(lunchCarbBatch),
    lunchVegetables: cloneMealPrepItems(lunchVegetableBatch),
    lunchPortions: cloneMealPrepItems(lunchPortionExamples),
    dinnerProteins: cloneMealPrepItems(dinnerProteinBatch),
    dinnerSides: cloneMealPrepItems(dinnerSideBatch),
    dinnerPortions: cloneMealPrepItems(dinnerPortionExamples),
    sharedSides: cloneMealPrepItems(sharedSideBatch),
  };
}

function normalizeMealPrepState(weekId: string, storedState: MealPrepState | null): MealPrepState {
  const nextState = createMealPrepState(weekId);
  if (!storedState) return nextState;

  mealPrepSectionKeys.forEach((key) => {
    nextState[key] = nextState[key].map((item) => {
      const storedItem = storedState[key]?.find((candidate) => candidate.id === item.id);
      return storedItem ? { ...item, prepared: storedItem.prepared } : item;
    });
  });

  return nextState;
}

function cloneMealPrepItems(items: MealPrepItem[]) {
  return items.map((item) => ({ ...item, ingredients: [...item.ingredients], prepared: false }));
}

const mealPrepSectionKeys: MealPrepSectionKey[] = [
  "lunchProteins",
  "lunchCarbs",
  "lunchVegetables",
  "lunchPortions",
  "dinnerProteins",
  "dinnerSides",
  "dinnerPortions",
  "sharedSides",
];

function mealPrepSections(state: MealPrepState) {
  return mealPrepSectionKeys.flatMap((key) => state[key]);
}

function cloneShoppingTemplate() {
  return shoppingListTemplate.map((category) => ({
    ...category,
    items: category.items.map((item) => ({ ...item, checked: false })),
  }));
}
