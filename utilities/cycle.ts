import { accumulate, doWhile } from "./functional";
import { Edge, Graph, reverseGraph } from "./graph";

export type Cycle = string[];
export type Path = Cycle;

interface CycleReducer {
  cycle: Cycle;
  graph: Graph;
  remaining: Set<string>;
}

export const pivot = (cycle: Cycle, on: string): Cycle => (
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

export const isEdge = ([val1, val2]: Edge): boolean => !!val1 && !!val2;

export const graphWithEdge = (graph: Graph, edge: Edge): Graph =>
  Object.assign(
    graph,
    isEdge(edge) && { 
      [edge[0]]: [...(graph[edge[0]] || []), edge[1]]
    }
  )

export const findUnbalancedEdge = (cycle: Cycle, edge: Edge): number =>
  cycle.findIndex((value, index) => value === edge[1] && cycle[index - 1] === edge[0]);

export const getPathFromCycle = (cycle: Cycle, unbalancedEdge: Edge): Path => (
  (index: number) => [...cycle.slice(index, -1), ...cycle.slice(0, index)]
)(findUnbalancedEdge(cycle, unbalancedEdge));

export const constructCycle = (graph: Graph): Cycle => (
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

export const constructPath = (graph: Graph): Path => (
  (edge: Edge) => (
    (cycle: Cycle) => isEdge(edge) ? getPathFromCycle(cycle, edge) : cycle
  )(constructCycle(graphWithEdge(graph, edge)))
)(getUnbalancedEdge(graph));

interface PathReducer {
  graphs: Graph[];
  index: number;
  originalGraph: Graph;
  startNodes: string[];
}

export const constructNonBranchingPaths = (graph: Graph): Path[] => (
  reverse => doWhile<PathReducer>(
    ({ startNodes }) => startNodes.length > 0,
    ({ graphs, index, originalGraph, startNodes: [start, ...startNodes] }) => (
      (end: string) => (
        (outgoing: string[], incoming: string[]) => ({
          // Reduce the current edge into the graphs array at the
          // current index.
          graphs: !end
            ? graphs
            : [
              ...graphs.slice(0, index),
              Object.assign(
                {},
                graphs[index],
                {
                  [start]: [end]
                }
              )
            ],
          // Increment index unless this is the continuation of a simple
          // path (#in === #out === 1) or the node doesn't exist in which case
          // we don't add anything to the graph.
          index: !end || (outgoing.length === 1 && incoming.length === 1)
            ? index
            : index + 1,
          // If the node doesn't exist, the graph doesn't change.
          // Otherwise, remove the current node from the graph as it's
          // added to the graphs array.
          originalGraph: !end
            ? originalGraph
            : {
              ...originalGraph,
              [start]: originalGraph[start].slice(1)
            },
          // If the node doesn't exist or there are no outgoing nodes,
          // just move to the next start node. If this is the continuation
          // of a simple path (#in === #out === 1) just add the current end
          // node to be process next. Otherwise this is a branching node
          // and we must add all outgoing nodes to be processed at a later
          // time.
          startNodes: !end || outgoing.length === 0 
            ? startNodes
            : outgoing.length === 1 && incoming.length === 1
              ? [end, ...startNodes]
              : [...(new Array(outgoing.length).fill(end)), ...startNodes]
        })
      )(originalGraph[end] || [], reverse[end] || [])
    )(originalGraph[start][0]),
    {
      graphs: [],
      index: 0,
      originalGraph: graph,
      startNodes: Object.keys(graph)
    }
  ).graphs.map(
    graph => constructPath(graph)
  )
)(reverseGraph(graph));