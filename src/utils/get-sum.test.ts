import { getSum } from "./get-sum.js";

describe("get-sum", () => {
  test("should return sum of numbers", () => {
    expect(
      getSum(
        {
          "/": { size: 100, delta: 0 },
          "/about": { size: 200, delta: 20 },
        },
        "size"
      )
    ).toEqual(300);
  });
});
