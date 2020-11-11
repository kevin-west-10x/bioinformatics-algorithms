import { doWhile } from "./functional";
import { patternToIndex, RNA } from "./lexographic";
import memoize from "./memoize";
import { wordReduce } from "./word";

export const STOP = "*";

const AMINO_STRING = "KNKNTTTTRSRSIIMIQHQHPPPPRRRRLLLLEDEDAAAAGGGGVVVV*Y*YSSSS*CWCLFLF";

const AMINO_MASSES: Record<string, number> = {
  G: 57,
  A: 71,
  S: 87,
  P: 97,
  V: 99,
  T: 101,
  C: 103,
  I: 113,
  L: 113,
  N: 114,
  D: 115,
  K: 128,
  Q: 128,
  E: 129,
  M: 131,
  H: 137,
  F: 147,
  R: 156,
  Y: 163,
  W: 186,
};

export const codonToAmino = (codon: string): string =>
  AMINO_STRING[patternToIndex(RNA)(codon)];

export const textToPeptide = (text: string) =>
  codonReduce(text, (curr, amino) => curr + amino, "");

export const aminoToMass = (amino: string): number =>
  AMINO_MASSES[amino] || 0;

export const UNIQUE_MASSES = [...new Set(Object.values(AMINO_MASSES)).values()];

export type CodonReducer<Result> = (currentResult: Result, amino: string, codon: string) => Result;

interface CodonResult<Result> {
  result: Result;
  text: string;
}
/**
 * The reducer will be called with the index of each instance of the
 * pattern in the text
 */
export const codonReduce = <Result>(
  text: string,
  reducer: CodonReducer<Result>,
  initialResult: Result
): Result =>
  doWhile<CodonResult<Result>>(
    ({ text }) => text.length > 0 && codonToAmino(text.slice(0, 3)) !== STOP,
    ({ result, text }) => ((codon: string, text: string) => ({
      result: reducer(result, codonToAmino(codon), codon),
      text
    }))(text.slice(0, 3), text.slice(3)),
    {
      result: initialResult,
      text,
    }
  ).result;

export type PeptideReducer<Result> = (currentResult: Result, peptide: string) => Result;

interface PeptideResult<Result> {
  result: Result;
  size: number;
}

export const peptideReduce = <Result>(
  peptide: string,
  reducer: PeptideReducer<Result>,
  initialResult: Result
): Result =>
  doWhile<PeptideResult<Result>>(
    ({ size }) => size <= peptide.length,
    ({ result, size }) => ({
      result: size === 0
        // Special case size 0 to pass empty string
        ? reducer(result, "")
        // Special case size === peptide.length - no need to cycle since they are not unique
        : wordReduce(
          size === peptide.length ? peptide : peptide + peptide.slice(0, size - 1),
          size,
          reducer,
          result
        ),
      size: size + 1,
    }),
    { result: initialResult, size: 0 }
  ).result;