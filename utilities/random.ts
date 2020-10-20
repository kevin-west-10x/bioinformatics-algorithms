export const selectRandom = (str: string, size: number): string =>
  str.substr(Math.floor(Math.random() * (str.length - size + 1)), size);