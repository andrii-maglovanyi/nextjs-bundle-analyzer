import { type FileSizes } from "../utils/file-size.js";
import { getPageSizes } from "../utils/page-sizes.js";
import {
  type Manifest,
  type Pages,
  processBuildManifest,
} from "../utils/process-build-manifest.js";

export interface Report {
  pages: FileSizes;
  chunks: {
    js: FileSizes;
    css: FileSizes;
  };
}

export const getAnalysis = (manifest: Manifest<Pages>): Report => {
  const { layout, pages } = processBuildManifest(manifest);

  const fileToExclude = Object.keys(layout.jsFiles);

  // Don't include the common files in the page sizes
  const pagesWithExcludedFiles = Object.entries(pages).reduce(
    (acc, [page, files]) => ({
      ...acc,
      [page]: files.filter((file) => !fileToExclude.includes(file)),
    }),
    {},
  );

  const pageSizes = getPageSizes(pagesWithExcludedFiles);

  return {
    chunks: {
      css: layout.cssFiles,
      js: layout.jsFiles,
    },
    pages: pageSizes,
  };
};
