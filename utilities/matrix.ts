import { doWhile, repeat } from "./functional";
import { Amino, aminoIndex } from "./genetics";
import memoize from "./memoize";
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
  ({ index, path }) => index > path.source,
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
  ).filter(
    predecessor => predecessor.x >= 0 && predecessor.y >= 0
  ).map<Predecessor>(
    ({ weight, x, y }) => ({ index: y * width + x, weight })
  ),
  0
)

export const isUp = (curr: number, next: number, width: number): boolean => next === curr - width;
export const isLeft = (curr: number, next: number): boolean => next === curr - 1;
export const isMatch = (curr: number, next: number, width: number): boolean => next === curr - width - 1;

const maxWidth = memoize(
  (path: Array<number | string>): number =>
    path.reduce<number>((max, val) => Math.max(max, val.toString().length + 1), 0)
);

export const logPath = (path: PathWithBacktrack, width: number) => {
  const displayPath = (path: Array<number | string>) =>
    doWhile(
      arr => arr.length > 0,
      arr => {
        console.log(arr.slice(0, width).map(item => item.toString().padStart(maxWidth(path), " ")).join(" "));
        return arr.slice(width);
      },
      path
    );

  console.log("Path:");
  displayPath(path.path);
  console.log("Backtrack:");
  displayPath(path.backtrack.map((val, i) => isUp(i, val, width) ? `↑(${val})` : isLeft(i, val) ? `←(${val})` : `↖(${val})`));
  console.log("Source: ", path.source);
  console.log("Sink: ", path.sink);
}

const BLOSUM62_MATRIX: Matrix = `
 4  0 -2 -1 -2  0 -2 -1 -1 -1 -1 -2 -1 -1 -1  1  0  0 -3 -2
 0  9 -3 -4 -2 -3 -3 -1 -3 -1 -1 -3 -3 -3 -3 -1 -1 -1 -2 -2
-2 -3  6  2 -3 -1 -1 -3 -1 -4 -3  1 -1  0 -2  0 -1 -3 -4 -3
-1 -4  2  5 -3 -2  0 -3  1 -3 -2  0 -1  2  0  0 -1 -2 -3 -2
-2 -2 -3 -3  6 -3 -1  0 -3  0  0 -3 -4 -3 -3 -2 -2 -1  1  3
 0 -3 -1 -2 -3  6 -2 -4 -2 -4 -3  0 -2 -2 -2  0 -2 -3 -2 -3
-2 -3 -1  0 -1 -2  8 -3 -1 -3 -2  1 -2  0  0 -1 -2 -3 -2  2
-1 -1 -3 -3  0 -4 -3  4 -3  2  1 -3 -3 -3 -3 -2 -1  3 -3 -1
-1 -3 -1  1 -3 -2 -1 -3  5 -2 -1  0 -1  1  2  0 -1 -2 -3 -2
-1 -1 -4 -3  0 -4 -3  2 -2  4  2 -3 -3 -2 -2 -2 -1  1 -2 -1
-1 -1 -3 -2  0 -3 -2  1 -1  2  5 -2 -2  0 -1 -1 -1  1 -1 -1
-2 -3  1  0 -3  0  1 -3  0 -3 -2  6 -2  0  0  1  0 -3 -4 -2
-1 -3 -1 -1 -4 -2 -2 -3 -1 -3 -2 -2  7 -1 -2 -1 -1 -2 -4 -3
-1 -3  0  2 -3 -2  0 -3  1 -2  0  0 -1  5  1  0 -1 -2 -2 -1
-1 -3 -2  0 -3 -2  0 -3  2 -2 -1  0 -2  1  5 -1 -1 -3 -3 -2
 1 -1  0  0 -2  0 -1 -2  0 -2 -1  1 -1  0 -1  4  1 -2 -3 -2
 0 -1 -1 -1 -2 -2 -2 -1 -1 -1 -1  0 -1 -1 -1  1  5  0 -2 -2
 0 -1 -3 -2 -1 -3 -3  3 -2  1  1 -3 -2 -2 -3 -2  0  4 -3 -1
-3 -2 -4 -3  1 -2 -2 -3 -3 -2 -1 -4 -4 -2 -3 -3 -2 -3 11  2
-2 -2 -3 -2  3 -3  2 -1 -2 -1 -1 -2 -3 -1 -2 -2 -2 -1  2  7
`.trim().split("\n").map(row => row.trim().split(/\s+/).map(num => parseInt(num)));

export const scoreAminos = (scoringMatrix: Matrix = BLOSUM62_MATRIX) =>
  (amino1: Amino, amino2: Amino): number =>
    scoringMatrix[aminoIndex(amino1)][aminoIndex(amino2)];