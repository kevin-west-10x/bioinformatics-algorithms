import { AminoPeptide, aminoToMass, newAminoPeptide, peptideScore } from "../../utilities/genetics";
import { assertEqual } from "../../utilities/test";

const BA4F = (peptide: AminoPeptide, spectrum: number[]): number => peptideScore(peptide.map(aminoToMass), spectrum);

// Test data
assertEqual(
  "BA4F",
  BA4F(newAminoPeptide("NQEL"), "0 99 113 114 128 227 257 299 355 356 370 371 484".split(" ").map(str => parseInt(str))),
  11
);
