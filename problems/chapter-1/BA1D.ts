import { patternReduce } from "../../utilities/pattern";
import { assertEqual } from "../../utilities/test";

// Reduce across each instance of pattern and add it's index to a list.
const BA1D = (text: string, pattern: string) =>
  patternReduce<number[]>(text, pattern, (indices, index) => [...indices, index], []);

// Test data
assertEqual(BA1D("GATATATGCATATACTT", "ATAT").sort().join(" "), "1 3 9");