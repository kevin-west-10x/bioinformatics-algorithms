import memoize from "./memoize";
import { wordReduce } from "./word";

export type FrequencyTable = Record<string, number>;

export const incrementCounts = (counts: FrequencyTable, key: string) => ({ ...counts, [key]: (counts[key] || 0) + 1 });

/**
 * A function which takes in a text and word length, and returns a FrequencyTable containing the
 * counts of each word. If getWords is passed, it will transform the current word into an
 * arbitrary array of words, each of which will be counted in the table.
 * 
 * @param transform An optional transform function if you want to count words
 *                 based on the current word in the window.
 */
type TransformWords = (word: string) => string[];
const defaultTransformWords: TransformWords = word => [word];
export const frequencyCounter = (
  text: string,
  size: number,
  transform: TransformWords = defaultTransformWords
): FrequencyTable =>
  wordReduce<FrequencyTable>(
    text,
    size,
    (counts, word) => transform(word).reduce<FrequencyTable>(incrementCounts, counts),
      {}
  );
  
type Filter = (count: FrequencyTable[keyof FrequencyTable], counts: FrequencyTable) => boolean;
type FrequencyFilter = (counts: FrequencyTable) => FrequencyTable;
const countTableFilter = (countFilter: Filter) =>
  (counts: FrequencyTable): FrequencyTable =>
    Object.entries(counts)
      .reduce<FrequencyTable>(
        (filtered, [word, count]) => countFilter(count, counts)
          ? ({ ...filtered, [word]: count })
          : filtered,
        {}
      );

// Filters that can be applied to a frequencyCounter
const maxCount = memoize((counts: FrequencyTable) => Math.max(...Object.values(counts)));
export const countMax: FrequencyFilter = countTableFilter((count, counts) => count === maxCount(counts));

const minCount = memoize((counts: FrequencyTable) => Math.min(...Object.values(counts)));
export const countMin: FrequencyFilter = countTableFilter((count, counts) => count === minCount(counts));

export const atLeast = (frequency: number): FrequencyFilter => countTableFilter(count => count >= frequency);
