import { constructPath } from "../../utilities/cycle";
import { constructGraph } from "../../utilities/graph";
import neighbors from "../../utilities/neighbors";
import { assertEqual } from "../../utilities/test";

const BA3I = (size: number): string => constructPath(
  constructGraph(
    neighbors(new Array(size).fill("0").join(""), size, ["0", "1"])
  )
).reduce(
  (text, pattern) => text + pattern[pattern.length - 1],
  ""
);

// Test data
assertEqual(
  "BA3I",
  BA3I(4),
  "1011000010100111",
);
