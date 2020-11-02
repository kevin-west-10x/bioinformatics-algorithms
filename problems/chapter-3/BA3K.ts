import { constructPath } from "../../utilities/cycle";
import { doWhile } from "../../utilities/functional";
import { constructGraph, Graph, reverseGraph } from "../../utilities/graph";
import { parseInput } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

interface PathReducer {
  graphs: Graph[];
  index: number;
  originalGraph: Graph;
  startNodes: string[];
}

const BA3K = (texts: string[]): string[] => (
  graph => (
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
        startNodes: Object.keys(graph).filter(node => !Object.keys(reverse).includes(node))
      }
    ).graphs.map(
      graph => constructPath(graph).reduce(
        (path, pattern) => path + pattern[pattern.length - 1]
      )
    ).sort()
  )(reverseGraph(graph))
)(constructGraph(texts));

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
