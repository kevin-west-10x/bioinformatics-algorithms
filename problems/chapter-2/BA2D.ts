import { scoreMotifs } from "../../utilities/motif";
import { pickMin } from "../../utilities/pick";
import { constructProfile, profileMostProbable } from "../../utilities/profile";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

// Reduce across all words of `size` in the first dna string
const BA2D = (texts: string[], size: number): string[] =>
  wordReduce<string[]>(
    texts[0],
    size,
    (bestMotifs, word) => pickMin(
      scoreMotifs,
      bestMotifs,
      texts.slice(1).reduce(
        (motifs, text) => [
          ...motifs,
          profileMostProbable(text, size, constructProfile(motifs, size))
        ],
        [word]
      )
    ),
    texts.map(text => text.substr(0, size))
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
