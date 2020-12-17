import { accumulate, doWhile, repeat } from "./functional";
import { patternToIndex, RNA } from "./lexographic";
import memoize from "./memoize";

export const AMINOS = ["A", "C", "D", "E", "F", "G", "H", "I", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "V", "W", "Y"] as const;
export type Amino = typeof AMINOS[number];
export const STOP = "*" as const;
export type Stop = typeof STOP;
export const MASSES = [57, 71, 87, 97, 99, 101, 103, 113, 114, 115, 128, 129, 131, 137, 147, 156, 163, 186] as const;
export type Mass = typeof MASSES[number];

export const aminoIndex = memoize((amino: Amino): number => AMINOS.indexOf(amino));

export const newAminoPeptide = (str: string): AminoPeptide => {
  const aminos = str.split("").filter((amino): amino is Amino => AMINOS.some(a => a === amino));
  if (aminos.length !== str.length) {
    throw new Error("Invalid peptide string");
  }
  return aminos;
};

export const fromAminoPeptide = (peptide: AminoPeptide): string => peptide.join("");

export const newMassPeptide = (str: string): MassPeptide => {
  const masses = str.split("-").map(s => parseInt(s)).filter((mass): mass is Mass => MASSES.some(m => m === mass));
  if (masses.length !== str.length) {
    throw new Error("Invalid peptide string");
  }
  return masses;
};

export const fromMassPeptide = (peptide: MassPeptide): string => peptide.join("-");

export type AminoPeptide = Array<Amino>;
export type MassPeptide = Array<Mass>;

const AMINO_ARRAY: Array<Amino | Stop> = [
  "K", "N", "K", "N",
  "T", "T", "T", "T",
  "R", "S", "R", "S",
  "I", "I", "M", "I",
  "Q", "H", "Q", "H",
  "P", "P", "P", "P",
  "R", "R", "R", "R",
  "L", "L", "L", "L",
  "E", "D", "E", "D",
  "A", "A", "A", "A",
  "G", "G", "G", "G",
  "V", "V", "V", "V",
  "*", "Y", "*", "Y",
  "S", "S", "S", "S",
  "*", "C", "W", "C",
  "L", "F", "L", "F"
];

const AMINO_MASSES: Record<Amino, Mass> = {
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

export const codonToAmino = (codon: string): Amino | Stop | undefined =>
  codon ? AMINO_ARRAY[patternToIndex(RNA)(codon)] : undefined;

export const textToPeptide = (text: string): AminoPeptide =>
  codonReduce<AminoPeptide>(text, (curr, amino) => [...curr, amino], []);

export const aminoToMass = (amino: Amino): Mass =>
  AMINO_MASSES[amino] || 0;

export type CodonReducer<Result> = (currentResult: Result, amino: Amino, codon: string) => Result;

interface CodonResult<Result, AminoType = Amino | Stop | undefined> {
  amino: AminoType,
  codon: string;
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
  doWhile(
    (codonResult): codonResult is CodonResult<Result, Amino> => !!codonResult.amino && codonResult.amino !== STOP,
    ({ amino, codon, result, text }) => ({
      amino: codonToAmino(text.slice(0, 3)),
      codon: text.slice(0, 3),
      result: reducer(result, amino, codon),
      text: text.slice(3)
    }),
    {
      amino: codonToAmino(text.slice(0, 3)),
      codon: text.slice(0, 3),
      result: initialResult,
      text: text.slice(3),
    } as CodonResult<Result>
  ).result;

export type PeptideReducer<Result, AminoType> = (currentResult: Result, peptide: Array<AminoType>) => Result;

interface PeptideResult<Result> {
  result: Result;
  size: number;
}

export const peptideReduce = <Result, AminoType = Amino>(
  peptide: Array<AminoType>,
  reducer: PeptideReducer<Result, AminoType>,
  initialResult: Result,
  cyclical = true,
): Result =>  doWhile<PeptideResult<Result>>(
  ({ size }) => size <= peptide.length,
  ({ result, size }) => ({
    result: size === 0
      // Special case size 0 to pass empty array
      ? reducer(result, [])
      // Special case size === peptide.length - no need to cycle since they are not unique
      : size === peptide.length
        ? reducer(result, peptide)
        : repeat(
            cyclical ? peptide.length : peptide.length - size,
            (result, index) => reducer(result, peptide.concat(peptide).slice(index, index + size)),
            result
          ),
    size: size + 1,
  }),
  { result: initialResult, size: 0 }
).result;

export const massOf = (peptide: MassPeptide): number => peptide.reduce((a, b) => a + b, 0);

export const peptideScore = memoize((peptide: MassPeptide, spectrum: number[]): number => {
  const peptideSpectrum = peptideReduce<number[], Mass>(
    peptide,
    (peptideSpectrum, peptide) => [...peptideSpectrum, peptide.reduce((mass, amino) => mass + amino, 0)],
    []
  );
  const peptideSpectrumCount = accumulate<Record<number, number>>({}, peptideSpectrum, count => count + 1, 0);
  const spectrumCount = accumulate<Record<number, number>>({}, spectrum, count => count + 1, 0);
  const keys = [...new Set([...peptideSpectrum, ...spectrum])];
  return keys.reduce((count, key) => count + Math.min(peptideSpectrumCount[key] || 0, spectrumCount[key] || 0), 0);
});