export const indexFromBase = (base: string): number => {
  switch(base) {
    case "A": return 0;
    case "C": return 1;
    case "G": return 2;
    case "T": return 3;
    default: return 0;
  }
}

export const baseFromIndex = (index: number): string => {
  switch(index) {
    case 0: return "A";
    case 1: return "C";
    case 2: return "G";
    case 3: return "T";
    default: return "";
  }
}

export const patternToIndex = (pattern: string): number =>
  pattern
    .split("")
    .reverse()
    .reduce(
      (index, base, i) => index + indexFromBase(base) * Math.pow(4, i),
      0
    );

export const indexToPattern = (index: number, k: number): string =>
  new Array(k).fill("").map(
    (_, i) => baseFromIndex(
      Math.floor(
        (index % Math.pow(4, k - i)) / Math.pow(4, k - i - 1)
      )
    )
  ).join("");