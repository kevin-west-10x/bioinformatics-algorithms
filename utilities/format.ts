import { accumulate } from "./functional";
import { Graph } from "./graph";

export const formatGraph = (graph: Graph): string =>
  Object.entries(graph)
    .map(([key, vals]) => [key, vals.sort().join(",")].join(" -> "))
    .sort()
    .join("\n");

export const formatCycle = (cycle: string[]) => cycle.join("->");