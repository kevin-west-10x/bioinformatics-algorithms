import { countMax, frequencyCounter } from "../../utilities/frequency";
import neighbors from "../../utilities/neighbors";
import reverseComplement from "../../utilities/reverseComplement";
import { assertEqual } from "../../utilities/test";

// Find the strings that occur most frequently in text, allowing for mismatches
// of size `distance`, and counting reverse complements as well.
const BA1J = (text: string, size: number, distance: number) =>
  Object.keys(
    countMax(
      frequencyCounter(
        text,
        size,
        // Transform the word into all close neighbors and their reverse complements
        // and count each of them.
        word => neighbors(word, distance)
          .reduce<string[]>(
            (words, word) => [...words, word, reverseComplement(word)],
            []
          )
      )
    )
  );

// Test data
assertEqual(
  BA1J(
    "ACGTTGCATGTCGCATGATGCATGAGAGCT",
    4,
    1
  ).sort().join(" "),
  "ACAT ATGT"
);