import { accumulate } from "./functional";
import { Graph } from "./graph";

export const formatGraph = (graph: Graph) =>
  Object.entries(
    graph.reduce<Record<string, string[]>>((map, node) => accumulate(map, node[0], vals => [...vals, node[1]], []), {})
  ).map(([key, vals]) => [key, vals.sort().join(",")].join(" -> ")).sort().join("\n");