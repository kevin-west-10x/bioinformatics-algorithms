import { wordReduce } from "./word";

export type PatternReducer<Result> = (currentResult: Result, index: number) => Result;

/**
 * The reducer will be called with the index of each instance of the
 * pattern in the text
 */
export const patternReduce = <Result>(
  text: string,
  pattern: string,
  reducer: PatternReducer<Result>,
  initialResult: Result
): Result =>
  wordReduce(
    text,
    pattern.length,
    (currentResult, word, index) => word === pattern
      ? reducer(currentResult, index)
      : currentResult,
    initialResult
  );

  export const prefix = (pattern: string): string => pattern.slice(0, -1);
  export const suffix = (pattern: string): string => pattern.slice(1);