import { computeMatrix, constructMatrixPredecessor } from "../../utilities/matrix";
import { assertEqual } from "../../utilities/test";

const BA5C = (str1: string, str2: string): string => (
  (width: number, height: number) => computeMatrix({
    getPredecessors: ({ x, y }, getValue) => [
      constructMatrixPredecessor({ x, y: y-1 }, getValue, () => 0),
      constructMatrixPredecessor({ x: x-1, y }, getValue, () => 0),
      constructMatrixPredecessor({ x: x-1, y: y-1 }, getValue, ({ x, y }) => str1[x] === str2[y] ? 1 : 0)
    ],
    height,
    width,
  }).reconstruct(
    (result, curr, next) => next.x === curr.x - 1 && next.y === curr.y - 1 ? str1[next.x] + result : result,
    ""
  )
)(str1.length + 1, str2.length + 1);

// Test data
assertEqual(
  "BA5C",
  BA5C("AACCTTGG", "ACACTGTGA"),
  "AACTTG"
);
