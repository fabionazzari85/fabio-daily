import SwiftData
import SwiftUI

struct MealPrepView: View {
    @Environment(\.modelContext) private var modelContext
    @Query private var prepChecks: [MealPrepCheckModel]
    @Query private var shoppingChecks: [ShoppingListCheckModel]

    private let weekKey = DateKeys.weekKey(Date())

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    FDCard {
                        Text("Meal Prep & Spesa")
                            .font(.title2.weight(.bold))
                        Text("Pesi indicati da crudo, salvo diversa indicazione.")
                            .font(.subheadline.weight(.semibold))
                            .foregroundStyle(.green)
                        Text("Sposta dal freezer al frigo la sera prima.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }

                    ForEach(groupedPrep.keys.sorted(), id: \.self) { group in
                        FDCard {
                            Text(group)
                                .font(.headline)
                            ForEach(groupedPrep[group] ?? []) { item in
                                Toggle(isOn: bindingForPrep(item.id)) {
                                    VStack(alignment: .leading) {
                                        Text(item.title).font(.subheadline.weight(.semibold))
                                        Text(item.detail).font(.caption).foregroundStyle(.secondary)
                                    }
                                }
                                .padding(.vertical, 4)
                            }
                        }
                    }

                    ForEach(groupedShopping.keys.sorted(), id: \.self) { category in
                        FDCard {
                            Text(category)
                                .font(.headline)
                            ForEach(groupedShopping[category] ?? []) { item in
                                Toggle(isOn: bindingForShopping(item.id)) {
                                    VStack(alignment: .leading) {
                                        Text(item.label).font(.subheadline.weight(.semibold))
                                        Text(item.quantity).font(.caption).foregroundStyle(.secondary)
                                    }
                                }
                                .padding(.vertical, 4)
                            }
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Prep")
        }
    }

    private var groupedPrep: [String: [MealPrepItem]] {
        Dictionary(grouping: SeedData.mealPrepItems, by: \.group)
    }

    private var groupedShopping: [String: [ShoppingListItem]] {
        Dictionary(grouping: SeedData.shoppingItems, by: \.category)
    }

    private func bindingForPrep(_ itemId: String) -> Binding<Bool> {
        Binding {
            prepChecks.first { $0.weekKey == weekKey && $0.itemId == itemId }?.checked ?? false
        } set: { checked in
            if let existing = prepChecks.first(where: { $0.weekKey == weekKey && $0.itemId == itemId }) {
                existing.checked = checked
            } else {
                modelContext.insert(MealPrepCheckModel(weekKey: weekKey, itemId: itemId, checked: checked))
            }
        }
    }

    private func bindingForShopping(_ itemId: String) -> Binding<Bool> {
        Binding {
            shoppingChecks.first { $0.weekKey == weekKey && $0.itemId == itemId }?.checked ?? false
        } set: { checked in
            if let existing = shoppingChecks.first(where: { $0.weekKey == weekKey && $0.itemId == itemId }) {
                existing.checked = checked
            } else {
                modelContext.insert(ShoppingListCheckModel(weekKey: weekKey, itemId: itemId, checked: checked))
            }
        }
    }
}
