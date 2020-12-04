import { Path } from "./cycle";
import { Graph } from "./graph";
import { Matrix } from "./matrix";

export const parseInput = (str: string): string[] => str.trim().split("\n").map(s => s.trim());

export const parseGraph = (str: string): Graph =>
  Object.fromEntries<string[]>(
    parseInput(str)
      .map(
        val => {
          const entry = val.split(" -> ");
          return [entry[0], entry[1].trim().split(",").map(s => s.trim())];
        }
      )
  );

export const parsePaths = (str: string): Path[] => parseInput(str).map(val => val.split(" -> "));

export const parseMatrix = (str: string): Matrix =>
  parseInput(str).map(row => row.split(" ").map(num => parseInt(num)));
