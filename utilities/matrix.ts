import { computePath, ComputePathOptions, Path, PathResult, PathWithBacktrack, Predecessor, Reconstruct as PathReconstruct } from "./dag";
import { doWhile } from "./functional";

export type Matrix = number[][];

export interface Coordinate {
  x: number;
  y: number;
}

export interface MatrixPredecessor extends Omit<Predecessor, "index">, Coordinate {}

export const constructMatrixPredecessor = (
  { x, y }: Coordinate,
  getValue: (coordinate: Coordinate) => number,
  getWeight: (coordinate: Coordinate) => number
): MatrixPredecessor => ({
  weight: x < 0 || y < 0 ? 0 : getValue({x, y}) + getWeight({x, y}),
  x,
  y
});

export interface ComputeMatrixOptions extends Omit<ComputePathOptions, "getPredecessors" | "sink" | "source" | "transform"> {
  getPredecessors: (coordinate: Coordinate, getValue: (coordinate: Coordinate) => number) => MatrixPredecessor[];
  height: number;
  transform?: (matrix: MatrixWithBacktrack) => MatrixWithBacktrack;
  width: number;
}

export interface MatrixWithBacktrack {
  backtrack: Matrix;
  height: number;
  matrix: Matrix;
  sink: Coordinate;
  source: Coordinate;
  width: number;
}

export interface MatrixResult extends MatrixWithBacktrack{
  reconstruct: Reconstruct;
}

export const indexToCoordinate = (index: number, width: number): Coordinate => ({
  x: index % width,
  y: Math.floor(index / width)
});

export const coordinateToIndex = ({ x, y }: Coordinate, width: number): number => y * width + x;

export const pathToMatrix = (path: Path, width: number) => doWhile<Matrix>(
  arr => arr[arr.length - 1].length > width,
  arr => [...arr.slice(0, arr.length - 1), arr[arr.length - 1].slice(0, width), arr[arr.length - 1].slice(width)],
  [path]
);

export const matrixToPath = (matrix: Matrix): Path => matrix.reduce<Path>((path, row) => [...path, ...row], []);

export const pathObjToMatrixObj = (
  { backtrack, path, sink, source }: PathWithBacktrack,
  width: number,
  height: number
): MatrixWithBacktrack => ({
  backtrack: pathToMatrix(backtrack, width),
  height,
  matrix: pathToMatrix(path, width),
  sink: indexToCoordinate(sink, width),
  source: indexToCoordinate(source, width),
  width,
});

export const matrixObjToPathObj = (
  { backtrack, matrix, sink, source, width }: MatrixWithBacktrack
): PathWithBacktrack => ({
  backtrack: matrixToPath(backtrack),
  path: matrixToPath(matrix),
  sink: coordinateToIndex(sink, width),
  source: coordinateToIndex(source, width)
})

export const computeMatrix = ({
  getPredecessors,
  height,
  outOfBoundsValue = 0,
  transform = matrix => matrix,
  width,
  ...options
}: ComputeMatrixOptions): MatrixResult => (
  ({ reconstruct, ...pathObj}: PathResult) => (
    (matrix: MatrixWithBacktrack) => ({
      ...matrix,
      reconstruct: matrixReconstruct(matrix, reconstruct),
    })
  )(pathObjToMatrixObj(pathObj, width, height))
)(computePath({
  ...options,
  getPredecessors: (index, getValue) => getPredecessors(
    indexToCoordinate(index, width),
    ({x, y}) => y < 0 || x < 0 ? 0 : getValue(coordinateToIndex({ x, y }, width))
  ).filter(
    predecessor => predecessor.x >= 0 && predecessor.y >= 0
  ).map<Predecessor>(
    ({ weight, x, y }) => ({ index: coordinateToIndex({ x, y }, width), weight })
  ),
  outOfBoundsValue,
  sink: width * height - 1,
  source: 0,
  transform: path => matrixObjToPathObj(transform(pathObjToMatrixObj(path, width, height)))
}));

const DIRECTIONS = {
  LEFT: "left",
  MATCH: "match",
  SKIP: "skip",
  UP: "up"
} as const;
type Direction = typeof DIRECTIONS[keyof typeof DIRECTIONS];

const coordinateToDirection = (curr: Coordinate, next: Coordinate, allowSkip: boolean): Direction => {
  if (allowSkip && next.x === 0 && next.y === 0) return DIRECTIONS.SKIP;
  if (curr.x === next.x && curr.y === next.y + 1) return DIRECTIONS.UP;
  if (curr.x === next.x + 1 && curr.y === next.y) return DIRECTIONS.LEFT;
  if (curr.x === next.x + 1 && curr.y === next.y + 1) return DIRECTIONS.MATCH;
  return DIRECTIONS.SKIP;
}

type Reconstruct = <Result>(
  callback: (
    result: Result,
    curr: Coordinate,
    next: Coordinate,
    stringForDirection: StringForDirection,
    data: MatrixWithBacktrack
  ) => Result,
  initialResult: Result | ((data: MatrixWithBacktrack) => Result)
) => Result;

const matrixReconstruct = (matrix: MatrixWithBacktrack, reconstruct: PathReconstruct): Reconstruct =>
  (callback, initialResult) => reconstruct(
    (result, curr, next) => (
      (curr: Coordinate, next: Coordinate) => callback(
        result,
        curr,
        next,
        stringForDirection(curr, next),
        matrix
      )
    )(indexToCoordinate(curr, matrix.width), indexToCoordinate(next, matrix.width)),
    initialResult instanceof Function ? initialResult(matrix) : initialResult
  );

type DirectionStrings = Partial<Record<Direction, string>>;

type StringForDirection = (directionStrings: DirectionStrings, allowSkip?: boolean) => string;

const stringForDirection = (curr: Coordinate, next: Coordinate) =>
  (directionStrings: DirectionStrings, allowSkip: boolean = true) =>
    directionStrings[coordinateToDirection(curr, next, allowSkip)] || "";
