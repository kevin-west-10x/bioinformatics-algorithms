export const assertEqual = <Type>(name: string, result: Type, ...expected: Type[]) => {
  if (expected.every(value => value !== result)) {
    console.error(`${name}: ${result} !== ${expected}`);
  } else {
    console.log(`${name}: Test Passed`);
  }
}