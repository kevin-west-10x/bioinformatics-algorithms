import { accumulate } from "./functional";
import memoize from "./memoize";
import { prefix, suffix } from "./pattern";

export type Edge = [string, string];

export type Graph = Record<string, string[]>;

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

export const constructOverlapGraph = (patterns: string[]): Graph =>
  patterns.reduce<Graph>(
    (graph, pattern) => ({
      ...graph,
      ...(prefixMap(patterns)[suffix(pattern)] && { [pattern]: prefixMap(patterns)[suffix(pattern)] })
    }),
    {}
  );

export const constructGraph = (edges: string[]): Graph =>
  edges.reduce<Graph>((graph, edge) => accumulate(graph, prefix(edge), nodes => [...nodes, suffix(edge)], []), {});
