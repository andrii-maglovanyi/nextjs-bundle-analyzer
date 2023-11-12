import { getSum } from "./get-sum.js";

describe("get-sum", () => {
  test("should return sum of numbers", () => {
    expect(
      getSum(
        {
          "/": { delta: 0, size: 100 },
          "/about": { delta: 20, size: 200 },
        },
        "size",
      ),
    ).toEqual(300);
  });
});
