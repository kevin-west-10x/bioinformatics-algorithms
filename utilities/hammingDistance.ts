export default (str1: string, str2: string): number =>
  str1
    .split("")
    .reduce<number>(
      (distance, char, index) => char !== str2[index] ? distance + 1 : distance,
      0
    );