import baseReport from "../__fixtures__/base-report.json";
import currentReport from "../__fixtures__/current-report.json";
import { getComparison } from "./get-comparison.js";

describe("getComparison", () => {
  test("should return the size of a file", () => {
    const comparison = getComparison(baseReport, currentReport);

    expect(comparison).toEqual({
      chunks: {
        css: {
          added: {},
          changed: {
            "/static/css/css1.css": { delta: 31, size: 42 },
            "/static/css/css2.css": { delta: 32, size: 44 },
          },
          removed: { "/static/css/css0.css": { delta: -42, size: 42 } },
          unchanged: {},
        },
        js: {
          added: {
            "/static/chunks/js2.js": { delta: 51, size: 51 },
            "/static/chunks/js4.js": { delta: 69, size: 69 },
          },
          changed: { "/static/chunks/js1.js": { delta: 2, size: 50 } },
          removed: { "/static/chunks/js0.js": { delta: -148, size: 148 } },
          unchanged: {},
        },
      },
      pages: {
        added: {
          "/_not-found": { delta: 53, size: 53 },
          "/admin": { delta: 101, size: 101 },
        },
        changed: { "/about": { delta: 13, size: 50 } },
        removed: { "/_found": { delta: -100, size: 100 } },
        unchanged: { "/": { delta: 0, size: 98 } },
      },
    });
  });
});
