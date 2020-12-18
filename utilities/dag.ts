import { doWhile, repeat } from "./functional";
import { pickMax } from "./pick";

export interface Predecessor {
  index: number;
  weight: number;
}

export type Path = number[];

export interface PathWithBacktrack {
  backtrack: Path;
  path: Path;
  sink: number;
  source: number;
}

export interface ComputePathOptions {
  compareFn?: (score: (item: Predecessor) => number, ...items: Predecessor[]) => Predecessor;
  getPredecessors: (index: number, getValue: (index: number) => number) => Predecessor[];
  outOfBoundsValue?: number;
  sink: number;
  source: number;
  transform?: (path: PathWithBacktrack) => PathWithBacktrack;
}

export interface PathResult extends PathWithBacktrack {
  reconstruct: Reconstruct;
}

export const computePath = ({
  compareFn = pickMax,
  getPredecessors,
  outOfBoundsValue = -Infinity,
  sink,
  source,
  transform = path => path
}: ComputePathOptions): PathResult => (
  (pathWithBacktrack: PathWithBacktrack) => ({
    ...pathWithBacktrack,
    reconstruct: reconstruct(pathWithBacktrack),
  })
)(transform(
  repeat<PathWithBacktrack>(
    sink + 1,
    ({ backtrack, path, source, sink }, index) => {
      if (index === source) {
        path[index] = 0;
        backtrack[index] = -1;
      } else {
        const predecessors = getPredecessors(index, index => path[index] ?? outOfBoundsValue);
        if (predecessors.length === 0) {
          path[index] = outOfBoundsValue;
          backtrack[index] = -1;
        } else {
          const maxWeight = compareFn(predecessor => predecessor.weight, ...predecessors).weight;
          const predecessor = predecessors.find(predecessor => predecessor.weight === maxWeight) || predecessors[0];
          path[index] = predecessor.weight;
          backtrack[index] = Math.max(predecessor.index, 0);
        }
      }
      return { backtrack, path, source, sink }
    },
    {
      backtrack: [],
      path: [],
      source,
      sink
    }
  )
));

export type Reconstruct = <Result>(
  callback: (result: Result, curr: number, next: number, data: PathWithBacktrack) => Result,
  initialResult: Result | ((data: PathWithBacktrack) => Result)
) => Result;

const reconstruct = (path: PathWithBacktrack): Reconstruct =>
  (callback, initialResult) =>
    doWhile(
      ({ index }) => index > path.source,
      ({ index, result }) => ({
        index: path.backtrack[index],
        result: callback(result, index, path.backtrack[index], path)
      }),
      {
        index: path.sink,
        result: initialResult instanceof Function ? initialResult(path) : initialResult
      }
    ).result;
