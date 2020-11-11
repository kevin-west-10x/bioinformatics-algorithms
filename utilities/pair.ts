import { prefix, suffix } from "./pattern";

export type Pair = [string, string];

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
export const pairReduce = (
  pairs: string[],
  reducer: PairReducer
): Pair =>
  pairs.map(
    pair => pair.split("|")
  ).filter<Pair>(
    (pair): pair is Pair => pair.length === 2
  ).reduce(
    ([text1, text2], [value1, value2]) => [reducer(text1, value1), reducer(text2, value2)]
  );

export const pairSplice = (pairs: string[], size: number, distance: number): string => 
  pairReduce(
    pairs,
    (text, value) => text + value[value.length - 1]
  ).reduce(
    (text1, text2) => text1.length >= size + distance 
      ? text1.slice(0, size + distance) + text2
      : ""
  );
