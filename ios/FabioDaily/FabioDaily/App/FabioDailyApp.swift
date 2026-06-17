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
            ShoppingListCheckModel.self,
            HealthWorkoutImportModel.self,
            HealthDailySummaryModel.self,
            HealthSyncStatusModel.self,
            CalendarEventImportModel.self,
            CalendarDaySignalModel.self,
            CalendarSyncStatusModel.self
        ])
    }
}
