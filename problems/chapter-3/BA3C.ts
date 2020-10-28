import { formatGraph } from "../../utilities/format";
import { constructOverlapGraph, Graph } from "../../utilities/graph";
import { assertEqual } from "../../utilities/test";

// Reduce across each pattern and add it to the adjacency list
const BA3C = (patterns: string[]): Graph => constructOverlapGraph(patterns);

// Test data
assertEqual(
  "BA3C",
  formatGraph(
    BA3C(
      [
        "ATGCG",
        "GCATG",
        "CATGC",
        "AGGCA",
        "GGCAT"
      ]
    )
  ),
  formatGraph(
    {
      AGGCA: ["GGCAT"],
      CATGC: ["ATGCG"],
      GCATG: ["CATGC"],
      GGCAT: ["GCATG"]
    }
  )
);
