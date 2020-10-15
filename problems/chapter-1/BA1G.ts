import hammingDistance from "../../utilities/hammingDistance";
import { assertEqual } from "../../utilities/test";

// Just call hammingDistance helper.
const BA1G = (str1: string, str2: string) => hammingDistance(str1, str2);

// Test data
assertEqual(
  "BA1G",
  BA1G("GGGCCGTTGGT", "GGACCGTTGAC"),
  3
);