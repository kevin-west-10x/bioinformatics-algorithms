import { pairSplice } from "../../utilities/pair";
import { parseInput } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

const BA3L = (texts: string[], distance: number): string => pairSplice(
  texts,
  Math.floor(texts[0].length / 2),
  distance
);

// Test data
assertEqual(
  "BA3L",
  BA3L(
    parseInput(`
      GACC|GCGC
      ACCG|CGCC
      CCGA|GCCG
      CGAG|CCGG
      GAGC|CGGA
    `),
    2
  ),
  "GACCGAGCGCCGGA",
);
