export const pivot = (cycle: string[], on: string): string[] => (
  (index: number) => [...cycle.slice(index, -1), ...cycle.slice(0, index), on]
)(cycle.indexOf(on));
