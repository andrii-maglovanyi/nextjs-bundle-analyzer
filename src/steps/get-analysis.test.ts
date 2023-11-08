import { getAnalysis } from "./get-analysis.js";

import manifest from "../__fixtures__/app-build-manifest.json";
import currentReport from "../__fixtures__/current-report.json";
import { setPrefix } from "../config.js";

describe("get-analysis", () => {
  beforeAll(() => {
    setPrefix("src/__fixtures__/");
  });

  test("should return the size of a file", () => {
    const analysisResult = getAnalysis(manifest);
    expect(analysisResult).toEqual(currentReport);
  });
});
