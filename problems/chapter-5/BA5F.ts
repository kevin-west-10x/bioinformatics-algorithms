import { AminoPeptide, newAminoPeptide } from "../../utilities/genetics";
import { computeMatrix, constructMatrixPredecessor, Coordinate } from "../../utilities/matrix";
import { PAM250_MATRIX, scoreAminos } from "../../utilities/scoring";

import { assertEqual } from "../../utilities/test";

interface Result {
  alignedStr1: string;
  alignedStr2: string;
  score: number;
}

interface MaxCoordinate {
  max: Coordinate;
  value: number;
}

const formatResult = (result: Result): string =>`${result.score}
${result.alignedStr1}
${result.alignedStr2}`;

const BA5F = (str1: AminoPeptide, str2: AminoPeptide): string => 
  formatResult((
    (width: number, height: number) => computeMatrix({
      getPredecessors: ({ x, y }, getValue) => [
        constructMatrixPredecessor({ x: 0, y: 0 }, getValue, () => 0),
        constructMatrixPredecessor({ x, y: y-1 }, getValue, () => -5),
        constructMatrixPredecessor({ x: x-1, y }, getValue, () => -5),
        constructMatrixPredecessor({ x: x-1, y: y-1 }, getValue, scoreAminos(PAM250_MATRIX, str1, str2)),
      ],
      height,
      transform: ({ matrix, ...other }) => ({
        ...other,
        matrix,
        sink: matrix.reduce<MaxCoordinate>(
          (max, row, y) => row.reduce<MaxCoordinate>(
            (max, value, x) => value < max.value ? max : { max: { x, y }, value },
            max
          ),
          {
            max: { x: 0, y: 0 },
            value: 0
          }
        ).max
      }),
      width,
    }).reconstruct<Result>(
      (result, _, next, stringForDirection) => ({
        ...result,
        alignedStr1: stringForDirection({
          left: str1[next.x],
          match: str1[next.x],
          skip: "",
          up: "-",
        }) + result.alignedStr1,
        alignedStr2: stringForDirection({
          left: "-",
          match: str2[next.y],
          skip: "",
          up: str2[next.y],
        }) + result.alignedStr2
      }),
      ({ matrix, sink }) => ({
        alignedStr1: "",
        alignedStr2: "",
        score: matrix[sink.y][sink.x]
      })
    )
  )(str1.length + 1, str2.length + 1));

// Test data
assertEqual(
  "BA5F",
  BA5F(
    newAminoPeptide("MEANLY"),
    newAminoPeptide("PENALTY")
  ),
  `15
EANL-Y
ENALTY`
);
