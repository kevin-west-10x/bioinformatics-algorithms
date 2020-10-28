import { assertEqual } from "../../utilities/test";

// Reduce across each string and append the last letter if it overlaps
const BA3B = (patterns: string[]): string =>
  patterns.reduce((text, pattern) => text + pattern[pattern.length - 1])

// Test data
assertEqual(
  "BA3B",
  BA3B(
    [
      "ACCGA",
      "CCGAA",
      "CGAAG",
      "GAAGC",
      "AAGCT"
    ]
  ),
  "ACCGAAGCT"
);
