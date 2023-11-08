import { getFileSizes } from "./file-size.js";
import { type Pages } from "./process-build-manifest.js";

export const getPageSizes = (pages: Pages) =>
  Object.entries(pages).reduce((acc, [page, files]) => {
    const size = files
      .map((filename) => getFileSizes(filename)[filename])
      .reduce((s, b) => s + b, 0);

    return { ...acc, [page.replace("/page", "") || "/"]: size };
  }, {});
