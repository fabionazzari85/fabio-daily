import SwiftData
import SwiftUI

struct LogMealView: View {
    @Bindable var appState: AppState
    @Environment(\.modelContext) private var modelContext

    @State private var slot: MealSlot = .breakfast
    @State private var category: MealCategory = .modified
    @State private var description = ""
    @State private var kcal = ""
    @State private var protein = ""
    @State private var carbs = ""
    @State private var fat = ""
    @State private var notes = ""

    private let today = Date()

    var body: some View {
        NavigationStack {
            Form {
                Picker("Slot", selection: $slot) {
                    ForEach(MealSlot.allCases) { Text($0.label).tag($0) }
                }

                Picker("Categoria", selection: $category) {
                    ForEach(MealCategory.allCases) { Text($0.label).tag($0) }
                }

                Section("Pasto") {
                    TextField("Descrizione", text: $description, axis: .vertical)
                    TextField("Kcal", text: $kcal)
                        .keyboardType(.numberPad)
                    TextField("Proteine", text: $protein)
                        .keyboardType(.numberPad)
                    TextField("Carboidrati", text: $carbs)
                        .keyboardType(.numberPad)
                    TextField("Grassi", text: $fat)
                        .keyboardType(.numberPad)
                    TextField("Note", text: $notes, axis: .vertical)
                }

                Section {
                    Button("Salva pasto") { save() }
                        .font(.headline)
                    Button("Annulla") {
                        resetForm()
                        appState.selectedTab = .home
                    }
                }
            }
            .navigationTitle(appState.editingMealLog == nil ? "Log pasto" : "Modifica pasto")
            .onAppear(perform: loadInitialValues)
        }
    }

    private func loadInitialValues() {
        if let log = appState.editingMealLog {
            slot = log.slot
            category = log.category
            description = log.mealDescription
            kcal = "\(log.kcal)"
            protein = log.proteinG.map(String.init) ?? ""
            carbs = log.carbsG.map(String.init) ?? ""
            fat = log.fatG.map(String.init) ?? ""
            notes = log.notes
            return
        }

        if let draft = appState.mealDraft {
            slot = draft.slot
            category = draft.category
            description = draft.description
            kcal = draft.macros.kcal == 0 ? "" : "\(draft.macros.kcal)"
            protein = draft.macros.proteinG.map(String.init) ?? ""
            carbs = draft.macros.carbsG.map(String.init) ?? ""
            fat = draft.macros.fatG.map(String.init) ?? ""
            notes = draft.notes
        }
    }

    private func save() {
        let dateKey = DateKeys.dayKey(today)
        let parsedKcal = Int(kcal) ?? 0
        let parsedProtein = Int(protein)
        let parsedCarbs = Int(carbs)
        let parsedFat = Int(fat)

        if let log = appState.editingMealLog {
            log.slotRaw = slot.rawValue
            log.categoryRaw = category.rawValue
            log.mealDescription = description
            log.kcal = parsedKcal
            log.proteinG = parsedProtein
            log.carbsG = parsedCarbs
            log.fatG = parsedFat
            log.notes = notes
            log.updatedAt = Date()
        } else {
            modelContext.insert(MealLogModel(dateKey: dateKey, slot: slot, category: category, mealDescription: description, kcal: parsedKcal, proteinG: parsedProtein, carbsG: parsedCarbs, fatG: parsedFat, notes: notes))
        }

        resetForm()
        appState.selectedTab = .home
    }

    private func resetForm() {
        appState.mealDraft = nil
        appState.editingMealLog = nil
        slot = .breakfast
        category = .modified
        description = ""
        kcal = ""
        protein = ""
        carbs = ""
        fat = ""
        notes = ""
    }
}
