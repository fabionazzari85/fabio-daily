import EventKit
import Foundation
import SwiftData

@MainActor
@Observable
final class CalendarService {
    var isSyncing = false
    var lastMessage: String?

    private let eventStore = EKEventStore()

    func requestAuthorization(modelContext: ModelContext) async {
        upsertStatus(.requested, modelContext: modelContext)

        do {
            let granted = try await eventStore.requestFullAccessToEvents()
            if granted {
                upsertStatus(.active, modelContext: modelContext)
                lastMessage = "Calendario collegato."
                await syncNow(modelContext: modelContext)
            } else {
                upsertStatus(.denied, modelContext: modelContext, error: "Permesso calendario non concesso.")
                lastMessage = "Permesso calendario non concesso."
            }
        } catch {
            upsertStatus(.error, modelContext: modelContext, error: error.localizedDescription)
            lastMessage = error.localizedDescription
        }
    }

    func syncNow(modelContext: ModelContext) async {
        isSyncing = true
        defer { isSyncing = false }

        let status = EKEventStore.authorizationStatus(for: .event)
        guard status == .fullAccess else {
            let message = "Calendario non collegato. Puoi continuare a impostare la giornata manualmente."
            upsertStatus(.denied, modelContext: modelContext, error: message)
            lastMessage = message
            return
        }

        let calendars = eventStore.calendars(for: .event)
        guard !calendars.isEmpty else {
            upsertStatus(.noCalendars, modelContext: modelContext, eventsReadToday: 0)
            lastMessage = "Nessun calendario disponibile."
            return
        }

        do {
            let today = Date()
            let events = try importEvents(for: today, calendars: calendars, modelContext: modelContext)
            let signal = makeSignal(for: today, events: events)
            upsertSignal(signal, modelContext: modelContext)
            upsertStatus(events.isEmpty ? .noEvents : .active, modelContext: modelContext, eventsReadToday: events.count)
            lastMessage = events.isEmpty ? "Nessun evento utile letto oggi." : "Calendario sincronizzato."
        } catch {
            upsertStatus(.error, modelContext: modelContext, error: error.localizedDescription)
            lastMessage = error.localizedDescription
        }
    }

    private func importEvents(for date: Date, calendars: [EKCalendar], modelContext: ModelContext) throws -> [EKEvent] {
        let interval = Calendar.current.dateInterval(of: .day, for: date) ?? DateInterval(start: date, duration: 86_400)
        let predicate = eventStore.predicateForEvents(withStart: interval.start, end: interval.end, calendars: calendars)
        let events = eventStore.events(matching: predicate)
            .sorted { $0.startDate < $1.startDate }
            .filter { !$0.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty }

        let existing = fetchCalendarEvents(modelContext)
        for event in events {
            let title = event.title ?? "Evento calendario"
            let eventIdentifier = event.eventIdentifier ?? "\(DateKeys.dayKey(event.startDate))-\(title)-\(event.startDate.timeIntervalSince1970)"
            let imported = CalendarEventImportModel(
                eventIdentifier: eventIdentifier,
                title: title,
                eventLocation: event.location,
                notes: event.notes,
                startDate: event.startDate,
                endDate: event.endDate,
                isAllDay: event.isAllDay,
                calendarTitle: event.calendar.title
            )

            if let current = existing.first(where: { $0.id == imported.id }) {
                current.title = imported.title
                current.eventLocation = imported.eventLocation
                current.notes = imported.notes
                current.startDate = imported.startDate
                current.endDate = imported.endDate
                current.isAllDay = imported.isAllDay
                current.calendarTitle = imported.calendarTitle
                current.importedAt = Date()
            } else {
                modelContext.insert(imported)
            }
        }

        return events
    }

    private func makeSignal(for date: Date, events: [EKEvent]) -> CalendarDaySignal {
        var signal = CalendarDaySignal(
            date: date,
            suggestedLocation: nil,
            suggestedFamily: nil,
            dinnerOutLikely: false,
            travelLikely: false,
            farTravelLikely: false,
            intenseDayLikely: false,
            workoutWindow: workoutWindow(from: events, date: date),
            confidence: 0,
            sourceEventIds: [],
            explanation: nil
        )

        let workTravelWords = ["trasferta", "cliente", "consulenza", "demo", "corso", "meeting fuori", "riunione fuori"]
        let farTravelWords = ["hotel", "aeroporto", "volo", "treno", "stazione", "viaggio", "flight", "airport", "train", "roma", "milano", "napoli", "palermo", "londra"]
        let dinnerWords = ["cena", "ristorante", "aperitivo", "drink", "serata", "dinner", "restaurant"]
        let edoardoWords = ["edoardo", "asilo", "scuola", "figlio", "bambino", "papa", "papà"]

        var sourceTitles: [String] = []
        for event in events {
            let title = event.title ?? "Evento calendario"
            let text = [title, event.location ?? "", event.notes ?? ""].joined(separator: " ").lowercased()
            let id = event.eventIdentifier ?? "\(DateKeys.dayKey(event.startDate))-\(title)-\(event.startDate.timeIntervalSince1970)"
            let startsEvening = Calendar.current.component(.hour, from: event.startDate) >= 18

            if text.containsAny(farTravelWords) {
                signal.suggestedLocation = .farTravel
                signal.travelLikely = true
                signal.farTravelLikely = true
                signal.confidence = max(signal.confidence, 0.9)
                signal.sourceEventIds.append(id)
                sourceTitles.append(title)
            } else if text.containsAny(workTravelWords) {
                signal.suggestedLocation = .carTravel
                signal.travelLikely = true
                signal.confidence = max(signal.confidence, 0.75)
                signal.sourceEventIds.append(id)
                sourceTitles.append(title)
            }

            if startsEvening && text.containsAny(dinnerWords) {
                signal.dinnerOutLikely = true
                signal.confidence = max(signal.confidence, 0.7)
                signal.sourceEventIds.append(id)
                sourceTitles.append(title)
            }

            if text.containsAny(edoardoWords) {
                signal.suggestedFamily = .withEdoardo
                signal.confidence = max(signal.confidence, 0.55)
                signal.sourceEventIds.append(id)
                sourceTitles.append(title)
            }
        }

        let timedEvents = events.filter { !$0.isAllDay }
        let totalHours = timedEvents.reduce(0.0) { $0 + max($1.endDate.timeIntervalSince($1.startDate), 0) / 3600 }
        let firstHour = timedEvents.first.map { Calendar.current.component(.hour, from: $0.startDate) } ?? 12
        let lastHour = timedEvents.last.map { Calendar.current.component(.hour, from: $0.endDate) } ?? 12
        signal.intenseDayLikely = events.count >= 4 || totalHours >= 6 || firstHour < 8 || lastHour >= 19 || (signal.travelLikely && events.count >= 2)
        if signal.intenseDayLikely {
            signal.confidence = max(signal.confidence, 0.65)
        }

        if signal.suggestedLocation == nil {
            signal.suggestedLocation = .home
        }

        signal.sourceEventIds = Array(Set(signal.sourceEventIds))
        let uniqueTitles = Array(Set(sourceTitles)).prefix(2)
        if events.isEmpty {
            signal.explanation = "Nessun evento calendario letto oggi."
        } else if uniqueTitles.isEmpty && !signal.intenseDayLikely {
            signal.explanation = "Calendario letto: nessun segnale forte per modificare la giornata."
        } else {
            signal.explanation = "Segnale da calendario: \(uniqueTitles.joined(separator: ", "))."
        }

        return signal
    }

    private func workoutWindow(from events: [EKEvent], date: Date) -> DateInterval? {
        var calendar = Calendar.current
        calendar.locale = Locale(identifier: "it_IT")
        let day = calendar.startOfDay(for: date)
        guard
            let morningStart = calendar.date(bySettingHour: 6, minute: 30, second: 0, of: day),
            let morningEnd = calendar.date(bySettingHour: 11, minute: 30, second: 0, of: day)
        else { return nil }

        let busy = events
            .filter { !$0.isAllDay && $0.endDate > morningStart && $0.startDate < morningEnd }
            .sorted { $0.startDate < $1.startDate }

        var cursor = morningStart
        for event in busy {
            if event.startDate.timeIntervalSince(cursor) >= 35 * 60 {
                return DateInterval(start: cursor, duration: min(45 * 60, event.startDate.timeIntervalSince(cursor)))
            }
            cursor = max(cursor, event.endDate)
        }

        if morningEnd.timeIntervalSince(cursor) >= 35 * 60 {
            return DateInterval(start: cursor, duration: 45 * 60)
        }
        return nil
    }

    private func upsertSignal(_ signal: CalendarDaySignal, modelContext: ModelContext) {
        let dateKey = DateKeys.dayKey(signal.date)
        if let existing = fetchCalendarSignals(modelContext).first(where: { $0.dateKey == dateKey }) {
            existing.update(from: signal)
        } else {
            modelContext.insert(CalendarDaySignalModel(date: signal.date, signal: signal))
        }
    }

    private func upsertStatus(_ state: CalendarPermissionState, modelContext: ModelContext, eventsReadToday: Int = 0, error: String? = nil) {
        if let existing = fetchCalendarStatuses(modelContext).first {
            existing.authorizationStatusRaw = state.rawValue
            existing.lastSyncAt = Date()
            existing.eventsReadToday = eventsReadToday
            existing.lastErrorMessage = error
            existing.updatedAt = Date()
        } else {
            modelContext.insert(CalendarSyncStatusModel(authorizationStatus: state, lastSyncAt: Date(), eventsReadToday: eventsReadToday, lastErrorMessage: error))
        }
    }

    private func fetchCalendarEvents(_ modelContext: ModelContext) -> [CalendarEventImportModel] {
        (try? modelContext.fetch(FetchDescriptor<CalendarEventImportModel>())) ?? []
    }

    private func fetchCalendarSignals(_ modelContext: ModelContext) -> [CalendarDaySignalModel] {
        (try? modelContext.fetch(FetchDescriptor<CalendarDaySignalModel>())) ?? []
    }

    private func fetchCalendarStatuses(_ modelContext: ModelContext) -> [CalendarSyncStatusModel] {
        (try? modelContext.fetch(FetchDescriptor<CalendarSyncStatusModel>())) ?? []
    }
}

private extension String {
    func containsAny(_ words: [String]) -> Bool {
        words.contains { contains($0) }
    }
}
