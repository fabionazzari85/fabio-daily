import SwiftData
import SwiftUI

struct MeasurementsView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \WeightEntryModel.measuredAt, order: .reverse) private var weights: [WeightEntryModel]
    @Query(sort: \WaistEntryModel.createdAt, order: .reverse) private var waists: [WaistEntryModel]

    @State private var weight = ""
    @State private var weightNote = ""
    @State private var waist = ""
    @State private var waistNote = ""

    private let dateKey = DateKeys.dayKey(Date())

    var body: some View {
        let trend = WeightTrendCalculator.calculate(weights)
        let todayManual = weights.first { $0.dateKey == dateKey && $0.source == .manual }
        let todayHealth = weights.first { $0.dateKey == dateKey && $0.source != .manual }

        NavigationStack {
            ScrollView {
                VStack(spacing: 14) {
                    FDCard {
                        Text("Peso & Misure")
                            .font(.title2.weight(.bold))
                        HStack {
                            MetricPill(label: "Ultimo", value: trend.latest.map { "\($0.weightKg.oneDecimal) kg" } ?? "n/d")
                            MetricPill(label: "Media 7g", value: trend.currentAverage.map { "\($0.oneDecimal) kg" } ?? "n/d")
                        }
                        Text("Il peso singolo può oscillare per acqua, sale, viaggio, allenamento e sonno. Guarda soprattutto la media.")
                            .font(.subheadline)
                            .foregroundStyle(.secondary)
                        if let todayManual, let todayHealth {
                            Text("Peso manuale: \(todayManual.weightKg.oneDecimal) kg · Peso Apple Health: \(todayHealth.weightKg.oneDecimal) kg · Usato per trend: manuale")
                                .font(.caption.weight(.semibold))
                                .foregroundStyle(.secondary)
                        } else if let todayHealth {
                            Text("Peso importato da Apple Health: \(todayHealth.weightKg.oneDecimal) kg")
                                .font(.caption.weight(.semibold))
                                .foregroundStyle(.secondary)
                        }
                    }

                    FDCard {
                        Text("Inserisci peso")
                            .font(.headline)
                        TextField("Peso kg", text: $weight)
                            .keyboardType(.decimalPad)
                            .textFieldStyle(.roundedBorder)
                        TextField("Nota", text: $weightNote)
                            .textFieldStyle(.roundedBorder)
                        PrimaryButton(title: "Salva peso") {
                            guard let value = Double(weight.replacingOccurrences(of: ",", with: ".")) else { return }
                            modelContext.insert(WeightEntryModel(dateKey: dateKey, weightKg: value, note: weightNote, source: .manual))
                            weight = ""
                            weightNote = ""
                        }
                    }

                    FDCard {
                        Text("Inserisci girovita")
                            .font(.headline)
                        TextField("Girovita cm", text: $waist)
                            .keyboardType(.decimalPad)
                            .textFieldStyle(.roundedBorder)
                        TextField("Nota", text: $waistNote)
                            .textFieldStyle(.roundedBorder)
                        PrimaryButton(title: "Salva girovita") {
                            guard let value = Double(waist.replacingOccurrences(of: ",", with: ".")) else { return }
                            modelContext.insert(WaistEntryModel(dateKey: dateKey, waistCm: value, note: waistNote))
                            waist = ""
                            waistNote = ""
                        }
                    }

                    FDCard {
                        Text("Storico peso")
                            .font(.headline)
                        ForEach(weights) { entry in
                            HStack {
                                VStack(alignment: .leading) {
                                    Text("\(entry.weightKg.oneDecimal) kg")
                                        .font(.subheadline.weight(.semibold))
                                    Text("\(entry.source.label) · \(entry.dateKey)")
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                    if entry.source != .manual {
                                        Text("Importato da Apple Health\(entry.sourceName.map { " · Origine: \($0)" } ?? "")")
                                            .font(.caption)
                                            .foregroundStyle(.secondary)
                                    }
                                    if !entry.note.isEmpty { Text(entry.note).font(.caption) }
                                }
                                Spacer()
                                Button(role: .destructive) {
                                    modelContext.delete(entry)
                                } label: {
                                    Image(systemName: "trash")
                                }
                            }
                            Divider()
                        }
                    }

                    FDCard {
                        Text("Storico girovita")
                            .font(.headline)
                        ForEach(waists) { entry in
                            HStack {
                                VStack(alignment: .leading) {
                                    Text("\(entry.waistCm.oneDecimal) cm")
                                        .font(.subheadline.weight(.semibold))
                                    Text(entry.dateKey)
                                        .font(.caption)
                                        .foregroundStyle(.secondary)
                                }
                                Spacer()
                                Button(role: .destructive) {
                                    modelContext.delete(entry)
                                } label: {
                                    Image(systemName: "trash")
                                }
                            }
                            Divider()
                        }
                    }
                }
                .padding()
            }
            .navigationTitle("Peso")
        }
    }
}
