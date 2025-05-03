import { sumValues } from "./sum-values.js";

describe("sumValues", () => {
  test("should return sum of numbers", () => {
    expect(
      sumValues(
        {
          "/": { delta: 0, size: 100 },
          "/about": { delta: 20, size: 200 },
        },
        "size",
      ),
    ).toEqual(300);
  });
});
