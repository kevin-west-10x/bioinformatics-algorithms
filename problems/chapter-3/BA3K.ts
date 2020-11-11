import { constructNonBranchingPaths } from "../../utilities/cycle";
import { constructGraph } from "../../utilities/graph";
import { parseInput } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

const BA3K = (texts: string[]): string[] => constructNonBranchingPaths(
  constructGraph(texts)
).map(path => path.reduce(
  (path, pattern) => path + pattern[pattern.length - 1]
)).sort()

// Test data
assertEqual(
  "BA3K",
  BA3K(parseInput(`
    ATG
    ATG
    TGT
    TGG
    CAT
    GGA
    GAT
    AGA
  `)).join(" "),
  "AGA ATG ATG CAT GAT TGGA TGT",
);
