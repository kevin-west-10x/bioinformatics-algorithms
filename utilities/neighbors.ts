import memoize from "./memoize";

const DEFAULT_ALPHABET = ["A", "C", "G", "T"];

const neighbors = memoize((word: string, distance: number, alphabet: string[] = DEFAULT_ALPHABET): string[] => {
  if (word.length === 0) {
    return [""];
  }

  if (distance === 0) {
    return [word];
  }
  
  const substr = word.substr(1);
  return alphabet.map(
    letter => neighbors(substr, word[0] === letter ? distance : distance - 1, alphabet).map(
      neighbor => `${letter}${neighbor}`
    )
  ).reduce((result, arr) => [...result, ...arr]);
});

export default neighbors;