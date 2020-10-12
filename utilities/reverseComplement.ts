const complement = (base: string): string => {
  switch(base) {
    case "A": return "T";
    case "C": return "G";
    case "G": return "C";
    case "T": return "A";
    default: return "";
  }
}

export default (pattern: string): string =>
  pattern
    .split("")
    .reverse()
    .map(complement)
    .join("");