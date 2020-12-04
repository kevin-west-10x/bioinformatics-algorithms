import { backtrack, computePathFromMatrix, MatrixPredecessor, Path } from "../../utilities/matrix";
import { assertEqual } from "../../utilities/test";

const constructMatrixPredecessor = (
  x: number,
  y: number,
  str1: string,
  str2: string,
  getValue: (y: number, x: number) => number,
  weight: number = 0
): MatrixPredecessor => ({
  weight: x < 0 || y < 0 ? 0 : getValue(x, y) + (str1[x] === str2[y] ? weight : 0),
  x,
  y
});

interface LCSReducer {
  backtrack: Path;
  index: number;
  lcs: string;
}

const BA5C = (str1: string, str2: string): string => (
  (width: number, height: number) => backtrack(
    computePathFromMatrix(
      width,
      height,
      (x, y, getValue) => [
        constructMatrixPredecessor(x, y-1, str1, str2, getValue),
        constructMatrixPredecessor(x-1, y, str1, str2, getValue),
        constructMatrixPredecessor(x-1, y-1, str1, str2, getValue, 1)
      ]
    ),
    (result, curr, next) => next === (curr - width - 1) ? str1[next % width] + result : result,
    ""
  )
)(str1.length + 1, str2.length + 1);

// Test data
assertEqual(
  "BA5C",
  BA5C("AACCTTGG", "ACACTGTGA"),
  "AACTTG"
);
