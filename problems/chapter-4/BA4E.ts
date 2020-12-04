import { doWhile } from "../../utilities/functional";
import { fromMassPeptide, Mass, MASSES, massOf, MassPeptide, peptideReduce } from "../../utilities/genetics";
import { assertEqual } from "../../utilities/test";

interface Candidates {
  candidates: MassPeptide[];
  result: MassPeptide[];
}

const BA4E = (spectrum: number[]): MassPeptide[] => doWhile<Candidates>(
  ({ candidates }) => candidates.length > 0,
  ({ candidates, result }) => candidates.reduce<Candidates>(
    ({ candidates, result }, peptide) => {
      // TODO: Until peptide is right size, must compare linear spectrum of the current
      // peptide, not cyclical spectrum since it will return invalid links.
      const peptideLinearSpectrum = peptideReduce<number[], Mass>(
        peptide,
        (spectrum, peptide) => [...spectrum, massOf(peptide)],
        [],
        false
      ).sort((a, b) => a - b);
      const peptideCyclicalSpectrum = peptideReduce<number[], Mass>(
        peptide,
        (spectrum, peptide) => [...spectrum, massOf(peptide)],
        []
      ).sort((a, b) => a - b);
      if (peptideCyclicalSpectrum.length === spectrum.length && spectrum.every((n, i) => peptideCyclicalSpectrum[i] === n)) {
        return {
          candidates,
          result: [...result, peptide]
        };
      }
      if (peptideLinearSpectrum.every(n => spectrum.includes(n))) {
        return {
          candidates: [...candidates, ...MASSES.map(mass => [...peptide, mass])],
          result
        };
      }
      return { candidates, result };
    },
    {
      candidates: [],
      result
    }
  ),
  {
    candidates: MASSES.map(mass => [mass]),
    result: []
  }
).result;

// Test data
assertEqual(
  "BA4E",
  BA4E("0 113 128 186 241 299 314 427".split(" ").map(str => parseInt(str)))
    .map(fromMassPeptide)
    .sort()
    .reverse()
    .join(" "),
  "186-128-113 186-113-128 128-186-113 128-113-186 113-186-128 113-128-186"
);
