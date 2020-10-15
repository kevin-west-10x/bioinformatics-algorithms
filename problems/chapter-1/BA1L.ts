import { patternToIndex } from "../../utilities/lexographic";
import { assertEqual } from "../../utilities/test";

// Convert a pattern into it's lexographical index among all patterns of the same size
const BA1L = (pattern: string) => patternToIndex(pattern);

// Test data
assertEqual(
  "BA1L",
  BA1L("AGT"),
  11
);