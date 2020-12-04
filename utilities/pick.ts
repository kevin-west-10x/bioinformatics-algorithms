// Functions to pick an item based on score - this helps create more functional
// reducers. In the case of equality, the first item is always picked.

interface Scored<T> {
  item: T;
  score: number;
}

export const pickMin = <T>(score: (item: T) => number, ...items: T[]): T =>
  items.sort((i1, i2) => score(i1) - score(i2))[0];

export const pickMinN = <T>(score: (item: T) => number, N: number, ...items: T[]): T[] =>
  items
    .map<Scored<T>>(item => ({ item, score: score(item) }))
    .sort((i1, i2) => i1.score - i2.score)
    .filter((scored, _, arr) => scored.score >= arr[Math.min(N, arr.length) - 1].score)
    .map(scored => scored.item);

export const pickMax = <T>(score: (item: T) => number, ...items: T[]): T =>
  items.sort((i1, i2) => score(i2) - score(i1))[0];

export const pickMaxN = <T>(score: (item: T) => number, N: number, ...items: T[]): T[] =>
  items
    .map<Scored<T>>(item => ({ item, score: score(item) }))
    .sort((i1, i2) => i2.score - i1.score)
    .filter((scored, _, arr) => scored.score >= arr[Math.min(N, arr.length) - 1].score)
    .map(scored => scored.item);