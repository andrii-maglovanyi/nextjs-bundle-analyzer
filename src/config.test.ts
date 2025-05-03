import { getBudget, getPrefix, setBudget, setPrefix } from "./config.js";

describe("Config", () => {
  describe("Prefix", () => {
    test("should return the default prefix initially", () => {
      expect(getPrefix()).toBe(".next");
    });

    test("should set and get the prefix correctly", () => {
      const testPrefix = ".test";
      setPrefix(testPrefix);
      expect(getPrefix()).toBe(testPrefix);
    });
  });

  describe("Budget", () => {
    test("should return the default budget initially", () => {
      expect(getBudget()).toBe(200 * 1024);
    });

    test("should set and get the budget correctly", () => {
      const testBudget = 300;

      setBudget(testBudget);
      expect(getBudget()).toBe(testBudget * 1024);
    });
  });
});
