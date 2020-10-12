export default <Args extends any[], Result>(fn: (...args: Args) => Result) => {
  const indices: any[] = [];
  const memoized: Record<string, Result> = {};
  return (...args: Args) => {
    const key = args.map(arg => {
      const index = indices.indexOf(arg);
      if (index >= 0) return index;
      return indices.push(arg) - 1;
    }).join("_");
    if (!memoized[key]) {
      memoized[key] = fn(...args);
    }
    return memoized[key];
  }
}
