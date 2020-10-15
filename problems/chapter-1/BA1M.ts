import { indexToPattern } from "../../utilities/lexographic";
import { assertEqual } from "../../utilities/test";

// Return the pattern at `index` for the lexographical list of all
// patterns of `size`
const BA1M = (index: number, size: number) => indexToPattern(index, size);

// Test data
assertEqual(
  "BA1M",
  BA1M(45, 4),
  "AGTC"
);