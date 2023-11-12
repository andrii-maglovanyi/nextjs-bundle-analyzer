import pages from "../__fixtures__/pages.json";
import { setPrefix } from "../config.js";
import { getPageSizes } from "./page-sizes.js";

describe("page-sizes", () => {
  beforeAll(() => {
    setPrefix("src/__fixtures__/");
  });

  test("should return the size of each page", () => {
    const sizes = getPageSizes(pages);
    expect(sizes).toEqual({ "/": 191, "/_not-found": 145, "/about": 142 });
  });
});
