import baseReport from "../__fixtures__/base-report.json";
import currentReport from "../__fixtures__/current-report.json";
import { getComparison } from "./get-comparison.js";

describe("get-comparison", () => {
  test("should return the size of a file", () => {
    const comparison = getComparison(baseReport, currentReport);

    expect(comparison).toEqual({
      chunks: {
        css: {
          added: {},
          changed: { "/static/css/css1.css": { delta: 31, size: 42 } },
          removed: { "/static/css/css0.css": { delta: -42, size: 42 } },
          unchanged: {},
        },
        js: {
          added: { "/static/chunks/js2.js": { delta: 48, size: 48 } },
          changed: { "/static/chunks/js1.js": { delta: -1, size: 47 } },
          removed: { "/static/chunks/js0.js": { delta: -148, size: 148 } },
          unchanged: {},
        },
      },
      pages: {
        added: { "/_not-found": { delta: 50, size: 50 } },
        changed: { "/about": { delta: 10, size: 47 } },
        removed: { "/_found": { delta: -100, size: 100 } },
        unchanged: { "/": { delta: 0, size: 96 } },
      },
    });
  });
});
