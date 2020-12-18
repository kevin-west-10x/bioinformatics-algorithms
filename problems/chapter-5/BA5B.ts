import { computeMatrix, constructMatrixPredecessor, Matrix } from "../../utilities/matrix";
import { parseMatrix } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";

const BA5B = (down: Matrix, right: Matrix): number => computeMatrix({
  getPredecessors: ({ x, y }, getValue) => [
    constructMatrixPredecessor({ x: x-1, y }, getValue, ({ x, y }) => right[y][x]),
    constructMatrixPredecessor({ x, y: y-1 }, getValue, ({ x, y }) => down[y][x])
  ],
  height: right.length,
  width: down[0].length,
}).matrix.slice(-1)[0].slice(-1)[0];

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
