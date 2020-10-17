import hammingDistance from "../../utilities/hammingDistance";
import { indexFromBase } from "../../utilities/lexographic";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

// This is a fancy way of typing the input array such that the length of the
// first array (technically a tuple) defines the length of all subsequent arrays.
// This way we can define Profile as a matrix with 4 rows, where each row must
// have length equal to the length of the first row.
type Profile<T extends readonly [] | readonly number[], U = { [K in keyof T ]: T[K] }> = [T, U, U, U];

interface ProfileMostProbable {
  pattern: string;
  probability: number;
}

// Reduce across all patterns of `size` and when finding a greater probability pick that one
const BA2C = <T extends readonly [] | readonly number[]>(text: string, size: number, profile: Profile<T>): string =>
  wordReduce<ProfileMostProbable>(
    text,
    size,
    (profileMostProbable, pattern) => {
      // Calculate probability by converting character to index of row in profile, picking the
      // probability at the index of the character in the pattern, and multiplying them all together
      const probability =
        pattern
          .split("")
          .map(indexFromBase)
          .reduce(
            (probability, baseIndex, letterIndex) => probability * profile[baseIndex][letterIndex],
            1
          );
      return probability > profileMostProbable.probability ? { pattern, probability } : profileMostProbable;
    },
    {
      probability: 0,
      pattern: ""
    }
  ).pattern;

// Test data
assertEqual(
  "BA2C",
  BA2C(
    "ACCTGTTTATTGCCTAAGTTCCGAACAAACCCAATATAGCCCGAGGGCCT",
    5,
    [
      [0.2, 0.2, 0.3, 0.2, 0.3],
      [0.4, 0.3, 0.1, 0.5, 0.1],
      [0.3, 0.3, 0.5, 0.2, 0.4],
      [0.1, 0.2, 0.1, 0.1, 0.2]
    ]
  ),
  "CCGAG"
);
