import { formatGraph } from "../../utilities/format";
import { constructGraph, Graph } from "../../utilities/graph";
import { assertEqual } from "../../utilities/test";
import { wordReduce } from "../../utilities/word";

// Reduce across each pattern and add it to the adjacency list
const BA3D = (text: string, size: number): Graph => constructGraph(
  wordReduce<string[]>(text, size, (edges, word) => [...edges, word], [])
);

// Test data
assertEqual(
  "BA3D",
  formatGraph(BA3D("AAGATTCTCTAC", 4)),
  formatGraph(
    {
      AAG: ["AGA"],
      AGA: ["GAT"],
      ATT: ["TTC"],
      CTA: ["TAC"],
      CTC: ["TCT"],
      GAT: ["ATT"],
      TCT: ["CTA", "CTC"],
      TTC: ["TCT"]
    }
  )
);
