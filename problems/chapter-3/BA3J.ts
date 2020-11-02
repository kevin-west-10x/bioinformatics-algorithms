import { constructPath } from "../../utilities/cycle";
import { constructPairGraph } from "../../utilities/graph";
import { pairReduce } from "../../utilities/pair";
import { parseInput } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

const BA3J = (distance: number, texts: string[]): string => pairReduce(
  constructPath(constructPairGraph(texts)),
  distance,
  (text, value) => text + value[value.length - 1]
)

// Test data
assertEqual(
  "BA3J",
  BA3J(2, parseInput(`
    GAGA|TTGA
    TCGT|GATG
    CGTG|ATGT
    TGGT|TGAG
    GTGA|TGTT
    GTGG|GTGA
    TGAG|GTTG
    GGTC|GAGA
    GTCG|AGAT
  `)),
  "GTGGTCGTGAGATGTTGA",
);
