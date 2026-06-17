import Foundation

enum MealSlot: String, CaseIterable, Identifiable, Codable {
    case breakfast
    case lunch
    case snack
    case dinner
    case afterDinner
    case extra

    var id: String { rawValue }

    var label: String {
        switch self {
        case .breakfast: "Colazione"
        case .lunch: "Pranzo"
        case .snack: "Spuntino"
        case .dinner: "Cena"
        case .afterDinner: "Dopo cena"
        case .extra: "Extra"
        }
    }
}

enum MealCategory: String, CaseIterable, Identifiable, Codable {
    case followed
    case modified
    case eatingOut
    case aperitif
    case extraHunger

    var id: String { rawValue }

    var label: String {
        switch self {
        case .followed: "Pasto previsto"
        case .modified: "Ho mangiato altro"
        case .eatingOut: "Fuori casa"
        case .aperitif: "Aperitivo"
        case .extraHunger: "Extra fame"
        }
    }
}

enum DayLocation: String, CaseIterable, Identifiable, Codable {
    case home
    case carTravel
    case farTravel

    var id: String { rawValue }

    var label: String {
        switch self {
        case .home: "A casa"
        case .carTravel: "Trasferta in auto"
        case .farTravel: "Trasferta lontana / hotel"
        }
    }
}

enum DayFamily: String, CaseIterable, Identifiable, Codable {
    case withEdoardo
    case withoutEdoardo
    case unset

    var id: String { rawValue }

    var label: String {
        switch self {
        case .withEdoardo: "Con Edoardo"
        case .withoutEdoardo: "Senza Edoardo"
        case .unset: "Non impostato"
        }
    }
}

enum ImportedDataSource: String, CaseIterable, Codable {
    case manual
    case appleHealth
    case withingsViaAppleHealth
    case otherHealthSource

    var label: String {
        switch self {
        case .manual: "Manuale"
        case .appleHealth: "Apple Health"
        case .withingsViaAppleHealth: "Withings via Apple Health"
        case .otherHealthSource: "Altra sorgente Health"
        }
    }
}

enum HealthPermissionState: String, CaseIterable, Codable {
    case notConfigured
    case requested
    case active
    case denied
    case noData
    case error

    var label: String {
        switch self {
        case .notConfigured: "Non configurato"
        case .requested: "Permesso richiesto"
        case .active: "Attivo"
        case .denied: "Permesso negato"
        case .noData: "Nessun dato trovato"
        case .error: "Errore sync"
        }
    }
}

enum CalendarPermissionState: String, CaseIterable, Codable {
    case notConfigured
    case requested
    case active
    case denied
    case noCalendars
    case noEvents
    case error

    var label: String {
        switch self {
        case .notConfigured: "Non configurato"
        case .requested: "Permesso richiesto"
        case .active: "Attivo"
        case .denied: "Calendario non attivo"
        case .noCalendars: "Nessun calendario disponibile"
        case .noEvents: "Nessun evento trovato"
        case .error: "Errore sync"
        }
    }
}

struct CalendarDaySignal {
    let date: Date
    var suggestedLocation: DayLocation?
    var suggestedFamily: DayFamily?
    var dinnerOutLikely: Bool
    var travelLikely: Bool
    var farTravelLikely: Bool
    var intenseDayLikely: Bool
    var workoutWindow: DateInterval?
    var confidence: Double
    var sourceEventIds: [String]
    var explanation: String?
}

struct Profile {
    let name: String
    let heightCm: Int
    let startingWeightKg: Double
    let targetWeightKg: Double
    let goal: String
    let conditions: [String]
    let preferences: [String]
}

struct MacroValue: Codable, Equatable {
    var kcal: Int
    var proteinG: Int?
    var carbsG: Int?
    var fatG: Int?
}

struct MacroTarget: Codable, Equatable {
    var kcalMin: Int
    var kcalMax: Int
    var proteinMin: Int
    var proteinMax: Int
    var carbsMin: Int
    var carbsMax: Int
    var fatMin: Int
    var fatMax: Int
}

struct MealTemplate: Identifiable, Codable, Equatable {
    let id: String
    let slot: MealSlot
    let title: String
    let description: String
    let macros: MacroValue?
    let alternatives: [String]
}

typealias TodayMeal = MealTemplate

struct WorkoutPlan: Codable, Equatable {
    var title: String
    var type: String
    var durationMin: String
    var sourceHint: String
}

struct TodayPlan {
    let date: Date
    let dayLabel: String
    let target: MacroTarget
    let plannedMeals: [TodayMeal]
    let workoutPlan: WorkoutPlan
    let consumed: MacroValue
    let remainingKcal: Int
    let suggestions: [String]
}

struct MealLogDraft {
    var slot: MealSlot
    var category: MealCategory
    var description: String
    var macros: MacroValue
    var notes: String
}

struct DayFlags {
    var dinnerOut: Bool
    var aperitif: Bool
    var skippedWorkout: Bool
    var recoveryDay: Bool
}

struct MealPrepItem: Identifiable {
    let id: String
    let group: String
    let title: String
    let detail: String
}

struct ShoppingListItem: Identifiable {
    let id: String
    let category: String
    let label: String
    let quantity: String
}

struct AutomaticSyncStatus {
    var appleHealthEnabled: Bool
    var appleWatchEnabled: Bool
    var bodyWeightEnabled: Bool
    var calendarEnabled: Bool
    var lastSyncAt: Date?
}

struct NativeIntegrationSettings {
    var appleHealthPlanned: Bool
    var appleWatchPlanned: Bool
    var calendarPlanned: Bool
    var withingsViaAppleHealthPlanned: Bool
}
