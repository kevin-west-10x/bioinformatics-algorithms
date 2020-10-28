import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

// Reduce across each word and return in a sorted list
const BA3A = (text: string, size: number): string[] =>
  wordReduce<string[]>(text, size, (words, word) => [...words, word], []).sort();

// Test data
assertEqual(
  "BA3A",
  BA3A("CAATCCAAC", 5).join(" "),
  "AATCC ATCCA CAATC CCAAC TCCAA"
);
