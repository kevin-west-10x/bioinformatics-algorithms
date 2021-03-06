import { formatGraph } from "../../utilities/format";
import { constructGraph, Graph } from "../../utilities/graph";
import { assertEqual } from "../../utilities/test";

// Reduce across each pattern and add it to the adjacency list
const BA3E = (texts: string[]): Graph => constructGraph(texts);

// Test data
assertEqual(
  "BA3E",
  formatGraph(
    BA3E([
      "GAGG",
      "CAGG",
      "GGGG",
      "GGGA",
      "CAGG",
      "AGGG",
      "GGAG"
    ])
  ),
  formatGraph(
    {
      AGG: ["GGG"],
      CAG: ["AGG", "AGG"],
      GAG: ["AGG"],
      GGA: ["GAG"],
      GGG: ["GGA", "GGG"]
    }
  )
);
