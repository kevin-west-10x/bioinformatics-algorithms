import { repeat } from "../../utilities/functional";
import { assertEqual } from "../../utilities/test";

const BA5A = (money: number, coins: number[]): number => repeat<number[]>(
  money + 1,
  (arr, i) => arr[i] === undefined ? [...arr, Math.min(...coins.filter(coin => coin <= i).map(coin => arr[i - coin] + 1))] : arr,
  [0]
)[money];

// Test data
assertEqual(
  "BA5A",
  BA5A(40, [1, 5, 10, 20, 25, 50]),
  2
);
