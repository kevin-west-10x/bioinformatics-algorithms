import { atLeast, frequencyCounter } from "../../utilities/frequency";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

/**
 * Find patterns with length `size` that occur at least `frequency` times inside
 * a window of text of size `clumpSize`.
 */
const BA1E = (text: string, size: number, clumpSize: number, frequency: number) =>
  Object.keys(
    // Reduce over all possible clumps
    wordReduce(
      text,
      clumpSize,
      (patterns, clump) => ({
        ...patterns,
        // Find all patterns of length `size` in the clump that occur at least `frequency` times
        ...atLeast(frequency)(frequencyCounter(clump, size))
      }),
      {}
    )
  );

// Test data
assertEqual(
  "BA1E",
  BA1E(
    "CGGACTCGACAGATGTGAAGAAATGTGAAGACTGAGTGAAGAGAAGAGGAAACACGACACGACATTGCGACATAATGTACGAATGTAATGTGCCTATGGC",
    5,
    75,
    4
  ).sort().join(" "), "AATGT CGACA GAAGA");