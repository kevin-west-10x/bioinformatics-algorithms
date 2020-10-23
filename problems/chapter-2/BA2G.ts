import { incrementCounts } from "../../utilities/frequency";
import { repeat } from "../../utilities/functional";
import { scoreMotifs } from "../../utilities/motif";
import { pickMin } from "../../utilities/pick";
import { constructProfile, patternProbability } from "../../utilities/profile";
import { randomIndexWeighted, randomInt, selectRandom } from "../../utilities/random";
import { parseInput } from "../../utilities/string";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

// Gibbs Sampler search
const BA2G = (texts: string[], size: number, iterations: number): string[] => {
  const searchFn = () => repeat(
    iterations,
    curr => {
      const index = randomInt(curr.length);
      const profile = constructProfile(curr.filter((_, i) => i !== index), size);
      const probabilities = wordReduce<number[]>(
        texts[index],
        size,
        (probabilities, word) => [...probabilities, patternProbability(word, profile)],
        []
      );
      const randomIndex = randomIndexWeighted(...probabilities);
      const next = curr.map((motif, i) => i === index ? texts[i].substr(randomIndex, size) : motif);
      return scoreMotifs(next) <= scoreMotifs(curr) ? next : curr;
    },
    texts.map(text => selectRandom(text, size))
  );

  return repeat(
    19,
    bestMotifs => pickMin(
      scoreMotifs,
      bestMotifs,
      searchFn()
    ),
    searchFn()
  )
}

// Test data
assertEqual(
  "BA2G",
  BA2G(
    [
      "CGCCCCTCTCGGGGGTGTTCAGTAAACGGCCA",
      "GGGCGAGGTATGTGTAAGTGCCAAGGTGCCAG",
      "TAGTACCGAGACCGAAAGAAGTATACAGGCGT",
      "TAGATCAAGTTTCAGGTGCACGTCGGTGAACC",
      "AATCCACCAGCTCCACGTGCAATGTTGGCCTA"
    ],
    8,
    100
  ).join(" "),
  "TCTCGGGG CCAAGGTG TACAGGCG TTCAGGTG TCCACGTG"
);
