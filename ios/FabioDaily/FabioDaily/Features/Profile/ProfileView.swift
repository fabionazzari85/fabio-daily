import SwiftUI

struct ProfileView: View {
    @Environment(AppState.self) private var appState
    private let profile = SeedData.profile

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    FDCard {
                        Text(profile.name)
                            .font(.title2.weight(.bold))
                        MetricPill(label: "Altezza", value: "\(profile.heightCm) cm")
                        MetricPill(label: "Peso iniziale", value: "\(profile.startingWeightKg.oneDecimal) kg")
                        MetricPill(label: "Peso obiettivo", value: "\(profile.targetWeightKg.oneDecimal) kg")
                        Text(profile.goal)
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                    }

                    FDCard {
                        Text("Regole personali")
                            .font(.headline)
                        ForEach(profile.conditions + profile.preferences, id: \.self) { item in
                            Text(item)
                                .font(.subheadline)
                                .padding(.vertical, 2)
                        }
                    }

                    FDCard {
                        Text("Target")
                            .font(.headline)
                        Text("Recupero: 1700 kcal")
                        Text("Attivo: 1800 kcal")
                        Text("Proteine: 155-170 g/die")
                        Text("Calorie attività: indicatore, non bonus automatico.")
                            .font(.caption.weight(.semibold))
                            .foregroundStyle(.secondary)
                    }

                    AutomaticUpdatesCard(healthKitService: appState.healthKitService)
                }
                .padding()
            }
            .navigationTitle("Profilo")
        }
    }
}
