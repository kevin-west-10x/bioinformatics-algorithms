import memoize from "../../utilities/memoize";
import skew from "../../utilities/skew";
import { assertEqual } from "../../utilities/test";

// Memoize a function to grab the minimum skew in the list
const minSkew = memoize((skews: number[]) => Math.min(...skews));

// Reduce across the array of skew values and return the indices of the minimum skew values
const BA1F = (text: string) =>
  skew(text)
    .reduce<number[]>(
      (indices, skew, index, skews) => skew === minSkew(skews) ? [...indices, index] : indices,
      []
    );

// Test data
assertEqual(
  "BA1F",
  BA1F("CCTATCGGTGGATTAGCATGTCCCTGTACGTTTCGCCGCGAACTAGTTCACACGGCTTGATGGCAAATGGTTTTTCCGGCGACCGTAATCGTCCACCGAG").join(" "),
  "53 97"
);