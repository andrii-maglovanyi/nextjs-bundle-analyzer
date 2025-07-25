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
  const { layouts, pages } = processBuildManifest(manifest);

  const combinedJsFiles: FileSizes = {};
  const combinedCssFiles: FileSizes = {};

  Object.values(layouts).forEach((layout) => {
    Object.assign(combinedJsFiles, layout.jsFiles);
    Object.assign(combinedCssFiles, layout.cssFiles);
  });

  const fileToExclude = Object.keys(combinedJsFiles);

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
      css: combinedCssFiles,
      js: combinedJsFiles,
    },
    pages: pageSizes,
  };
};
