import { constructPath } from "../../utilities/cycle";
import { formatCycle } from "../../utilities/format";
import { Graph } from "../../utilities/graph";
import { parseGraph } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

const BA3G = (graph: Graph): string[] => constructPath(graph);

// Test data
assertEqual(
  "BA3G",
  formatCycle(
    BA3G(parseGraph(`
    0 -> 2
    1 -> 3
    2 -> 1
    3 -> 0,4
    6 -> 3,7
    7 -> 8
    8 -> 9
    9 -> 6
    `))
  ),
  "6->7->8->9->6->3->0->2->1->3->4",
);
