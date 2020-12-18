import { AminoPeptide, newAminoPeptide } from "../../utilities/genetics";
import { computeMatrix, constructMatrixPredecessor, MatrixResult } from "../../utilities/matrix";
import { pickMin } from "../../utilities/pick";
import { assertEqual } from "../../utilities/test";

const BA5G = (str1: AminoPeptide, str2: AminoPeptide): number => 
  (
    (width: number, height: number) => (
      ({ matrix, sink }: MatrixResult) => matrix[sink.y][sink.x]
    )(
      computeMatrix({
        compareFn: pickMin,
        getPredecessors: ({ x, y }, getValue) => [
          constructMatrixPredecessor({ x, y: y-1 }, getValue, () => 1),
          constructMatrixPredecessor({ x: x-1, y }, getValue, () => 1),
          constructMatrixPredecessor({ x: x-1, y: y-1 }, getValue, ({ x, y }) => str1[x] === str2[y] ? 0 : 1),
        ],
        height,
        width,
      })
    )
  )(str1.length + 1, str2.length + 1);

// Test data
assertEqual(
  "BA5G",
  BA5G(
    newAminoPeptide("PLEASANTLY"),
    newAminoPeptide("MEANLY")
  ),
  5
);
