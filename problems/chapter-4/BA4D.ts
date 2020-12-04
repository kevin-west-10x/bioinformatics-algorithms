import { MASSES } from "../../utilities/genetics";
import memoize from "../../utilities/memoize";
import { assertEqual } from "../../utilities/test";

const BA4D = memoize((mass: number): number => mass < 0
  ? 0
  : mass === 0
    ? 1
    : MASSES.reduce(
      (count, aminoMass) => count + BA4D(mass - aminoMass),
      0
    ));

// Test data
assertEqual(
  "BA4D",
  BA4D(1024),
  14712706211
);
