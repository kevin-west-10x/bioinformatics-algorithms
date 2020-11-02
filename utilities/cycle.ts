import { accumulate, doWhile } from "./functional";
import { Edge, Graph } from "./graph";

interface CycleReducer {
  cycle: string[];
  graph: Graph;
  remaining: Set<string>;
}

export const pivot = (cycle: string[], on: string): string[] => (
  (index: number) => [...cycle.slice(index, -1), ...cycle.slice(0, index), on]
)(cycle.indexOf(on));

export const getNodeCount = (graph: Graph): Record<string, number> =>
  Object.entries(graph).reduce<Record<string, number>>(
    (balances, [start, endings]) => accumulate(
      accumulate(
        balances,
        start,
        num => num + endings.length,
        0
      ),
      endings,
      num => num - 1,
      0
    ),
    {}
  );

export const getUnbalancedEdge = (graph: Graph): Edge =>
  Object.entries(getNodeCount(graph)).reduce<Edge>(
    (edge, [node, count]) =>
      count === -1
        ? [node, edge[1]]
        : count === 1
          ? [edge[0], node]
          : edge,
    ["", ""]
  );

export const findUnbalancedEdge = (cycle: string[], edge: Edge): number =>
  cycle.findIndex((value, index) => value === edge[1] && cycle[index - 1] === edge[0]);

export const getPathFromCycle = (cycle: string[], unbalancedEdge: Edge): string[] => (
  (index: number) => [...cycle.slice(index, -1), ...cycle.slice(0, index)]
)(findUnbalancedEdge(cycle, unbalancedEdge));

export const constructCycle = (graph: Graph): string[] => (
  (firstKey: string) =>
    doWhile<CycleReducer>(
      // While there are still nodes in the cycle with unused edges
      ({ remaining }) => remaining.size > 0,
      // Construct a new cycle by pivoting on one of the remaining nodes
      ({ cycle, graph, remaining }) => doWhile<CycleReducer>(
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
        remaining: new Set([firstKey])
      }
    ).cycle
  )(Object.keys(graph)[0]);

  export const constructPath = (graph: Graph): string[] => (
    (edge: Edge) => getPathFromCycle(
      constructCycle(
        Object.assign(
          graph,
          { 
            [edge[0]]: [...(graph[edge[0]] || []), edge[1]]
          }
        )
      ),
      edge
    )
  )(getUnbalancedEdge(graph));
