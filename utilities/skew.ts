import { wordReduce } from "./word";

export default (text: string) => wordReduce<number[]>(
  text,
  1,
  (skews, base, index) => [
    ...skews,
    skews[index] + (base === "G" ? 1 : base === "C" ? -1 : 0)
  ],
  [0]
);