import { prefix, suffix } from "./pattern";

export type PairMapper = (str: string) => string;
export type PairFn = (pair: string) => string;
export const pairMap = (mapper: PairMapper): PairFn =>
  (pair: string) => pair.split("|").map(mapper).join("|");

export const pairPrefix = pairMap(prefix);
export const pairSuffix = pairMap(suffix);

export type PairReducer = (currentResult: string, value: string) => string;

// Walk through the path of pairs, first by going through
// the first value of each pair, then finish off by walking
// through the second values of the last (size + distance + 1)
// pairs (since each pair is an edge).
export function pairReduce(
  pairs: string[],
  distance: number,
  reducer: PairReducer,
  initialResult?: string
): string {
  const path = pairs.map(
    pair => pair.split("|")[0]
  ).concat(
    pairs
      .slice(-1 * (Math.floor(pairs[0].length / 2) + distance + 1))
      .map(pair => pair.split("|")[1])
  );
  if (initialResult) {
    return path.reduce(reducer, initialResult);
  } else {
    return path.reduce(reducer);
  }
}
