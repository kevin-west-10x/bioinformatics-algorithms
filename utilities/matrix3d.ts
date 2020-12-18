import {
  computePath,
  Path,
  PathResult,
  PathWithBacktrack,
  Predecessor,
  Reconstruct as PathReconstruct
} from "./dag";
import { zip } from "./functional";
import {
  ComputeMatrixOptions,
  constructMatrixPredecessor,
  Coordinate,
  coordinateToIndex,
  indexToCoordinate,
  Matrix,
  matrixObjToPathObj,
  MatrixPredecessor,
  matrixToPath,
  pathObjToMatrixObj,
  pathToMatrix
} from "./matrix";

export const LEVELS = {
  LOWER: 0,
  UPPER: 1,
  MIDDLE: 2 
} as const;
const LEVELS_LENGTH = Object.keys(LEVELS).length;
export type Level = typeof LEVELS[keyof typeof LEVELS];

type Matrix3D = Record<Level, Matrix>;

interface Coordinate3D extends Coordinate {
  z: Level
}

export interface Matrix3DPredecessor extends MatrixPredecessor, Coordinate3D {}

export const constructMatrix3DPredecessor = <T>(
  { z, ...coordinate }: Coordinate3D,
  getValue: (coordinate: Coordinate3D) => number,
  getWeight: (coordinate: Coordinate3D) => number
): Matrix3DPredecessor => ({
  ...constructMatrixPredecessor(
    coordinate,
    coordinate => getValue({ ...coordinate, z }),
    coordinate => getWeight({ ...coordinate, z })
  ),
  z
});

export interface ComputeMatrix3DOptions extends Omit<ComputeMatrixOptions, "getPredecessors" | "transform"> {
  getPredecessors: (
    coordinate: Coordinate3D,
    getValue: (coordinate: Coordinate3D) => number
  ) => Matrix3DPredecessor[];
  transform?: (matrix: Matrix3DWithBacktrack) => Matrix3DWithBacktrack;
}

export interface Matrix3DWithBacktrack {
  backtrack: Matrix3D;
  height: number;
  matrix: Matrix3D;
  sink: Coordinate3D;
  source: Coordinate3D;
  width: number;
}

export interface Matrix3DResult extends Matrix3DWithBacktrack{
  reconstruct: Reconstruct;
}

export const indexToCoordinate3D = (index: number, width: number): Coordinate3D => ({
  ...indexToCoordinate(Math.floor(index / LEVELS_LENGTH), width),
  z: index % LEVELS_LENGTH as Level
});

export const coordinate3DToIndex = ({ z, ...coordinate }: Coordinate3D, width: number) =>
  (LEVELS_LENGTH * coordinateToIndex(coordinate, width)) + z;

export const pathToMatrix3D = (path: Path, width: number) => ({
  0: pathToMatrix(path.filter((_, i) => i % LEVELS_LENGTH === 0), width),
  1: pathToMatrix(path.filter((_, i) => i % LEVELS_LENGTH === 1), width),
  2: pathToMatrix(path.filter((_, i) => i % LEVELS_LENGTH === 2), width)
});

export const matrix3DToPath = (matrix: Matrix3D): Path => zip(
  matrixToPath(matrix[0]),
  matrixToPath(matrix[1]),
  matrixToPath(matrix[2])
);

export const pathObjToMatrix3DObj = (
  { backtrack, path, sink, source }: PathWithBacktrack,
  width: number,
  height: number
): Matrix3DWithBacktrack => ({
  backtrack: pathToMatrix3D(backtrack, width),
  height,
  matrix: pathToMatrix3D(path, width),
  sink: indexToCoordinate3D(sink, width),
  source: indexToCoordinate3D(source, width),
  width,
});

export const matrix3DObjToPathObj = (
  { backtrack, matrix, sink, source, width }: Matrix3DWithBacktrack
): PathWithBacktrack => ({
  backtrack: matrix3DToPath(backtrack),
  path: matrix3DToPath(matrix),
  sink: coordinate3DToIndex(sink, width),
  source: coordinate3DToIndex(source, width)
})

export const computeMatrix3D = ({
  getPredecessors,
  height,
  outOfBoundsValue = 0,
  transform = matrix3D => matrix3D,
  width,
  ...options
}: ComputeMatrix3DOptions): Matrix3DResult => (
  ({ reconstruct, ...pathObj}: PathResult) => (
    (matrix: Matrix3DWithBacktrack) => ({
      ...matrix,
      reconstruct: matrixReconstruct(matrix, reconstruct),
    })
  )(pathObjToMatrix3DObj(pathObj, width, height))
)(computePath({
  ...options,
  getPredecessors: (index, getValue) => getPredecessors(
    indexToCoordinate3D(index, width),
    ({x, y, z}) => y < 0 || x < 0 ? 0 : getValue(coordinate3DToIndex({ x, y, z }, width))
  ).filter(
    predecessor => predecessor.x >= 0 && predecessor.y >= 0
  ).map<Predecessor>(
    ({ weight, x, y, z }) => ({ index: coordinate3DToIndex({ x, y, z }, width), weight })
  ),
  outOfBoundsValue,
  sink: LEVELS_LENGTH * width * height - 1,
  source: 2,
  transform: path => matrix3DObjToPathObj(transform(pathObjToMatrix3DObj(path, width, height)))
}));

const DIRECTIONS = {
  LEFT: "left",
  MATCH: "match",
  SKIP: "skip",
  UP: "up",
} as const;
type Direction = typeof DIRECTIONS[keyof typeof DIRECTIONS];

type DirectionStrings = Partial<Record<Direction, string>>;

type StringForDirection = (directionStrings: DirectionStrings, allowSkip?: boolean) => string;

type Reconstruct = <Result>(
  callback: (
    result: Result,
    curr: Coordinate3D,
    next: Coordinate3D,
    stringForDirection: StringForDirection,
    data: Matrix3DWithBacktrack
  ) => Result,
  initialResult: Result | ((data: Matrix3DWithBacktrack) => Result)
) => Result;

const coordinate3DToDirection = (curr: Coordinate3D, next: Coordinate3D, allowSkip: boolean): Direction => {
  if (allowSkip && next.x === 0 && next.y === 0 && next.z === 0) return DIRECTIONS.SKIP;
  if (curr.x === next.x && curr.y === next.y + 1) return DIRECTIONS.UP;
  if (curr.x === next.x + 1 && curr.y === next.y) return DIRECTIONS.LEFT;
  if (curr.x === next.x + 1 && curr.y === next.y + 1 && curr.z === next.z) return DIRECTIONS.MATCH;
  return DIRECTIONS.SKIP;
}

const matrixReconstruct = (matrix: Matrix3DWithBacktrack, reconstruct: PathReconstruct): Reconstruct =>
  (callback, initialResult) => reconstruct(
    (result, curr, next) => (
      (curr: Coordinate3D, next: Coordinate3D) => callback(
        result,
        curr,
        next,
        stringForDirection(curr, next),
        matrix
      )
    )(indexToCoordinate3D(curr, matrix.width), indexToCoordinate3D(next, matrix.width)),
    initialResult instanceof Function ? initialResult(matrix) : initialResult
  );

const stringForDirection = (curr: Coordinate3D, next: Coordinate3D) =>
  (directionStrings: DirectionStrings, allowSkip: boolean = true) =>
    directionStrings[coordinate3DToDirection(curr, next, allowSkip)] || "";