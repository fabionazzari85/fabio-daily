import SwiftData
import SwiftUI

struct FabioRootView: View {
    @State private var appState = AppState()
    @State private var lastAutomaticHealthSyncAt: Date?
    @Environment(\.modelContext) private var modelContext
    @Environment(\.scenePhase) private var scenePhase
    @Query private var healthSyncStatuses: [HealthSyncStatusModel]

    var body: some View {
        TabView(selection: $appState.selectedTab) {
            HomeView(appState: appState)
                .tabItem { Label("Home", systemImage: "house") }
                .tag(AppTab.home)

            LogMealView(appState: appState)
                .tabItem { Label("Log", systemImage: "plus.circle") }
                .tag(AppTab.log)

            MealPrepView()
                .tabItem { Label("Prep", systemImage: "basket") }
                .tag(AppTab.prep)

            WorkoutView()
                .tabItem { Label("Workout", systemImage: "dumbbell") }
                .tag(AppTab.workout)

            MeasurementsView()
                .tabItem { Label("Peso", systemImage: "scalemass") }
                .tag(AppTab.measurements)

            ProfileView()
                .tabItem { Label("Profilo", systemImage: "person") }
                .tag(AppTab.profile)
        }
        .environment(appState)
        .sheet(isPresented: $appState.showingDayContextEditor) {
            DayContextEditorView()
        }
        .task {
            await syncAppleHealthOnOpenIfNeeded()
        }
        .onChange(of: scenePhase) { _, newPhase in
            guard newPhase == .active else { return }
            Task { await syncAppleHealthOnOpenIfNeeded() }
        }
    }

    private func syncAppleHealthOnOpenIfNeeded() async {
        guard shouldAutoSyncAppleHealth else { return }
        let now = Date()
        if let lastAutomaticHealthSyncAt, now.timeIntervalSince(lastAutomaticHealthSyncAt) < 10 * 60 {
            return
        }

        lastAutomaticHealthSyncAt = now
        await appState.healthKitService.syncNow(modelContext: modelContext)
    }

    private var shouldAutoSyncAppleHealth: Bool {
        guard let state = healthSyncStatuses.first?.authorizationStatus else { return false }
        return state == .active || state == .noData
    }
}
