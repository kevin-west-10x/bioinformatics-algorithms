import { repeat } from "../../utilities/functional";
import { scoreMotifs } from "../../utilities/motif";
import { pickMin } from "../../utilities/pick";
import { constructProfile, profileMostProbable } from "../../utilities/profile";
import { selectRandom } from "../../utilities/random";
import { assertEqual } from "../../utilities/test";

// Randomized motif search
const BA2F = (texts: string[], size: number): string[] => {
  const searchFn = (): string[] => {
    // Seed initial selection randomly
    let bestMotifs = texts.map(text => selectRandom(text, size));
    while (true) {
      // See if we can get a better scoring set of motifs by picking profile most
      // probable motifs from the profile constructed by the current best set of
      // motifs.
      const motifs = pickMin(
        scoreMotifs,
        bestMotifs,
        texts.map(text => profileMostProbable(text, size, constructProfile(bestMotifs, size)))
      )
      if (motifs === bestMotifs) {
        return motifs;
      }
      bestMotifs = motifs;
    }
  }
  return repeat(
    999,
    motifs => pickMin(
      scoreMotifs,
      motifs,
      searchFn()
    ),
    searchFn()
  );
}

// Test data
assertEqual(
  "BA2F",
  BA2F(
    [
      "CGCCCCTCTCGGGGGTGTTCAGTAAACGGCCA",
      "GGGCGAGGTATGTGTAAGTGCCAAGGTGCCAG",
      "TAGTACCGAGACCGAAAGAAGTATACAGGCGT",
      "TAGATCAAGTTTCAGGTGCACGTCGGTGAACC",
      "AATCCACCAGCTCCACGTGCAATGTTGGCCTA"
    ],
    8
  ).join(" "),
  "TCTCGGGG CCAAGGTG TACAGGCG TTCAGGTG TCCACGTG",
  "AACGGCCA AAGTGCCA TAGTACCG AAGTTTCA ACGTGCAA",
  "CAGTAAAC AAGTGCCA AAGTATAC AGGTGCAC ACGTGCAA"
);
