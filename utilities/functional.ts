export const repeat = <T>(times: number, fn: (arg: T) => T, initialValue: T): T => {
  let value = initialValue;
  for (let i = 0; i < times; i++) {
    value = fn(value);
  }
  return value;
}