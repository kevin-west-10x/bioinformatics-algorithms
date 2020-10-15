import neighbors from "../../utilities/neighbors";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

// Reduce across each instance of pattern and increment count
const BA2A = (texts: string[], size: number, distance: number): string[] =>
  Object.keys(
    texts.reduce<Record<string, string>>(
      (patterns, text) => {
        // Find all k-mers of `size` in this text with `distance` mismatches
        const allPatterns = wordReduce<string[]>(
          text,
          size,
          (words, word) => [...words, ...neighbors(word, distance)],
          []
        );
        // Seed the patterns object on first go-through
        if (Object.keys(patterns).length === 0) {
          return allPatterns.reduce<Record<string, string>>((patterns, pattern) => ({
            ...patterns,
            [pattern]: pattern,
          }), {});
        }
        // Return intersection of patterns with all found patterns in current text
        return allPatterns.reduce<Record<string, string>>((matchingPatterns, pattern) => {
          if (patterns[pattern]) {
            return {
              ...matchingPatterns,
              [pattern]: pattern,
            };
          }
          return matchingPatterns;
        }, {});
      },
      {}
    )
  );

// Test data
assertEqual(
  "BA2A",
  BA2A(
    ["ATTTGGC", "TGCCTTA", "CGGTATC", "GAAAATT"],
    3,
    1
  ).sort().join(" "),
  "ATA ATT GTT TTT"
);
