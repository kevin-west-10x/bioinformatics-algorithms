import { doWhile } from "../../utilities/functional";
import { Amino, AminoPeptide, newAminoPeptide } from "../../utilities/genetics";
import { backtrack, computePathFromMatrix, isLeft, isUp, logPath, Matrix, MatrixPredecessor, Path, PathWithBacktrack, scoreAminos } from "../../utilities/matrix";
import { assertEqual } from "../../utilities/test";

const constructMatrixPredecessor = (
  x: number,
  y: number,
  str1: AminoPeptide,
  str2: AminoPeptide,
  getValue: (y: number, x: number) => number,
  weight: (a1: Amino, a2: Amino) => number
): MatrixPredecessor => ({
  weight: x < 0 || y < 0 ? 0 : getValue(x, y) + weight(str1[x], str2[y]),
  x,
  y
});

interface Result {
  alignedStr1: string;
  alignedStr2: string;
  score: number;
}

const formatResult = (result: Result): string =>`${result.score}
${result.alignedStr1}
${result.alignedStr2}`;

interface Reconstruction {
  left: string;
  match: string;
  up: string;
}

const reconstruct = (reconstruction: Reconstruction) =>
  (curr: number, next: number, width: number): string => {
    if (isUp(curr, next, width)) return reconstruction.up;
    if (isLeft(curr, next)) return reconstruction.left;
    return reconstruction.match;
  };

const BA5E = (str1: AminoPeptide, str2: AminoPeptide): string => formatResult(
  (
    (width: number, height: number) => (
      (pathWithBacktrack: PathWithBacktrack) => backtrack<Result>(
        pathWithBacktrack,
        (result, curr, next) => ({
          ...result,
          alignedStr1: reconstruct({
            left: str1[next % width],
            match: str1[next % width],
            up: "-",
          })(curr, next, width) + result.alignedStr1,
          alignedStr2: reconstruct({
            left: "-",
            match: str2[Math.floor(next / width)],
            up: str2[Math.floor(next / width)],
          })(curr, next, width) + result.alignedStr2
        }),
        {
          alignedStr1: "",
          alignedStr2: "",
          score: pathWithBacktrack.path[pathWithBacktrack.sink]
        }
      )
    )(
      computePathFromMatrix(
        width,
        height,
        (x, y, getValue) => [
          constructMatrixPredecessor(x, y-1, str1, str2, getValue, () => -5),
          constructMatrixPredecessor(x-1, y, str1, str2, getValue, () => -5),
          constructMatrixPredecessor(x-1, y-1, str1, str2, getValue, scoreAminos())
        ]
      )
    )
  )(str1.length + 1, str2.length + 1)
);

// Test data
assertEqual(
  "BA5E",
  BA5E(
    newAminoPeptide("PLEASANTLY"),
    newAminoPeptide("MEANLY")
  ),
  `8
PLEASANTLY
-MEA--N-LY`
);
