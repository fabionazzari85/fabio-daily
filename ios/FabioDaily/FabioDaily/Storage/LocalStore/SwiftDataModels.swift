import Foundation
import SwiftData

@Model
final class MealLogModel {
    @Attribute(.unique) var id: String
    var dateKey: String
    var slotRaw: String
    var categoryRaw: String
    var mealDescription: String
    var kcal: Int
    var proteinG: Int?
    var carbsG: Int?
    var fatG: Int?
    var notes: String
    var createdAt: Date
    var updatedAt: Date?

    init(id: String = UUID().uuidString, dateKey: String, slot: MealSlot, category: MealCategory, mealDescription: String, kcal: Int, proteinG: Int?, carbsG: Int?, fatG: Int?, notes: String = "") {
        self.id = id
        self.dateKey = dateKey
        self.slotRaw = slot.rawValue
        self.categoryRaw = category.rawValue
        self.mealDescription = mealDescription
        self.kcal = kcal
        self.proteinG = proteinG
        self.carbsG = carbsG
        self.fatG = fatG
        self.notes = notes
        self.createdAt = Date()
    }

    var slot: MealSlot { MealSlot(rawValue: slotRaw) ?? .extra }
    var category: MealCategory { MealCategory(rawValue: categoryRaw) ?? .modified }
    var macros: MacroValue { MacroValue(kcal: kcal, proteinG: proteinG, carbsG: carbsG, fatG: fatG) }
}

@Model
final class WorkoutLogModel {
    @Attribute(.unique) var dateKey: String
    var plannedType: String
    var completed: Bool
    var durationMinutes: Int?
    var activeCalories: Int?
    var energyLevel: String
    var effortLevel: String
    var notes: String
    var createdAt: Date
    var updatedAt: Date?

    init(dateKey: String, plannedType: String, completed: Bool = false, durationMinutes: Int? = nil, activeCalories: Int? = nil, energyLevel: String = "media", effortLevel: String = "giusto", notes: String = "") {
        self.dateKey = dateKey
        self.plannedType = plannedType
        self.completed = completed
        self.durationMinutes = durationMinutes
        self.activeCalories = activeCalories
        self.energyLevel = energyLevel
        self.effortLevel = effortLevel
        self.notes = notes
        self.createdAt = Date()
    }
}

@Model
final class WeightEntryModel {
    @Attribute(.unique) var id: String
    var dateKey: String
    var measuredAt: Date
    var weightKg: Double
    var note: String
    var sourceRaw: String
    var sourceName: String?
    var sourceBundleId: String?
    var healthKitUUID: String?
    var createdAt: Date
    var updatedAt: Date?

    init(id: String = UUID().uuidString, dateKey: String, measuredAt: Date = Date(), weightKg: Double, note: String = "", source: ImportedDataSource = .manual, sourceName: String? = nil, sourceBundleId: String? = nil, healthKitUUID: String? = nil) {
        self.id = id
        self.dateKey = dateKey
        self.measuredAt = measuredAt
        self.weightKg = weightKg
        self.note = note
        self.sourceRaw = source.rawValue
        self.sourceName = sourceName
        self.sourceBundleId = sourceBundleId
        self.healthKitUUID = healthKitUUID
        self.createdAt = Date()
    }

    var source: ImportedDataSource { ImportedDataSource(rawValue: sourceRaw) ?? .manual }
}

@Model
final class HealthWorkoutImportModel {
    @Attribute(.unique) var healthKitUUID: String
    var startDate: Date
    var endDate: Date
    var dateKey: String
    var durationMinutes: Double
    var workoutType: String
    var activeCalories: Double?
    var distanceKm: Double?
    var sourceName: String?
    var sourceBundleId: String?
    var importedAt: Date

    init(healthKitUUID: String, startDate: Date, endDate: Date, workoutType: String, durationMinutes: Double, activeCalories: Double?, distanceKm: Double?, sourceName: String?, sourceBundleId: String?) {
        self.healthKitUUID = healthKitUUID
        self.startDate = startDate
        self.endDate = endDate
        self.dateKey = DateKeys.dayKey(startDate)
        self.workoutType = workoutType
        self.durationMinutes = durationMinutes
        self.activeCalories = activeCalories
        self.distanceKm = distanceKm
        self.sourceName = sourceName
        self.sourceBundleId = sourceBundleId
        self.importedAt = Date()
    }
}

@Model
final class HealthDailySummaryModel {
    @Attribute(.unique) var dateKey: String
    var date: Date
    var steps: Int?
    var activeEnergyKcal: Double?
    var walkingRunningDistanceKm: Double?
    var importedAt: Date

    init(date: Date, steps: Int?, activeEnergyKcal: Double?, walkingRunningDistanceKm: Double?) {
        self.date = date
        self.dateKey = DateKeys.dayKey(date)
        self.steps = steps
        self.activeEnergyKcal = activeEnergyKcal
        self.walkingRunningDistanceKm = walkingRunningDistanceKm
        self.importedAt = Date()
    }
}

@Model
final class HealthSyncStatusModel {
    @Attribute(.unique) var id: String
    var authorizationStatusRaw: String
    var lastSyncAt: Date?
    var lastErrorMessage: String?
    var healthKitAvailable: Bool
    var updatedAt: Date

    init(id: String = "healthkit", authorizationStatus: HealthPermissionState = .notConfigured, lastSyncAt: Date? = nil, lastErrorMessage: String? = nil, healthKitAvailable: Bool = true) {
        self.id = id
        self.authorizationStatusRaw = authorizationStatus.rawValue
        self.lastSyncAt = lastSyncAt
        self.lastErrorMessage = lastErrorMessage
        self.healthKitAvailable = healthKitAvailable
        self.updatedAt = Date()
    }

    var authorizationStatus: HealthPermissionState {
        HealthPermissionState(rawValue: authorizationStatusRaw) ?? .notConfigured
    }
}

@Model
final class CalendarEventImportModel {
    @Attribute(.unique) var id: String
    var eventIdentifier: String
    var dateKey: String
    var title: String
    var eventLocation: String?
    var notes: String?
    var startDate: Date
    var endDate: Date
    var isAllDay: Bool
    var calendarTitle: String?
    var importedAt: Date

    init(eventIdentifier: String, title: String, eventLocation: String?, notes: String?, startDate: Date, endDate: Date, isAllDay: Bool, calendarTitle: String?) {
        self.eventIdentifier = eventIdentifier
        self.dateKey = DateKeys.dayKey(startDate)
        self.id = "\(DateKeys.dayKey(startDate)):\(eventIdentifier)"
        self.title = title
        self.eventLocation = eventLocation
        self.notes = notes
        self.startDate = startDate
        self.endDate = endDate
        self.isAllDay = isAllDay
        self.calendarTitle = calendarTitle
        self.importedAt = Date()
    }
}

@Model
final class CalendarDaySignalModel {
    @Attribute(.unique) var dateKey: String
    var date: Date
    var suggestedLocationRaw: String?
    var suggestedFamilyRaw: String?
    var dinnerOutLikely: Bool
    var travelLikely: Bool
    var farTravelLikely: Bool
    var intenseDayLikely: Bool
    var workoutWindowStart: Date?
    var workoutWindowEnd: Date?
    var confidence: Double
    var sourceEventIdsJoined: String
    var explanation: String?
    var importedAt: Date

    init(date: Date, signal: CalendarDaySignal) {
        self.date = date
        self.dateKey = DateKeys.dayKey(date)
        self.suggestedLocationRaw = signal.suggestedLocation?.rawValue
        self.suggestedFamilyRaw = signal.suggestedFamily?.rawValue
        self.dinnerOutLikely = signal.dinnerOutLikely
        self.travelLikely = signal.travelLikely
        self.farTravelLikely = signal.farTravelLikely
        self.intenseDayLikely = signal.intenseDayLikely
        self.workoutWindowStart = signal.workoutWindow?.start
        self.workoutWindowEnd = signal.workoutWindow?.end
        self.confidence = signal.confidence
        self.sourceEventIdsJoined = signal.sourceEventIds.joined(separator: "|")
        self.explanation = signal.explanation
        self.importedAt = Date()
    }

    var suggestedLocation: DayLocation? {
        suggestedLocationRaw.flatMap(DayLocation.init(rawValue:))
    }

    var suggestedFamily: DayFamily? {
        suggestedFamilyRaw.flatMap(DayFamily.init(rawValue:))
    }

    var sourceEventIds: [String] {
        sourceEventIdsJoined.split(separator: "|").map(String.init)
    }

    var workoutWindow: DateInterval? {
        guard let workoutWindowStart, let workoutWindowEnd else { return nil }
        return DateInterval(start: workoutWindowStart, end: workoutWindowEnd)
    }

    func update(from signal: CalendarDaySignal) {
        suggestedLocationRaw = signal.suggestedLocation?.rawValue
        suggestedFamilyRaw = signal.suggestedFamily?.rawValue
        dinnerOutLikely = signal.dinnerOutLikely
        travelLikely = signal.travelLikely
        farTravelLikely = signal.farTravelLikely
        intenseDayLikely = signal.intenseDayLikely
        workoutWindowStart = signal.workoutWindow?.start
        workoutWindowEnd = signal.workoutWindow?.end
        confidence = signal.confidence
        sourceEventIdsJoined = signal.sourceEventIds.joined(separator: "|")
        explanation = signal.explanation
        importedAt = Date()
    }
}

@Model
final class CalendarSyncStatusModel {
    @Attribute(.unique) var id: String
    var authorizationStatusRaw: String
    var lastSyncAt: Date?
    var eventsReadToday: Int
    var lastErrorMessage: String?
    var updatedAt: Date

    init(id: String = "calendar", authorizationStatus: CalendarPermissionState = .notConfigured, lastSyncAt: Date? = nil, eventsReadToday: Int = 0, lastErrorMessage: String? = nil) {
        self.id = id
        self.authorizationStatusRaw = authorizationStatus.rawValue
        self.lastSyncAt = lastSyncAt
        self.eventsReadToday = eventsReadToday
        self.lastErrorMessage = lastErrorMessage
        self.updatedAt = Date()
    }

    var authorizationStatus: CalendarPermissionState {
        CalendarPermissionState(rawValue: authorizationStatusRaw) ?? .notConfigured
    }
}

@Model
final class WaistEntryModel {
    @Attribute(.unique) var id: String
    var dateKey: String
    var waistCm: Double
    var note: String
    var createdAt: Date
    var updatedAt: Date?

    init(id: String = UUID().uuidString, dateKey: String, waistCm: Double, note: String = "") {
        self.id = id
        self.dateKey = dateKey
        self.waistCm = waistCm
        self.note = note
        self.createdAt = Date()
    }
}

@Model
final class DayContextModel {
    @Attribute(.unique) var dateKey: String
    var locationRaw: String
    var familyRaw: String
    var dinnerOut: Bool
    var aperitif: Bool
    var skippedWorkout: Bool
    var recoveryDay: Bool
    var updatedAt: Date

    init(dateKey: String, location: DayLocation = .home, family: DayFamily = .unset, flags: DayFlags = DayFlags(dinnerOut: false, aperitif: false, skippedWorkout: false, recoveryDay: false)) {
        self.dateKey = dateKey
        self.locationRaw = location.rawValue
        self.familyRaw = family.rawValue
        self.dinnerOut = flags.dinnerOut
        self.aperitif = flags.aperitif
        self.skippedWorkout = flags.skippedWorkout
        self.recoveryDay = flags.recoveryDay
        self.updatedAt = Date()
    }

    var location: DayLocation { DayLocation(rawValue: locationRaw) ?? .home }
    var family: DayFamily { DayFamily(rawValue: familyRaw) ?? .unset }
    var flags: DayFlags { DayFlags(dinnerOut: dinnerOut, aperitif: aperitif, skippedWorkout: skippedWorkout, recoveryDay: recoveryDay) }
}

@Model
final class MealPrepCheckModel {
    @Attribute(.unique) var id: String
    var weekKey: String
    var itemId: String
    var checked: Bool

    init(weekKey: String, itemId: String, checked: Bool) {
        self.id = "\(weekKey):\(itemId)"
        self.weekKey = weekKey
        self.itemId = itemId
        self.checked = checked
    }
}

@Model
final class ShoppingListCheckModel {
    @Attribute(.unique) var id: String
    var weekKey: String
    var itemId: String
    var checked: Bool

    init(weekKey: String, itemId: String, checked: Bool) {
        self.id = "\(weekKey):\(itemId)"
        self.weekKey = weekKey
        self.itemId = itemId
        self.checked = checked
    }
}
