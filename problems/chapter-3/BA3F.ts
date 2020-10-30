import { constructCycle, pivot } from "../../utilities/cycle";
import { formatCycle } from "../../utilities/format";
import { Graph } from "../../utilities/graph";
import { parseGraph } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

const BA3F = (graph: Graph): string[] => constructCycle(graph);

// Test data
assertEqual(
  "BA3F",
  formatCycle(
    BA3F(parseGraph(`
    0 -> 3
    1 -> 0
    2 -> 1,6
    3 -> 2
    4 -> 2
    5 -> 4
    6 -> 5,8
    7 -> 9
    8 -> 7
    9 -> 6
    `))
  ),
  "6->8->7->9->6->5->4->2->1->0->3->2->6",
  "6->5->4->2->1->0->3->2->6->8->7->9->6"
);
