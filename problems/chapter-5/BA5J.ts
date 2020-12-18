import { AminoPeptide, newAminoPeptide } from "../../utilities/genetics";
import { computeMatrix3D, constructMatrix3DPredecessor, LEVELS, Matrix3DPredecessor } from "../../utilities/matrix3d";
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

const BA5J = (str1: AminoPeptide, str2: AminoPeptide): string => formatResult(
  (
    (width: number, height: number) => computeMatrix3D({
      getPredecessors: ({ x, y, z }, getValue) => {
        let predecessors: Matrix3DPredecessor[] = [];
        if (z === LEVELS.LOWER) {
          predecessors = [
            constructMatrix3DPredecessor({ x, y: y-1, z: LEVELS.LOWER }, getValue, () => -1),
            constructMatrix3DPredecessor({ x, y: y-1, z: LEVELS.MIDDLE }, getValue, () => -11),
          ];
        }
        else if (z === LEVELS.MIDDLE) {
          predecessors = [
            constructMatrix3DPredecessor({ x, y, z: LEVELS.LOWER }, getValue, () => 0),
            constructMatrix3DPredecessor({ x, y, z: LEVELS.UPPER }, getValue, () => 0),
            constructMatrix3DPredecessor(
              { x: x-1, y: y-1, z: LEVELS.MIDDLE },
              getValue,
              scoreAminos(BLOSUM62_MATRIX, str1, str2)
            )
          ];
        }
        else if (z === LEVELS.UPPER) {
          predecessors = [
            constructMatrix3DPredecessor({ x: x-1, y, z: LEVELS.UPPER }, getValue, () => -1),
            constructMatrix3DPredecessor({ x: x-1, y, z: LEVELS.MIDDLE }, getValue, () => -11),
          ];
        }
        return predecessors;
      },
      height,
      width,
    }).reconstruct<Result>(
      (result, _, next, stringForDirection) => ({
        ...result,
        alignedStr1: stringForDirection({
          left: str1[next.x],
          match: str1[next.x],
          skip: "",
          up: "-",
        }, false) + result.alignedStr1,
        alignedStr2: stringForDirection({
          left: "-",
          match: str2[next.y],
          skip: "",
          up: str2[next.y],
        }, false) + result.alignedStr2
      }),
      ({ matrix, sink }) => ({
        alignedStr1: "",
        alignedStr2: "",
        score: matrix[sink.z][sink.y][sink.x],
      })
    )
  )(str1.length + 1, str2.length + 1));

// Test data
assertEqual(
  "BA5J",
  BA5J(
    newAminoPeptide("PRTEINS"),
    newAminoPeptide("PRTWPSEIN")
  ),
  `8
PRT---EINS
PRTWPSEIN-`
);
