import hammingDistance from "../../utilities/hammingDistance";
import { parseInput } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

// Gibbs Sampler search
const BA2H = (texts: string[], pattern: string): number => 
  texts.reduce(
    // Reduce across all words in text to find minimum hamming distance
    (distance, text) => distance + wordReduce(
      text,
      pattern.length,
      (min, word) => Math.min(hammingDistance(pattern, word), min),
      Infinity
    ),
    0
  );

// Test data
assertEqual(
  "BA2H",
  BA2H(
    [
      "TTACCTTAAC",
      "GATATCTGTC",
      "ACGGCGTTCG",
      "CCCTAAAGAG",
      "CGTCAGAGGT"
    ],
    "AAA"
  ),
  5
);
