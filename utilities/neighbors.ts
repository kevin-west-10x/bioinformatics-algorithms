import memoize from "./memoize";

const neighbors = memoize((word: string, distance: number): string[] => {
  if (word.length === 0) {
    return [""];
  }

  if (distance === 0) {
    return [word];
  }
  
  const substr = word.substr(1);
  return ["A", "C", "G", "T"].map(
    letter => neighbors(substr, word[0] === letter ? distance : distance - 1).map(
      neighbor => `${letter}${neighbor}`
    )
  ).reduce((result, arr) => [...result, ...arr]);
});

export default neighbors;