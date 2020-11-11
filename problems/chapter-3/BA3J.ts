import { constructPath } from "../../utilities/cycle";
import { constructPairGraph } from "../../utilities/graph";
import { pairSplice } from "../../utilities/pair";
import { parseInput } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

const BA3J = (texts: string[], distance: number): string => pairSplice(
  constructPath(constructPairGraph(texts)),
  Math.floor(texts[0].length / 2),
  distance
);

// Test data
assertEqual(
  "BA3J",
  BA3J(
    parseInput(`
      GAGA|TTGA
      TCGT|GATG
      CGTG|ATGT
      TGGT|TGAG
      GTGA|TGTT
      GTGG|GTGA
      TGAG|GTTG
      GGTC|GAGA
      GTCG|AGAT
    `),
    2
  ),
  "GTGGTCGTGAGATGTTGA",
);
