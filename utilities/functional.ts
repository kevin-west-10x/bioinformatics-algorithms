export const repeat = <T>(times: number, fn: (arg: T) => T, initialValue: T): T => {
  let value = initialValue;
  for (let i = 0; i < times; i++) {
    value = fn(value);
  }
  return value;
}

export const accumulate = <T extends Record<any, any>, Key extends keyof T>(
  record: T,
  key: Key,
  accumulator: (current: T[Key]) => T[Key],
  initial: T[Key]
): T => {
  record[key] = accumulator(record[key] || initial)
  return record;
}
