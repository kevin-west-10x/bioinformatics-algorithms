export const repeat = <T>(times: number, fn: (arg: T, index: number) => T, initialValue: T): T => {
  let value = initialValue;
  for (let i = 0; i < times; i++) {
    value = fn(value, i);
  }
  return value;
}

type DoWhileCondition<T, S extends T = T> = T extends S ? (arg: T) => boolean : (arg: T) => arg is S;

export const doWhile = <T, S extends T = T>(condition: DoWhileCondition<T, S>, fn: (arg: S) => T, initialValue: T): T => {
  let value = initialValue;
  while (condition(value)) {
    value = fn(value);
  }
  return value;
}

export const accumulate = <T extends Record<any, any>, Key extends keyof T = keyof T>(
  record: T,
  key: Key | Key[],
  accumulator: (current: T[Key]) => T[Key],
  initial: T[Key]
): T => {
  const keys = key instanceof Array ? key : [key];
  keys.forEach(key => record[key] = accumulator(record[key] || initial));
  return record;
}
