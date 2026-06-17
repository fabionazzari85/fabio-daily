import Foundation

enum SeedData {
    static let profile = Profile(
        name: "Fabio",
        heightCm: 183,
        startingWeightKg: 110,
        targetWeightKg: 90,
        goal: "Dimagrimento mantenendo forza e massa muscolare",
        conditions: [
            "Celiachia: sì",
            "Sleeve gastrectomy: sì",
            "Reflusso/gastroprotettore: sì"
        ],
        preferences: [
            "Latticini preferibilmente delattosati",
            "Proteine alte",
            "Pesi indicati da crudo, salvo diversa indicazione"
        ]
    )

    static let activeTarget = MacroTarget(kcalMin: 1800, kcalMax: 1800, proteinMin: 155, proteinMax: 170, carbsMin: 130, carbsMax: 190, fatMin: 45, fatMax: 65)
    static let recoveryTarget = MacroTarget(kcalMin: 1700, kcalMax: 1700, proteinMin: 155, proteinMax: 170, carbsMin: 100, carbsMax: 150, fatMin: 45, fatMax: 65)

    static let homeWorkoutMeals: [MealTemplate] = [
        MealTemplate(id: "home-breakfast", slot: .breakfast, title: "Colazione post workout", description: "Shaker proteico senza glutine + banana. Piccolo, rapido, proteico.", macros: MacroValue(kcal: 280, proteinG: 30, carbsG: 34, fatG: 4), alternatives: ["Skyr delattosato 250 g + banana"]),
        MealTemplate(id: "home-lunch", slot: .lunch, title: "Bowl pollo/tacchino", description: "Pollo/tacchino 220-250 g da crudo + riso basmati 55 g da crudo (circa 140-165 g cotto) + zucchine/carote 200-250 g da crudo o porzione libera + 1 cucchiaino olio EVO.", macros: MacroValue(kcal: 500, proteinG: 47, carbsG: 52, fatG: 12), alternatives: ["Bowl salmone", "Bowl legumi + proteina"]),
        MealTemplate(id: "home-snack", slot: .snack, title: "Gallette GF + tonno", description: "2-3 gallette senza glutine + tonno naturale 80-100 g sgocciolato/confezione.", macros: MacroValue(kcal: 250, proteinG: 26, carbsG: 28, fatG: 4), alternatives: ["Yogurt proteico delattosato + frutto"]),
        MealTemplate(id: "home-dinner", slot: .dinner, title: "Salmone + patate + broccoli", description: "Salmone 180-200 g da crudo o filetto surgelato monoporzione + patate 250-300 g da crudo + broccoli 200-250 g da crudo o porzione libera.", macros: MacroValue(kcal: 550, proteinG: 43, carbsG: 48, fatG: 20), alternatives: ["Pesce bianco + patate + verdure"]),
        MealTemplate(id: "home-after", slot: .afterDinner, title: "Dopo cena opzionale", description: "Ghiacciolo piccolo oppure yogurt delattosato piccolo, solo se serve davvero.", macros: MacroValue(kcal: 80, proteinG: 8, carbsG: 10, fatG: 1), alternatives: ["Tisana"])
    ]

    static let recoveryMeals: [MealTemplate] = [
        MealTemplate(id: "recovery-breakfast", slot: .breakfast, title: "Skyr/yogurt delattosato + frutta", description: "Skyr o yogurt proteico delattosato + frutta. Avena GF solo se serve energia.", macros: MacroValue(kcal: 280, proteinG: 30, carbsG: 30, fatG: 4), alternatives: ["Shaker proteico + frutto"]),
        MealTemplate(id: "recovery-lunch", slot: .lunch, title: "Bowl proteica ridotta", description: "Proteina 200-220 g da crudo + riso/quinoa/grano saraceno 40-50 g da crudo oppure patate 200-250 g da crudo + verdure 200-250 g da crudo o porzione libera.", macros: MacroValue(kcal: 470, proteinG: 48, carbsG: 42, fatG: 12), alternatives: ["Insalata tiepida proteica GF"]),
        MealTemplate(id: "recovery-snack", slot: .snack, title: "Yogurt proteico o frutto + proteina", description: "Yogurt proteico delattosato oppure frutto + tonno/uova/skyr.", macros: MacroValue(kcal: 220, proteinG: 24, carbsG: 24, fatG: 4), alternatives: ["Gallette GF + tonno"]),
        MealTemplate(id: "recovery-dinner", slot: .dinner, title: "Proteina + verdure + carbo controllato", description: "Pesce/carne 180-220 g da crudo oppure uova + verdure 200-250 g da crudo o porzione libera + patate 200-250 g da crudo oppure pasta/riso 50-60 g da crudo.", macros: MacroValue(kcal: 500, proteinG: 48, carbsG: 35, fatG: 16), alternatives: ["Cena freezer semplice"]),
        MealTemplate(id: "recovery-after", slot: .afterDinner, title: "Dopo cena opzionale", description: "Tisana o yogurt piccolo solo se serve. Se è solo voglia, chiudi qui.", macros: MacroValue(kcal: 80, proteinG: 8, carbsG: 10, fatG: 1), alternatives: ["Tisana"])
    ]

    static let carTravelMeals: [MealTemplate] = [
        MealTemplate(id: "car-breakfast", slot: .breakfast, title: "Colazione casa/hotel", description: "Yogurt, frutta, semi, cappuccino; se proteine basse, barretta GF o shaker.", macros: MacroValue(kcal: 350, proteinG: 30, carbsG: 35, fatG: 10), alternatives: []),
        MealTemplate(id: "car-lunch", slot: .lunch, title: "Pranzo freddo / wrap pollo", description: "Meal prep trasportabile oppure wrap/piadina GF assemblato fresco: 1 wrap/piadina senza glutine, kcal da etichetta + pollo/tacchino 180-220 g da crudo + verdure cotte/grigliate + salsa yogurt delattosato o 1 cucchiaino olio EVO. Il wrap sostituisce riso/pasta/patate: non è un extra.", macros: MacroValue(kcal: 520, proteinG: 45, carbsG: 55, fatG: 14), alternatives: ["Bowl fredda con riso/quinoa/grano saraceno 50-60 g da crudo"]),
        MealTemplate(id: "car-snack", slot: .snack, title: "Kit auto", description: "Barretta proteica GF + frutto o crackers GF pesati.", macros: MacroValue(kcal: 260, proteinG: 22, carbsG: 30, fatG: 7), alternatives: []),
        MealTemplate(id: "car-dinner", slot: .dinner, title: "Cena semplice o piatto unico", description: "Pesce/tagliata/poke GF con proteina, oppure pasta GF 60-70 g da crudo se disponibile come porzione chiara.", macros: MacroValue(kcal: 650, proteinG: 45, carbsG: 65, fatG: 22), alternatives: [])
    ]

    static let farTravelMeals: [MealTemplate] = [
        MealTemplate(id: "far-breakfast", slot: .breakfast, title: "Colazione hotel controllata", description: "Hotel: yogurt, frutta, semi, 10-15 g frutta secca, cappuccino, eventuale barretta GF. Proteine prima se disponibili.", macros: MacroValue(kcal: 420, proteinG: 32, carbsG: 40, fatG: 15), alternatives: []),
        MealTemplate(id: "far-lunch", slot: .lunch, title: "Pranzo fuori controllato", description: "Bar, ristorante o supermercato: proteine prioritarie e carboidrato semplice senza glutine. Non cercare perfezione: piatto semplice e leggibile.", macros: MacroValue(kcal: 580, proteinG: 40, carbsG: 60, fatG: 18), alternatives: []),
        MealTemplate(id: "far-snack", slot: .snack, title: "Kit emergenza", description: "Emergency kit: barretta proteica GF, frutto, shaker o yogurt proteico se disponibile.", macros: MacroValue(kcal: 240, proteinG: 22, carbsG: 26, fatG: 6), alternatives: []),
        MealTemplate(id: "far-dinner", slot: .dinner, title: "Cena fuori: un piatto solo", description: "Cena fuori con piatto unico: proteine + contorno + carboidrato semplice se serve. Punta al controllo, non alla perfezione.", macros: MacroValue(kcal: 700, proteinG: 45, carbsG: 70, fatG: 24), alternatives: [])
    ]

    static let mealPrepItems: [MealPrepItem] = [
        MealPrepItem(id: "lunch-protein-chicken", group: "Proteine batch pranzi", title: "Pollo/tacchino", detail: "700-750 g da crudo totali, da dividere in 3 porzioni."),
        MealPrepItem(id: "lunch-protein-salmon", group: "Proteine batch pranzi", title: "Salmone", detail: "1 filetto 180-200 g da crudo o surgelato."),
        MealPrepItem(id: "lunch-carb-rice", group: "Carboidrati batch pranzi", title: "Riso/quinoa/grano saraceno", detail: "50-60 g da crudo per porzione."),
        MealPrepItem(id: "lunch-veg", group: "Verdure batch pranzi", title: "Zucchine + carote", detail: "200-250 g da crudo o porzione libera."),
        MealPrepItem(id: "lunch-portion", group: "Porzioni assemblate", title: "5 pranzi freezer", detail: "Combina proteina + carboidrato da crudo già calcolato + verdure + 1 cucchiaino olio EVO."),
        MealPrepItem(id: "dinner-protein", group: "Proteine batch cene", title: "Polpette / pollo / ragù magro", detail: "4-5 porzioni, 900-1200 g da crudo."),
        MealPrepItem(id: "dinner-side", group: "Carboidrati/contorni cene", title: "Patate, riso o pasta SG", detail: "Patate 250-300 g da crudo oppure riso/pasta SG 60-70 g da crudo."),
        MealPrepItem(id: "shared-sides", group: "Contorni intercambiabili", title: "Verdure batch", detail: "Zucchine/carote, broccoli/fagiolini, spinaci/cavolfiore/verdure miste.")
    ]

    static let shoppingItems: [ShoppingListItem] = [
        ShoppingListItem(id: "shop-protein-chicken", category: "Proteine", label: "Pollo/tacchino", quantity: "700-750 g da crudo"),
        ShoppingListItem(id: "shop-protein-mince", category: "Proteine", label: "Macinato tacchino/pollo/ragù", quantity: "900-1200 g da crudo"),
        ShoppingListItem(id: "shop-salmon", category: "Proteine", label: "Salmone", quantity: "1-2 filetti 180-200 g"),
        ShoppingListItem(id: "shop-rice", category: "Carboidrati senza glutine", label: "Riso/quinoa/grano saraceno", quantity: "50-60 g da crudo per porzione"),
        ShoppingListItem(id: "shop-pasta", category: "Carboidrati senza glutine", label: "Pasta senza glutine", quantity: "60-70 g da crudo"),
        ShoppingListItem(id: "shop-potatoes", category: "Verdure", label: "Patate", quantity: "peso da crudo"),
        ShoppingListItem(id: "shop-veg", category: "Verdure", label: "Zucchine, carote, broccoli, fagiolini", quantity: "porzione libera"),
        ShoppingListItem(id: "shop-skyr", category: "Latticini/proteici", label: "Skyr/yogurt delattosato", quantity: "settimanale"),
        ShoppingListItem(id: "shop-oil", category: "Dispensa", label: "Olio EVO", quantity: "cucchiaini"),
        ShoppingListItem(id: "shop-bars", category: "Emergenze trasferta", label: "Protein bar GF, shaker, crackers GF", quantity: "kit auto")
    ]
}
