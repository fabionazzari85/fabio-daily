import Foundation
import SwiftData

protocol MealLogRepository {
    func saveMealLog(_ log: MealLogModel, in context: ModelContext)
    func deleteMealLog(_ log: MealLogModel, in context: ModelContext)
}

protocol DayContextRepository {
    func resetDayContext(_ dayContext: DayContextModel, in context: ModelContext)
}

struct SwiftDataMealLogRepository: MealLogRepository {
    func saveMealLog(_ log: MealLogModel, in context: ModelContext) {
        context.insert(log)
    }

    func deleteMealLog(_ log: MealLogModel, in context: ModelContext) {
        context.delete(log)
    }
}

struct SwiftDataDayContextRepository: DayContextRepository {
    func resetDayContext(_ dayContext: DayContextModel, in context: ModelContext) {
        context.delete(dayContext)
    }
}
