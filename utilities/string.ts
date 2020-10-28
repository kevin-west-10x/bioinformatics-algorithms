import { Graph } from "./graph";

export const parseInput = (str: string): string[] => str.trim().split("\n").map(s => s.trim());

export const parseGraph = (str: string): Graph =>
  Object.fromEntries<string[]>(
    str
      .trim()
      .split("\n")
      .map(
        val => {
          const entry = val.trim().split(" -> ");
          return [entry[0], entry[1].trim().split(",").map(s => s.trim())];
        }
      )
  );
