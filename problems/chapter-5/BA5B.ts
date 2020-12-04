import { computePathFromMatrix, Matrix, MatrixPredecessor } from "../../utilities/matrix";
import { parseMatrix } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

const constructMatrixPredecessor = (
  x: number,
  y: number,
  weights: Matrix,
  getValue: (y: number, x: number) => number,
): MatrixPredecessor => ({
  weight: x < 0 || y < 0 ? 0 : getValue(x, y) + weights[y][x],
  x,
  y
});

const BA5B = (down: Matrix, right: Matrix): number => computePathFromMatrix(
  down[0].length,
  right.length,
  (x, y, getValue) => [
    constructMatrixPredecessor(x-1, y, right, getValue),
    constructMatrixPredecessor(x, y-1, down, getValue)
  ]
).path.slice(-1)[0];

// Test data
assertEqual(
  "BA5B",
  BA5B(
    parseMatrix(`
    1 0 2 4 3
    4 6 5 2 1
    4 4 5 2 1
    5 6 8 5 3
    `),
    parseMatrix(`
    3 2 4 0
    3 2 4 2
    0 7 3 3
    3 3 0 2
    1 3 2 2
    `)
  ),
  34
);
