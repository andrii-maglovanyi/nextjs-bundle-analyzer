import { type FileSizes, getFileSizes } from "./file-size.js";

export type Pages = Record<string, Array<string>>;

export interface Manifest<T> {
  pages: T;
}

interface PagesWithLayout extends Pages {
  "/layout": Array<string>;
}

const hasLayoutEntry = (
  manifest: Manifest<Pages>,
): manifest is Manifest<PagesWithLayout> => "/layout" in manifest.pages;

export const processBuildManifest = (manifest: Manifest<Pages>) => {
  if (!hasLayoutEntry(manifest)) {
    throw new Error("No layout entry in build manifest!");
  }

  const { ["/layout"]: layoutFiles, ...pages } = manifest.pages;

  const layoutFilesSize = layoutFiles.reduce(
    (files, filename) => ({ ...files, ...getFileSizes(filename) }),
    {} as FileSizes,
  );

  const jsFiles: Record<string, number> = {};
  const cssFiles: Record<string, number> = {};
  let indexLayoutSize = 0;

  for (const [filename, size] of Object.entries(layoutFilesSize)) {
    if (filename.includes("static/chunks/app/layout")) {
      indexLayoutSize = size;
    } else if (filename.endsWith(".css")) {
      cssFiles[filename] = size;
    } else if (filename.endsWith(".js")) {
      jsFiles[filename] = size;
    }
  }

  return {
    indexLayoutSize,
    layout: {
      cssFiles,
      jsFiles,
    },
    pages,
  };
};
