import { constructPath } from "../../utilities/cycle";
import { constructGraph } from "../../utilities/graph";
import { parseInput } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

const BA3H = (texts: string[]): string => constructPath(constructGraph(texts)).reduce(
  (text, pattern) => text + pattern[pattern.length - 1]
);

// Test data
assertEqual(
  "BA3H",
  BA3H(parseInput(`
    CTTA
    ACCA
    TACC
    GGCT
    GCTT
    TTAC
  `)),
  "GGCTTACCA",
);
