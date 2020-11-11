import { constructNonBranchingPaths, Path } from "../../utilities/cycle";
import { formatPath } from "../../utilities/format";
import { Graph } from "../../utilities/graph";
import { parseGraph, parsePaths } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

const BA3M = (graph: Graph): Path[] => constructNonBranchingPaths(graph)

// Test data
assertEqual(
  "BA3M",
  BA3M(parseGraph(`
    1 -> 2
    2 -> 3
    3 -> 4,5
    6 -> 7
    7 -> 6
  `)).map(formatPath).join(", "),
  parsePaths(`
    1 -> 2 -> 3
    3 -> 4
    3 -> 5
    6 -> 7 -> 6
  `).map(formatPath).join(", ")
);
