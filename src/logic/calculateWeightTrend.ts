import type { WeightEntry } from "@/domain/types";

export type WeightTrend = {
  latestWeight?: WeightEntry;
  currentSevenDayAverage?: number;
  previousSevenDayAverage?: number;
  weeklyDifference?: number;
  message: string;
};

export function calculateWeightTrend(entries: WeightEntry[]): WeightTrend {
  const sortedEntries = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const latestWeight = sortedEntries.at(-1);

  if (!latestWeight || sortedEntries.length < 3) {
    return {
      latestWeight,
      message: "Inserisci il peso per alcuni giorni: la media sarà più utile del singolo numero.",
    };
  }

  const currentEntries = sortedEntries.slice(-7);
  const previousEntries = sortedEntries.slice(-14, -7);
  const currentSevenDayAverage = average(currentEntries.map((entry) => entry.weightKg));
  const previousSevenDayAverage = previousEntries.length ? average(previousEntries.map((entry) => entry.weightKg)) : undefined;
  const weeklyDifference =
    currentSevenDayAverage !== undefined && previousSevenDayAverage !== undefined
      ? roundOneDecimal(currentSevenDayAverage - previousSevenDayAverage)
      : undefined;
  const previousWeight = sortedEntries.at(-2);

  return {
    latestWeight,
    currentSevenDayAverage,
    previousSevenDayAverage,
    weeklyDifference,
    message: buildTrendMessage({
      latestWeight,
      previousWeight,
      currentSevenDayAverage,
      previousSevenDayAverage,
      weeklyDifference,
    }),
  };
}

function buildTrendMessage({
  latestWeight,
  previousWeight,
  currentSevenDayAverage,
  previousSevenDayAverage,
  weeklyDifference,
}: {
  latestWeight?: WeightEntry;
  previousWeight?: WeightEntry;
  currentSevenDayAverage?: number;
  previousSevenDayAverage?: number;
  weeklyDifference?: number;
}) {
  if (!latestWeight || currentSevenDayAverage === undefined) {
    return "Inserisci il peso per alcuni giorni: la media sarà più utile del singolo numero.";
  }

  if (weeklyDifference === undefined || previousSevenDayAverage === undefined) {
    if (previousWeight && latestWeight.weightKg > previousWeight.weightKg) {
      return "Peso singolo in aumento, ma guarda la media settimanale: può essere acqua, sale o cena tardiva.";
    }

    return "Continua a registrare: tra pochi giorni la media settimanale sarà più chiara.";
  }

  if (weeklyDifference < -1) {
    return "Stai scendendo molto rapidamente. Se fame, energia o allenamenti peggiorano, valuta di alzare leggermente le calorie.";
  }

  if (weeklyDifference < -0.1) {
    return "Trend in discesa. Continua così, senza tagliare ancora.";
  }

  if (previousWeight && latestWeight.weightKg > previousWeight.weightKg && weeklyDifference <= 0) {
    return "Peso singolo in aumento, ma guarda la media settimanale: può essere acqua, sale o cena tardiva.";
  }

  if (weeklyDifference > 0.2) {
    return "Media in leggero aumento: osserva qualche giorno prima di cambiare il piano.";
  }

  return "Trend stabile: usa la media settimanale, non il singolo giorno.";
}

function average(values: number[]) {
  if (!values.length) return undefined;
  return roundOneDecimal(values.reduce((total, value) => total + value, 0) / values.length);
}

function roundOneDecimal(value: number) {
  return Math.round(value * 10) / 10;
}
