import { patternReduce } from "../../utilities/pattern";
import { assertEqual } from "../../utilities/test";

// Reduce across each instance of pattern and increment count
const BA1A = (text: string, pattern: string) =>
  patternReduce(text, pattern, (count) => count + 1, 0);

// Test data
assertEqual(BA1A("GCGCG", "GCG"), 2);