// Functions to pick an item based on score - this helps create more functional
// reducers. In the case of equality, the first item is always picked.

export const pickMin = <T>(score: (item: T) => number, item1: T, item2: T): T =>
  score(item1) <= score(item2) ? item1 : item2;

export const pickMax = <T>(score: (item: T) => number, item1: T, item2: T): T =>
  score(item1) >= score(item2) ? item1 : item2;