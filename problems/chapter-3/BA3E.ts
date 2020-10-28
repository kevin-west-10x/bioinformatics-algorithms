import { formatGraph } from "../../utilities/format";
import { Graph } from "../../utilities/graph";
import { prefix, suffix } from "../../utilities/pattern";
import { assertEqual } from "../../utilities/test";

// Reduce across each pattern and add it to the adjacency list
const BA3E = (texts: string[]): Graph => texts.reduce<Graph>(
  (graph, text) => [...graph, [prefix(text), suffix(text)]],
  []
);

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
    [
      ["AGG", "GGG"],
      ["CAG", "AGG"],
      ["CAG", "AGG"],
      ["GAG", "AGG"],
      ["GGA", "GAG"],
      ["GGG", "GGA"],
      ["GGG", "GGG"]
    ]
  )
);
