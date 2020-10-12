import { frequencyCounter } from "../../utilities/frequency";
import memoize from "../../utilities/memoize";
import neighbors from "../../utilities/neighbors";
import { assertEqual } from "../../utilities/test";

// Generate each possible k-mer of `size` and log it's frequency in `text`
// as an array where the i-th value in the array is the position of the
// k-mer in lexographic order.
const BA1K = (text: string, size: number) =>
  neighbors('A'.repeat(size), size).map((pattern) => memoize(frequencyCounter)(text, pattern.length)[pattern] || 0);

// Test data
assertEqual(
  BA1K(
    "ACGCGGCTCTGAAA",
    2
  ).join(" "),
  "2 1 0 0 0 0 2 2 1 2 1 0 0 1 1 0"
);