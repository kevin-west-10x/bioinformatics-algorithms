import { countMax, frequencyCounter } from "../../utilities/frequency";
import { assertEqual } from "../../utilities/test";

// Generate a frequency table, and use countMax to filter only the results
// equal to the max frequency in the table.
const BA1B = (text: string, size: number) => countMax(frequencyCounter(text, size));

// Test data
assertEqual("BA1B", Object.keys(BA1B("ACGTTGCATGTCGCATGATGCATGAGAGCT", 4)).sort().join(" "), "CATG GCAT");