import reverseComplement from "../../utilities/reverseComplement";
import { assertEqual } from "../../utilities/test";

// Just call reverseComplement helper.
const BA1C = (text: string) => reverseComplement(text);

// Test data
assertEqual(BA1C("AAAACCCGGT"), "ACCGGGTTTT");