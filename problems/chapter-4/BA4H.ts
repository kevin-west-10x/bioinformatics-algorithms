import { accumulate } from "../../utilities/functional";
import { assertEqual } from "../../utilities/test";

interface ConvolutionReducer {
  count: Record<number, number>;
  prev: number[];
}

const BA4H = (spectrum: number[]): number[] =>
  Object.entries(
    spectrum.sort((a, b) => a - b).reduce<ConvolutionReducer>(
      ({ count, prev }, num) => ({
        count: accumulate(count, prev.map(p => num - p), i => i + 1, 0),
        prev: [...prev, num]
      }),
      {
        count: {},
        prev: []
      }
    ).count
  ).sort((i1, i2) => {
    const res = i2[1] - i1[1];
    if (res !== 0) return res;
    return parseInt(i1[0]) - parseInt(i2[0]);
  }).flatMap(i => new Array(i[1]).fill(i[0]))
  

// Test data
assertEqual(
  "BA4H",
  BA4H("0 137 186 323".split(" ").map(str => parseInt(str))).join(" "),
  "137 137 186 186 49 323"
);
