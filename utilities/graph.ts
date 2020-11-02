import { accumulate } from "./functional";
import memoize from "./memoize";
import { pairPrefix, pairSuffix } from "./pair";
import { prefix, suffix } from "./pattern";

export type Edge = [string, string];

export type Graph = Record<string, string[]>;

export type GraphReducer<Result> = (currentResult: Result, edge: Edge) => Result;

export const graphReduce = <Result>(
  graph: Graph,
  reducer: GraphReducer<Result>,
  initialResult: Result
): Result =>
  Object.entries(graph).reduce<Result>(
    (result, [start, endings]) => endings.reduce<Result>(
      (result, ending) => reducer(result, [start, ending]),
      result
    ),
    initialResult
  );

export const reverseGraph = (graph: Graph): Graph => graphReduce<Graph>(
  graph,
  (reverse, [start, ending]) => accumulate(reverse, ending, endings => [...endings, start], []),
  {}
);

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

export const constructPairGraph = (edges: string[]): Graph =>
  edges.reduce<Graph>((graph, edge) => accumulate(graph, pairPrefix(edge), nodes => [...nodes, pairSuffix(edge)], []), {});
