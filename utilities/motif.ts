import { FrequencyTable, incrementCounts } from "./frequency";
import memoize from "./memoize";

const scoreBaseCount = (baseCount: FrequencyTable): number =>
  Object.values(baseCount).reduce((total, count) => total + count) - Math.max(...Object.values(baseCount))

const scoreIndex = (motifs: string[], index: number): number =>
  scoreBaseCount(motifs.map(motif => motif[index]).reduce(incrementCounts, {}))

export const scoreMotifs = memoize(
  (motifs: string[]): number => 
    motifs.length === 0
      ? Infinity
      : motifs[0].split("").reduce(
          (score, _, index) => score + scoreIndex(motifs, index),
          0
        )
);
