import { AminoPeptide, aminoToMass, newAminoPeptide, peptideReduce } from "../../utilities/genetics";
import { assertEqual } from "../../utilities/test";

const BA4C = (peptide: AminoPeptide): number[] => peptideReduce<number[]>(
  peptide,
  (masses, peptide) => [
    ...masses,
    peptide.reduce((mass, amino) => mass + aminoToMass(amino), 0)
  ],
  []
);

// Test data
assertEqual(
  "BA4C",
  BA4C(newAminoPeptide("LEQN")).sort((a, b) => a < b ? -1 : 1).join(" "),
  "0 113 114 128 129 227 242 242 257 355 356 370 371 484"
);
