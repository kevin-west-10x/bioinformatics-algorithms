import { AminoPeptide, newAminoPeptide } from "../../utilities/genetics";
import { computeMatrix, constructMatrixPredecessor } from "../../utilities/matrix";
import { BLOSUM62_MATRIX, scoreAminos } from "../../utilities/scoring";
import { assertEqual } from "../../utilities/test";
interface Result {
  alignedStr1: string;
  alignedStr2: string;
  score: number;
}

const formatResult = (result: Result): string =>`${result.score}
${result.alignedStr1}
${result.alignedStr2}`;

const BA5E = (str1: AminoPeptide, str2: AminoPeptide): string => formatResult(
  (
    (width: number, height: number) => computeMatrix({
      getPredecessors: ({ x, y }, getValue) => [
        constructMatrixPredecessor({ x, y: y-1 }, getValue, () => -5),
        constructMatrixPredecessor({ x: x-1, y }, getValue, () => -5),
        constructMatrixPredecessor({ x: x-1, y: y-1}, getValue, scoreAminos(BLOSUM62_MATRIX, str1, str2))
      ],
      height,
      width,
    }).reconstruct<Result>(
      (result, _, next, stringForDirection) => ({
        ...result,
        alignedStr1: stringForDirection({
          left: str1[next.x],
          match: str1[next.x],
          up: "-",
        }, false) + result.alignedStr1,
        alignedStr2: stringForDirection({
          left: "-",
          match: str2[next.y],
          up: str2[next.y],
        }, false) + result.alignedStr2
      }),
      ({ matrix, sink }) => ({
        alignedStr1: "",
        alignedStr2: "",
        score: matrix[sink.y][sink.x]
      })
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
