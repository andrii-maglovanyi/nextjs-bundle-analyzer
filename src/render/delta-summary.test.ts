import { type ComparisonReport } from "../steps/get-comparison.js";
import { getDeltaSummary } from "./delta-summary.js";

describe("getDeltaSummary", () => {
  let comparison: ComparisonReport;

  const emptyStats = {
    added: {},
    changed: {},
    removed: {},
    unchanged: {},
  };

  const initializeComparison = () => ({
    chunks: {
      css: { ...emptyStats },
      js: { ...emptyStats },
    },
    pages: { ...emptyStats },
  });

  beforeEach(() => {
    comparison = initializeComparison();
  });

  test("should return stats for added file", () => {
    comparison.pages = {
      ...comparison.pages,
      added: { "/_not-found": { delta: 50, size: 50 } },
    };

    expect(getDeltaSummary(comparison)).toEqual(
      "🏋️ Total bundle size increased `+50B (+100.00%)`",
    );
  });

  test("should return stats for changed file", () => {
    comparison.pages = {
      ...comparison.pages,
      changed: { "/about": { delta: 10, size: 47 } },
    };

    expect(getDeltaSummary(comparison)).toEqual(
      "🏋️ Total bundle size increased `+10B (+27.03%)`",
    );
  });

  test("should return stats for removed file", () => {
    comparison.pages = {
      ...comparison.pages,
      removed: { "/_found": { delta: -204, size: 204 } },
    };

    expect(getDeltaSummary(comparison)).toEqual(
      "🎉 Total bundle size decreased `-204B (-100.00%)`",
    );
  });

  test("should return stats for unchanged file", () => {
    comparison.pages = {
      ...comparison.pages,
      unchanged: { "/": { delta: 0, size: 96 } },
    };

    expect(getDeltaSummary(comparison)).toEqual(
      "🤔 Total bundle size unchanged",
    );
  });

  test("should return stats for multiple pages", () => {
    comparison.pages = {
      ...comparison.pages,
      added: { "/_not-found": { delta: 50, size: 50 } },
      changed: { "/about": { delta: 10, size: 47 } },
      removed: { "/_found": { delta: -204, size: 204 } },
      unchanged: { "/": { delta: 0, size: 96 } },
    };

    expect(getDeltaSummary(comparison)).toEqual(
      "🎉 Total bundle size decreased `-144B (-42.73%)`",
    );
  });

  test("should return stats for multiple chunks", () => {
    comparison.chunks = {
      ...comparison.chunks,
      css: {
        ...emptyStats,
        added: { "main.css": { delta: 60, size: 60 } },
        changed: { "about.css": { delta: 22, size: 32 } },
        removed: { "found.css": { delta: -24, size: 24 } },
        unchanged: { "index.css": { delta: 0, size: 11 } },
      },
      js: {
        ...emptyStats,
        added: { "main.js": { delta: 50, size: 50 } },
        changed: { "about.js": { delta: 10, size: 47 } },
        removed: { "found.js": { delta: -204, size: 204 } },
        unchanged: { "index.js": { delta: 0, size: 96 } },
      },
    };

    expect(getDeltaSummary(comparison)).toEqual(
      "🎉 Total bundle size decreased `-86B (-22.51%)`",
    );
  });

  test("should return stats for multiple pages and chunks", () => {
    comparison.pages = {
      ...comparison.pages,
      added: { "/_not-found": { delta: 1250, size: 1250 } },
      changed: { "/about": { delta: 500, size: 1004 } },
      removed: { "/_found": { delta: -11, size: 11 } },
      unchanged: { "/": { delta: 0, size: 2048 } },
    };

    comparison.chunks = {
      ...comparison.chunks,
      css: {
        ...emptyStats,
        added: { "main.css": { delta: 55, size: 55 } },
        changed: { "about.css": { delta: 30, size: 60 } },
        removed: { "found.css": { delta: -54, size: 54 } },
        unchanged: { "index.css": { delta: 0, size: 888 } },
      },
      js: {
        ...emptyStats,
        added: { "main.js": { delta: 140, size: 140 } },
        changed: { "about.js": { delta: 10, size: 37 } },
        removed: { "found.js": { delta: -1, size: 1 } },
        unchanged: { "index.js": { delta: 0, size: 100 } },
      },
    };

    expect(getDeltaSummary(comparison)).toEqual(
      "🏋️ Total bundle size increased `+1.87KB (+52.39%)`",
    );
  });

  test("should return stats for multiple pages and chunks with no changes", () => {
    comparison.pages = {
      ...comparison.pages,
      unchanged: { "/": { delta: 0, size: 2048 } },
    };

    comparison.chunks = {
      ...comparison.chunks,
      css: {
        ...emptyStats,
        unchanged: { "index.css": { delta: 0, size: 888 } },
      },
      js: {
        ...emptyStats,
        unchanged: { "index.js": { delta: 0, size: 100 } },
      },
    };

    expect(getDeltaSummary(comparison)).toEqual(
      "🤔 Total bundle size unchanged",
    );
  });

  test("should handle large data sets correctly", () => {
    // Generate a large data set
    for (let i = 0; i < 10000; i++) {
      comparison.pages.added[`/page${i}`] = { delta: 1, size: 1 };
      comparison.chunks.js.added[`chunk${i}.js`] = { delta: 1, size: 1 };
    }

    expect(getDeltaSummary(comparison)).toMatch(
      "🏋️ Total bundle size increased",
    );
  });
});
