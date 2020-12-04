import { backtrack, computePath, PathWithBacktrack } from "../../utilities/matrix";
import { assertEqual } from "../../utilities/test";

type DAG = WeightedEdge[];

interface WeightedEdge {
  end: number;
  start: number;
  weight: number;
}

const parseEdge = (edge: string): WeightedEdge => {
  const [start, next] = edge.split("->");
  const [end, weight] = next.split(":").map(s => parseInt(s));
  return {
    end,
    start: parseInt(start),
    weight
  };
};

const parseDAG = (dag: string): DAG => dag.trim().split("\n").map(parseEdge);

type Result = [number, number[]];

const BA5D = (source: number, sink: number, dag: DAG): Result => (
  (pathWithBacktrack: PathWithBacktrack) => backtrack<Result>(
    pathWithBacktrack,
    ([weight, path], _, next) => [
      weight,
      [next, ...path]
    ],
    [pathWithBacktrack.path[sink], [sink]]
  )
)(computePath(
  source,
  sink,
  (index, getValue) => dag.filter(edge => edge.end === index).map(edge => ({
    index: edge.start,
    weight: getValue(edge.start) + edge.weight
  }))
));

// Test data
assertEqual(
  "BA5D",
  BA5D(
    0,
    4,
    parseDAG(`
      0->1:7
      0->2:4
      2->3:2
      1->4:1
      3->4:3
    `)
  ).map(res => res instanceof Array ? res.join("->") : res).join(": "),
  "9: 0->2->3->4"
);
