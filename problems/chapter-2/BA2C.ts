import { NumberTuple, Profile, profileMostProbable } from "../../utilities/profile";
import { assertEqual } from "../../utilities/test";

// Reduce across all patterns of `size` and when finding a greater probability pick that one
const BA2C = <Size extends number, T extends NumberTuple<Size>>(text: string, size: Size, profile: Profile<Size, T>): string =>
  profileMostProbable(text, size, profile);

// Test data
assertEqual(
  "BA2C",
  BA2C(
    "ACCTGTTTATTGCCTAAGTTCCGAACAAACCCAATATAGCCCGAGGGCCT",
    5,
    [
      [0.2, 0.2, 0.3, 0.2, 0.3],
      [0.4, 0.3, 0.1, 0.5, 0.1],
      [0.3, 0.3, 0.5, 0.2, 0.4],
      [0.1, 0.2, 0.1, 0.1, 0.2]
    ]
  ),
  "CCGAG"
);
