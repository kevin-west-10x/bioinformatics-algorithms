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
  source: number;
  sink: number;
}
export const computePath = (
  source: number,
  sink: number,
  getPredecessors: (index: number, getValue: (index: number) => number) => Predecessor[],
  outOfBoundsValue: number = -Infinity
): PathWithBacktrack => repeat<PathWithBacktrack>(
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
        const maxWeight = pickMax(predecessor => predecessor.weight, ...predecessors).weight;
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
);

interface BacktrackReducer<T> {
  index: number;
  path: PathWithBacktrack;
  result: T;
}

export const backtrack = <T>(
  path: PathWithBacktrack,
  callback: (result: T, curr: number, next: number) => T,
  initialResult: T
): T => doWhile<BacktrackReducer<T>>(
  ({ index, path, result }) => index > path.source,
  ({ index, path, result }) => ({
    index: path.backtrack[index],
    path,
    result: callback(result, index, path.backtrack[index])
  }),
  {
    index: path.sink,
    path,
    result: initialResult
  }
).result;

export type Matrix = number[][];

export interface MatrixPredecessor extends Omit<Predecessor, "index"> {
  x: number;
  y: number;
}

export const computePathFromMatrix = (
  width: number,
  height: number,
  getPredecessors: (
    x: number,
    y: number,
    getValue: (x: number, y: number) => number
  ) => MatrixPredecessor[]
): PathWithBacktrack => computePath(
  0,
  width * height - 1,
  (index, getValue) => getPredecessors(
    index % width,
    Math.floor(index / width),
    (x, y) => y < 0 || x < 0 ? 0 : getValue(y * width + x)
  ).reduce<Predecessor[]>(
    (predecessors, { weight, x, y }) => [...predecessors, { index: y * width + x, weight }],
    []
  ),
  0
)