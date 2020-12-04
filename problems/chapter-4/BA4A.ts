import { AminoPeptide, textToPeptide } from "../../utilities/genetics";
import { assertEqual } from "../../utilities/test";

const BA4A = (text: string): AminoPeptide => textToPeptide(text);

// Test data
assertEqual(
  "BA4A",
  BA4A("AUGGCCAUGGCGCCCAGAACUGAGAUCAAUAGUACCCGUAUUAACGGGUGA").join(""),
  "MAMAPRTEINSTRING"
);
