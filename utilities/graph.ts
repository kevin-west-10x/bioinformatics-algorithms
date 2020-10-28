import { accumulate } from "./functional";
import memoize from "./memoize";
import { prefix, suffix } from "./pattern";

type AdjacencyNode = [string, string];

export type Graph = AdjacencyNode[];

const prefixMap = memoize((patterns: string[]): Record<string, string[]> =>
  patterns.reduce<Record<string, string[]>>(
    (map, pattern) => accumulate(
      map,
      prefix(pattern),
      patterns => [...patterns, pattern],
      []
    ),
    {}
  )
);

export const constructGraph = (patterns: string[]): Graph =>
  patterns.reduce<AdjacencyNode[]>(
    (adjacencyList, pattern) => [
      ...adjacencyList,
      ...(prefixMap(patterns)[suffix(pattern)] || []).map<AdjacencyNode>(adjacent => [pattern, adjacent])
    ],
    []
  );