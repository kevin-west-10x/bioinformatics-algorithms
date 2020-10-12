import hammingDistance from "../../utilities/hammingDistance";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

const BA1H = (text: string, pattern: string, distance: number) =>
  wordReduce<number[]>(
    text,
    pattern.length,
    (indices, word, index) => hammingDistance(word, pattern) <= distance ? [...indices, index] : indices,
    []
  );

// Test data
assertEqual(
  BA1H(
    "CGCCCGAATCCAGAACGCATTCCCATATTTCGGGACCACTGGCCTCCACGGTACGGACGTCAATCAAATGCCTAGCGGCTTGTGGTTTCTCCTACGCTCC",
    "ATTCTGGA",
    3
  ).sort((a, b) => a - b).join(" "),
  "6 7 26 27 78"
);