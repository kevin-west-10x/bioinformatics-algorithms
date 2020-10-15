import { indexToPattern } from "../../utilities/lexographic";
import neighbors from "../../utilities/neighbors";
import { assertEqual } from "../../utilities/test";

// Return all neighbors of `pattern` within hamming distance `distance`
const BA1N = (pattern: string, distance: number) => neighbors(pattern, distance);

// Test data
assertEqual(
  "BA1N",
  BA1N("ACG", 1).sort().join(" "),
  "AAG ACA ACC ACG ACT AGG ATG CCG GCG TCG"
);