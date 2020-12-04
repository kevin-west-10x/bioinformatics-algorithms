import { doWhile } from "../../utilities/functional";
import { MASSES, massOf, MassPeptide, peptideScore } from "../../utilities/genetics";
import { pickMax, pickMaxN } from "../../utilities/pick";
import { assertEqual } from "../../utilities/test";

interface LeaderBoard {
  board: MassPeptide[];
  leader: MassPeptide;
}

const BA4G = (spectrum: number[], numCandidates: number): MassPeptide => (
  (score: (peptide: MassPeptide) => number) => {
    return doWhile<LeaderBoard>(
      ({ board }) => board.length > 0,
      ({ board, leader }) => (
        (board: MassPeptide[]) => ({
          board,
          leader: pickMax(score, leader, ...board)
        })
      )(pickMaxN(
        score,
        numCandidates,
        ...board
          .reduce<MassPeptide[]>(
            (board, candidate) => [...board, ...MASSES.map(mass => [...candidate, mass])],
            []
          )
          .filter(peptide => massOf(peptide) <= spectrum[spectrum.length - 1])
        )
      ),
      {
        board: [[]],
        leader: []
      }
    ).leader;
  }
)(peptide => peptideScore(peptide, spectrum));

// Test data
assertEqual(
  "BA4G",
  BA4G("0 71 113 129 147 200 218 260 313 331 347 389 460".split(" ").map(str => parseInt(str)), 10).join("-"),
  "71-147-113-129"
);
