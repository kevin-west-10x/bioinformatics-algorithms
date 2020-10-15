import { countMax, frequencyCounter } from "../../utilities/frequency";
import neighbors from "../../utilities/neighbors";
import { assertEqual } from "../../utilities/test";

// Find the strings that occur most frequently in text, allowing for mismatches
// of size `distance`.
const BA1I = (text: string, size: number, distance: number) =>
  Object.keys(
    countMax(
      frequencyCounter(
        text,
        size,
        // Transform the word into all close neighbors and count as well
        word => neighbors(word, distance)
      )
    )
  );

// Test data
assertEqual(
  "BA1I",
  BA1I(
    "ACGTTGCATGTCGCATGATGCATGAGAGCT",
    4,
    1
  ).sort().join(" "),
  "ATGC ATGT GATG"
);