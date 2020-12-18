import { computeMatrix, constructMatrixPredecessor } from "../../utilities/matrix";
import { assertEqual } from "../../utilities/test";

interface Result {
  alignedStr1: string;
  alignedStr2: string;
  score: number;
}

const formatResult = (result: Result): string =>`${result.score}
${result.alignedStr1}
${result.alignedStr2}`;

const BA5I = (str1: string, str2: string): string => formatResult(
  (
    (width: number, height: number) => computeMatrix({
      getPredecessors: ({ x, y }, getValue) => {
        const predecessors = [
          constructMatrixPredecessor({ x: x-1, y }, getValue, () => -2),
          constructMatrixPredecessor({ x, y: y-1 }, getValue, () => -2),
          constructMatrixPredecessor({ x: x-1, y: y-1 }, getValue, ({ x, y }) => str1[x] === str2[y] ? 1 : -2)
        ];
        if (y === 0) {
          predecessors.unshift(constructMatrixPredecessor({ x: 0, y: 0 }, getValue, () => 0));
        }
        return predecessors;
      },
      height,
      transform: ({ sink: { x, y }, matrix, ...other }) => (
        (column: number[]) => ({
          ...other,
          matrix,
          sink: {
            x,
            y: column.lastIndexOf(Math.max(...column))
          }
        })
      )(matrix.map(row => row[x])),
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
        score: matrix[sink.y][sink.x],
      })
    )
  )(str1.length + 1, str2.length + 1));

// Test data
assertEqual(
  "BA5I",
  BA5I(
    "PAWHEAE",
    "HEAGAWGHEE"
  ),
  `1
HEAE
HEAG`
);
