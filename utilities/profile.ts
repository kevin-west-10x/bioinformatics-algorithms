import { indexFromBase } from "./lexographic";
import { pickMax } from "./pick";
import { Tuple } from "./tuple";
import { wordReduce } from "./word";

export type NumberTuple<Size extends number> = Tuple<Size, number>;
export type Profile<Size extends number, T = NumberTuple<Size>> = [T, T, T, T];

const constructTuple = <Size extends number, T extends NumberTuple<Size>>(size: Size): T =>
  new Array<number>(size).fill(0) as T;

const constructDefaultProfile = <Size extends number, T extends NumberTuple<Size>>(size: Size): Profile<Size, T> => [
  constructTuple<Size, T>(size),
  constructTuple<Size, T>(size),
  constructTuple<Size, T>(size),
  constructTuple<Size, T>(size)
];

export const constructProfile = <Size extends number, T extends NumberTuple<Size>>(patterns: string[], size: Size): Profile<Size, T> =>
  patterns.reduce<Profile<Size, T>>(
    (profile, pattern, _, { length }) => {
      if (pattern.length !== size) {
        throw new Error("Invalid pattern size to construct profile");
      }
      pattern.split("").forEach((base, index) => profile[indexFromBase(base)][index] += 1/length);
      return profile;
    },
    constructDefaultProfile<Size, T>(size)
  );

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
          // Calculate probability by converting character to index of row in profile, picking the
          // probability at the index of the character in the pattern, and multiplying them all together
          probability: pattern
            .split("")
            .map(indexFromBase)
            .reduce(
              (probability, baseIndex, letterIndex) => probability * profile[baseIndex][letterIndex],
              1
            )
        }
      ),
    {
      probability: -Infinity,
      pattern: ""
    }
  ).pattern