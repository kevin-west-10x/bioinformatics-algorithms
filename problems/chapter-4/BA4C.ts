import { aminoToMass, peptideReduce } from "../../utilities/genetics";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

const BA4C = (peptide: string): number[] => peptideReduce<number[]>(
  peptide,
  (peptides, peptide) => [
    ...peptides,
    wordReduce(
      peptide,
      1,
      (mass, amino) => mass + aminoToMass(amino),
      0
    )
  ],
  []
);

// Test data
assertEqual(
  "BA4C",
  BA4C("LEQN").sort((a, b) => a < b ? -1 : 1).join(" "),
  "0 113 114 128 129 227 242 242 257 355 356 370 371 484"
);
