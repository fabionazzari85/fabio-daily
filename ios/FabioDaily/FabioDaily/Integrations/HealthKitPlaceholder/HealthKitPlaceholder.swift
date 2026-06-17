import Foundation

struct HealthKitPlaceholder {
    let isActive = false
    let plannedReads = [
        "workout completati",
        "passi",
        "calorie attive",
        "distanza camminata/corsa",
        "peso corporeo da Apple Health"
    ]

    var message: String {
        "HealthKit non è attivo in Fase 1. La Fase 2 aggiungerà permessi e import automatico."
    }
}
