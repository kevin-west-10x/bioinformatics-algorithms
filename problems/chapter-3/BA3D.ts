import { formatGraph } from "../../utilities/format";
import { Graph } from "../../utilities/graph";
import { prefix, suffix } from "../../utilities/pattern";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

// Reduce across each pattern and add it to the adjacency list
const BA3D = (text: string, size: number): Graph => wordReduce<Graph>(
  text,
  size,
  (graph, word) => [...graph, [prefix(word), suffix(word)]],
  []
);

// Test data
assertEqual(
  "BA3D",
  formatGraph(BA3D("AAGATTCTCTAC", 4)),
  formatGraph(
    [
      ["AAG", "AGA"],
      ["AGA", "GAT"],
      ["ATT", "TTC"],
      ["CTA", "TAC"],
      ["CTC", "TCT"],
      ["GAT", "ATT"],
      ["TCT", "CTA"],
      ["TCT", "CTC"],
      ["TTC", "TCT"]
    ]
  )
);
