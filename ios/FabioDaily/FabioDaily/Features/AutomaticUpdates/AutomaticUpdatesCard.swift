import SwiftUI

struct AutomaticUpdatesCard: View {
    var body: some View {
        FDCard {
            VStack(alignment: .leading, spacing: 10) {
                Text("Aggiornamenti automatici")
                    .font(.title3.weight(.bold))
                Text("Prossimo step: import automatico da Apple Health, Apple Watch, peso corporeo e calendario iPhone.")
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
                VStack(alignment: .leading, spacing: 6) {
                    status("Apple Health")
                    status("Apple Watch")
                    status("Peso da Apple Health")
                    status("Calendario iPhone")
                    status("Withings via Apple Health")
                }
            }
        }
    }

    private func status(_ label: String) -> some View {
        HStack {
            Text(label)
            Spacer()
            Text("non attivo / futuro")
                .font(.caption.weight(.semibold))
                .foregroundStyle(.secondary)
        }
    }
}
