import Foundation

struct CalendarPlaceholder {
    let isActive = false
    let plannedSignals = [
        "casa",
        "trasferta in auto",
        "trasferta lontana / hotel",
        "cena fuori",
        "possibile finestra workout"
    ]

    var message: String {
        "EventKit non è attivo in Fase 1. La Fase calendario userà solo lettura eventi e override manuale."
    }
}
