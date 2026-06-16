"use client";

import { Plus, RotateCcw, ShoppingBasket, Snowflake } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { freezerDinners, freezerLunches, mealPrepReminder } from "@/data/mealPrepTemplates";
import { shoppingListTemplate } from "@/data/shoppingListTemplate";
import type { MealPrepItem, MealPrepState, ShoppingListCategory } from "@/domain/types";
import { browserLocalRepository } from "@/storage/browserLocalRepository";

type MealPrepShoppingScreenProps = {
  weekId: string;
};

export function MealPrepShoppingScreen({ weekId }: MealPrepShoppingScreenProps) {
  const [mealPrepState, setMealPrepState] = useState<MealPrepState>(() => createMealPrepState(weekId));
  const [shoppingList, setShoppingList] = useState<ShoppingListCategory[]>(() => cloneShoppingTemplate());
  const [newItemLabel, setNewItemLabel] = useState("");
  const [newItemCategoryId, setNewItemCategoryId] = useState(shoppingListTemplate[0]?.id ?? "proteins");
  const [loaded, setLoaded] = useState(false);

  const preparedCount = useMemo(
    () => [...mealPrepState.lunches, ...mealPrepState.dinners].filter((item) => item.prepared).length,
    [mealPrepState],
  );
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
        setMealPrepState(storedMealPrep ?? createMealPrepState(weekId));
        setShoppingList(storedShoppingList ?? cloneShoppingTemplate());
        setLoaded(true);
      }
    }

    loadState();

    return () => {
      cancelled = true;
    };
  }, [weekId]);

  async function toggleMealPrepItem(type: "lunches" | "dinners", id: string) {
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
              Preparati: {preparedCount}/9 · Spesa: {shoppingCount} item comprati
            </p>
          </div>
        </div>
      </section>

      <details open className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <summary className="cursor-pointer list-none text-xl font-bold">Pranzi freezer</summary>
        <div className="mt-4 space-y-3">
          {mealPrepState.lunches.map((item) => (
            <MealPrepChecklistItem key={item.id} item={item} label="Preparato" onToggle={() => toggleMealPrepItem("lunches", item.id)} />
          ))}
        </div>
      </details>

      <details open className="mb-4 rounded-lg border border-border bg-surface p-4 shadow-sm">
        <summary className="cursor-pointer list-none text-xl font-bold">Cene freezer</summary>
        <div className="mt-4 space-y-3">
          {mealPrepState.dinners.map((item) => (
            <MealPrepChecklistItem key={item.id} item={item} label="Preparata" onToggle={() => toggleMealPrepItem("dinners", item.id)} />
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

function createMealPrepState(weekId: string): MealPrepState {
  return {
    weekId,
    lunches: cloneMealPrepItems(freezerLunches),
    dinners: cloneMealPrepItems(freezerDinners),
  };
}

function cloneMealPrepItems(items: MealPrepItem[]) {
  return items.map((item) => ({ ...item, ingredients: [...item.ingredients], prepared: false }));
}

function cloneShoppingTemplate() {
  return shoppingListTemplate.map((category) => ({
    ...category,
    items: category.items.map((item) => ({ ...item, checked: false })),
  }));
}
