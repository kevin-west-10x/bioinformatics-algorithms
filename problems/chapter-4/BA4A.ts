import { textToPeptide } from "../../utilities/genetics";
import { assertEqual } from "../../utilities/test";

const BA4A = (text: string): string => textToPeptide(text);

// Test data
assertEqual(
  "BA4A",
  BA4A("AUGGCCAUGGCGCCCAGAACUGAGAUCAAUAGUACCCGUAUUAACGGGUGA"),
  "MAMAPRTEINSTRING"
);
