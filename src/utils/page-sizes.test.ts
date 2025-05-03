import pages from "../__fixtures__/pages.json";
import { setPrefix } from "../config.js";
import { getPageSizes } from "./page-sizes.js";

describe("getPageSizes", () => {
  beforeAll(() => {
    setPrefix("src/__fixtures__/");
  });

  test("should return the size of each page", () => {
    const sizes = getPageSizes(pages);
    expect(sizes).toEqual({ "/": 199, "/_not-found": 154, "/about": 151 });
  });

  test("should handle empty pages object", () => {
    const sizes = getPageSizes({});
    expect(sizes).toEqual({});
  });
});
