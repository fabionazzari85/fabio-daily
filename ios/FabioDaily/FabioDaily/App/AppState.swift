import Foundation
import SwiftUI

enum AppTab: String, CaseIterable {
    case home = "Home"
    case log = "Log"
    case prep = "Prep"
    case workout = "Workout"
    case measurements = "Peso"
    case profile = "Profilo"
}

@Observable
final class AppState {
    var selectedTab: AppTab = .home
    var mealDraft: MealLogDraft?
    var editingMealLog: MealLogModel?
    var showingDayContextEditor = false

    func startMealLog(_ draft: MealLogDraft?) {
        mealDraft = draft
        editingMealLog = nil
        selectedTab = .log
    }

    func editMealLog(_ log: MealLogModel) {
        editingMealLog = log
        mealDraft = nil
        selectedTab = .log
    }
}
