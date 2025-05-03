import manifest from "../__fixtures__/app-build-manifest.json";
import pages from "../__fixtures__/pages.json";
import { setPrefix } from "../config.js";
import { processBuildManifest } from "./process-build-manifest.js";

describe("processBuildManifest", () => {
  beforeAll(() => {
    setPrefix("src/__fixtures__/");
  });

  test("should return the correct result", () => {
    expect(processBuildManifest(manifest)).toEqual({
      indexLayoutSize: 52,
      layout: {
        cssFiles: {
          "/static/css/css1.css": 42,
        },
        jsFiles: {
          "/static/chunks/js1.js": 49,
          "/static/chunks/js2.js": 51,
        },
      },
      pages,
    });
  });

  test("should throw an error if the manifest does not contain a layout entry", () => {
    const manifestWithoutLayout = {
      pages: {},
    };

    expect(() => processBuildManifest(manifestWithoutLayout)).toThrow(
      "No layout entry in build manifest!",
    );
  });
});
