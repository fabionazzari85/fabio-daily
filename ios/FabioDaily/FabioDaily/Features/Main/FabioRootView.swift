import SwiftData
import SwiftUI

struct FabioRootView: View {
    @State private var appState = AppState()
    @Environment(\.modelContext) private var modelContext

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
    }
}
