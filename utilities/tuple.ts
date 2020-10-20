export type Tuple<Size extends number, T> = Size extends 0 ? never[] : {
  0: T;
  length: Size;
} & Array<T>;
