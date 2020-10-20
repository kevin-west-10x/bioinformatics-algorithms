import hammingDistance from "../../utilities/hammingDistance";
import neighbors from "../../utilities/neighbors";
import { pickMin } from "../../utilities/pick";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

interface MedianString {
  distance: number;
  pattern: string;
}

// Reduce across all patterns of `size` and set median when finding lower distance
const BA2B = (texts: string[], size: number): string =>
  neighbors("A".repeat(size), size).reduce<MedianString>(
    (median, pattern) => pickMin(
      item => item.distance,
      median,
      {
        distance: texts.reduce(
          // Reduce across all words in text to find minimum hamming distance
          (distance, text) => distance + wordReduce(
            text,
            size,
            (min, word) => Math.min(hammingDistance(pattern, word), min),
            Infinity
          ),
          0
        ),
        pattern,
      }
    ),
    {
      distance: Infinity,
      pattern: "",
    }
  ).pattern;

// Test data
assertEqual(
  "BA2B",
  BA2B(
    ["AAATTGACGCAT", "GACGACCACGTT", "CGTCAGCGCCTG", "GCTGAGCACCGG", "AGTACGGGACAG"],
    3
  ),
  "ACG",
  "GAC"
);
