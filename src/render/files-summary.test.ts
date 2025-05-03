import { getFilesSummary } from "./files-summary.js";

describe("getFilesSummary", () => {
  test("should return one added, one changed and one removed files", () => {
    const comparison = {
      added: { "/static/chunks/js2.js": { delta: 48, size: 48 } },
      changed: { "/static/chunks/js1.js": { delta: -1, size: 47 } },
      removed: { "/static/chunks/js0.js": { delta: -148, size: 148 } },
      unchanged: {},
    };

    const result = getFilesSummary(comparison);

    expect(result).toEqual("📦 `1` new, `1` changed and `1` deleted files");
  });

  test("should return zero added, changed and removed files", () => {
    const comparison = {
      added: {},
      changed: {},
      removed: {},
      unchanged: {},
    };

    const result = getFilesSummary(comparison);

    expect(result).toEqual("📦 `0` new, `0` changed and `0` deleted files");
  });

  test("should return one added, zero changed and zero removed files", () => {
    const comparison = {
      added: { "/static/chunks/js2.js": { delta: 48, size: 48 } },
      changed: {},
      removed: {},
      unchanged: {},
    };

    const result = getFilesSummary(comparison);

    expect(result).toEqual("📦 `1` new, `0` changed and `0` deleted files");
  });

  test("should return zero added, one changed and zero removed files", () => {
    const comparison = {
      added: {},
      changed: { "/static/chunks/js1.js": { delta: -1, size: 47 } },
      removed: {},
      unchanged: {},
    };

    const result = getFilesSummary(comparison, "pages");

    expect(result).toEqual("📄 `0` new, `1` changed and `0` deleted pages");
  });
});
