import { scoreMotifs } from "../../utilities/motif";
import { pickMin } from "../../utilities/pick";
import { constructProfile, profileMostProbable } from "../../utilities/profile";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

// Reduce across all words of `size` in the first dna string
const BA2D = ([firstText, ...otherTexts]: string[], size: number): string[] =>
  wordReduce<string[]>(
    firstText,
    size,
    (bestMotifs, word) => pickMin(
      // Pick minimum set of motifs on each iteration by score value
      scoreMotifs,
      bestMotifs,
      otherTexts.reduce(
        (motifs, text) => [
          ...motifs,
          // Collect motifs one by one by picking most probable next element
          // from the profile constructed by the previous list of motifs.
          // Profile is constructed from a pseudoCount of 0 (leaving 0s in the matrix)
          profileMostProbable(text, size, constructProfile(motifs, size, 0))
        ],
        [word]
      )
    ),
    [firstText, ...otherTexts].map(text => text.substr(0, size))
  );

// Test data
assertEqual(
  "BA2D",
  BA2D(
    [
      "GGCGTTCAGGCA",
      "AAGAATCAGTCA",
      "CAAGGAGTTCGC",
      "CACGTCAATCAC",
      "CAATAATATTCG"
    ],
    3
  ).join(" "),
  "CAG CAG CAA CAA CAA"
);
