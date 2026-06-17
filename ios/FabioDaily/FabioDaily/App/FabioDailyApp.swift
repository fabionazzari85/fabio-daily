import SwiftData
import SwiftUI

@main
struct FabioDailyApp: App {
    var body: some Scene {
        WindowGroup {
            FabioRootView()
        }
        .modelContainer(for: [
            MealLogModel.self,
            WorkoutLogModel.self,
            WeightEntryModel.self,
            WaistEntryModel.self,
            DayContextModel.self,
            MealPrepCheckModel.self,
            ShoppingListCheckModel.self
        ])
    }
}
