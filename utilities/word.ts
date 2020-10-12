export type WordReducer<Result> = (currentResult: Result, word: string, index: number) => Result;

/**
 * The reducer will be called with each possible word in `text` of length
 * `size`, as well as it's index in `text`.
 */
export const wordReduce = <Result>(
  text: string,
  size: number,
  reducer: WordReducer<Result>,
  initialResult: Result
): Result =>
    text
      .split('')
      .reduce<Result>(
        (currentResult, _, index) => {
          if (text.length - size - index >= 0) {
            const word = text.substr(index, size);
            currentResult = reducer(currentResult, word, index);
          }
          return currentResult;
        },
        initialResult
      );