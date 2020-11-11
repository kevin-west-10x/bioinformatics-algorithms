import { wordReduce } from "./word";

export const DNA = "DNA";
export const RNA = "RNA";
const languages = { DNA, RNA } as const;
type Language = typeof languages[keyof typeof languages];

const LANGUAGE_ARRAYS: Record<Language, string> = {
  DNA: "ACGT",
  RNA: "ACGU",
};

export const indexFromBase = (language: Language) => (base: string): number =>
  Math.max(0, LANGUAGE_ARRAYS[language].indexOf(base));

export const baseFromIndex = (language: Language) => (index: number): string => 
  LANGUAGE_ARRAYS[language][index] || "";

export const patternToIndex = (language: Language) => (pattern: string): number =>
  pattern
    .split("")
    .reverse()
    .reduce(
      (index, base, i) => index + indexFromBase(language)(base) * Math.pow(4, i),
      0
    );

export const indexToPattern = (language: Language) => (index: number, k: number): string =>
  new Array(k).fill("").map(
    (_, i) => baseFromIndex(language)(
      Math.floor(
        (index % Math.pow(4, k - i)) / Math.pow(4, k - i - 1)
      )
    )
  ).join("");

export const translate = (from: Language, to: Language) => (text: string): string =>
  wordReduce(text, 1, (str, base) => str += baseFromIndex(to)(indexFromBase(from)(base)), "");