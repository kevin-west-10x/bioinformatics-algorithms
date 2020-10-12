export const assertEqual = <Type>(result: Type, expected: Type) => {
  if (result !== expected) {
    console.error(`${result} !== ${expected}`);
  } else {
    console.log("Test Passed");
  }
}