export const randomInt = (max: number): number =>
  Math.floor(Math.random() * Math.floor(max));

export const selectRandom = (str: string, size: number): string =>
  str.substr(randomInt(str.length - size + 1), size);

// Given an array of numbers that represent weight of each index
// generate a random index.
interface WeightReducer {
  index: number;
  weight: number;
}
export const randomIndexWeighted = (...weights: number[]): number => 
  weights.reduce<WeightReducer>(
    (curr, weight, index) => curr.weight > weight
      ? { index: index + 1, weight: curr.weight - weight }
      : { index: curr.index, weight: 0 },
    {
      index: 0,
      weight: Math.random() * weights.reduce((a, b) => a + b)
    }
  ).index;
