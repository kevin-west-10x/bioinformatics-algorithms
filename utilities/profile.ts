import { indexFromBase } from "./lexographic";
import { pickMax } from "./pick";
import { Tuple } from "./tuple";
import { wordReduce } from "./word";

export type NumberTuple<Size extends number> = Tuple<Size, number>;
export type Profile<Size extends number, T = NumberTuple<Size>> = [T, T, T, T];

const constructTuple = <Size extends number, T extends NumberTuple<Size>>(size: Size, pseudoCount: number): T =>
  new Array<number>(size).fill(pseudoCount) as T;

const constructDefaultProfile = <Size extends number, T extends NumberTuple<Size>>(size: Size, pseudoCount: number): Profile<Size, T> => [
  constructTuple<Size, T>(size, pseudoCount),
  constructTuple<Size, T>(size, pseudoCount),
  constructTuple<Size, T>(size, pseudoCount),
  constructTuple<Size, T>(size, pseudoCount)
];

const transformProbability = (value: number, length: number, pseudoCount: number) =>
  value / (length + (4 * pseudoCount));

export const constructProfile = <Size extends number, T extends NumberTuple<Size>>(patterns: string[], size: Size, pseudoCount: number = 1): Profile<Size, T> =>
  patterns.reduce<Profile<Size, T>>(
    (profile, pattern, _, { length }) => {
      if (pattern.length !== size) {
        throw new Error("Invalid pattern size to construct profile");
      }
      pattern.split("").forEach((base, index) => profile[indexFromBase(base)][index] += transformProbability(1, length, pseudoCount));
      return profile;
    },
    constructDefaultProfile<Size, T>(size, transformProbability(pseudoCount, patterns.length, pseudoCount))
  );

// Calculate probability by converting character to index of row in profile, picking the
// probability at the index of the character in the pattern, and multiplying them all together
export const patternProbability = (pattern: string, profile: Profile<number>): number =>
  pattern
    .split("")
    .map(indexFromBase)
    .reduce(
      (probability, baseIndex, letterIndex) => probability * profile[baseIndex][letterIndex],
      1
    )

export interface ProfileMostProbable {
  pattern: string;
  probability: number;
}

export const profileMostProbable = <Size extends number, T extends NumberTuple<Size>>(
  text: string,
  size: Size,
  profile: Profile<Size, T>
): string =>
  wordReduce<ProfileMostProbable>(
    text,
    size,
    (profileMostProbable, pattern) =>
      pickMax(
        item => item.probability,
        profileMostProbable,
        {
          pattern,
          probability: patternProbability(pattern, profile)
        }
      ),
    {
      probability: -Infinity,
      pattern: ""
    }
  ).pattern