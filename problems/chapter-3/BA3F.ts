import { pivot } from "../../utilities/cycle";
import { formatCycle } from "../../utilities/format";
import { doWhile } from "../../utilities/functional";
import { Graph } from "../../utilities/graph";
import { parseGraph } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

interface GraphReducer {
  cycle: string[];
  graph: Graph;
  remaining: Set<string>;
}

const BA3F = (graph: Graph): string[] => (
  (firstKey: string) =>
    doWhile<GraphReducer>(
      // While there are still nodes in the cycle with unused edges
      ({ remaining }) => remaining.size > 0,
      // Construct a new cycle by pivoting on one of the remaining nodes
      ({ cycle, graph, remaining }) => doWhile<GraphReducer>(
        // While there are still edges to move along
        ({ cycle, graph }) => graph[cycle[cycle.length - 1]].length > 0,
        // Add one of the next edges to the cycle
        ({ cycle, graph, remaining }) => {
          const curr = cycle[cycle.length - 1];
          const options = graph[curr];
          // Better to modify graph in place due to large size
          graph[curr] = options.slice(1);
          // Better to modify remaining in place due to large size (and bad api)
          graph[curr].length > 0 ? remaining.add(curr) : remaining.delete(curr);
          return {
            cycle: [...cycle, options[0]],
            graph,
            remaining 
          };
        },
        {
          cycle: pivot(cycle, remaining.keys().next().value),
          graph,
          remaining
        }
      ),
      {
        cycle: [],
        graph,
        remaining: new Set(firstKey)
      }
    ).cycle
  )(Object.keys(graph)[0]);

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
