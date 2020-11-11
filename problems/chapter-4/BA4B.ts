import { textToPeptide } from "../../utilities/genetics";
import { DNA, RNA, translate } from "../../utilities/lexographic";
import reverseComplement from "../../utilities/reverseComplement";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

const toRna = translate(DNA, RNA);

const BA4B = (text: string, peptide: string): string[] => wordReduce<string[]>(
  text,
  peptide.length * 3,
  (patterns, word) => [...patterns, word],
  []
).filter(
  (word): word is string =>
    textToPeptide(toRna(word)) === peptide ||
    textToPeptide(toRna(reverseComplement(word))) === peptide
);

// Test data
assertEqual(
  "BA4B",
  BA4B("ATGGCCATGGCCCCCAGAACTGAGATCAATAGTACCCGTATTAACGGGTGA", "MA").sort().join(" "),
  "ATGGCC ATGGCC GGCCAT"
);
