import { type FileSizes, getFileSizes } from "./file-size.js";

export type Pages = Record<string, Array<string>>;

export interface Manifest<T> {
  pages: T;
}

export interface LayoutInfo {
  layoutSize: number;
  cssFiles: Record<string, number>;
  jsFiles: Record<string, number>;
}

export const processBuildManifest = (manifest: Manifest<Pages>) => {
  const layoutEntries = Object.entries(manifest.pages).filter(([key]) =>
    key.endsWith("/layout"),
  );

  if (layoutEntries.length === 0) {
    throw new Error("No layout entries in build manifest!");
  }

  const layouts = layoutEntries.reduce(
    (acc, [layoutKey, layoutFiles]) => {
      const layoutFilesSize = layoutFiles.reduce(
        (files, filename) => ({ ...files, ...getFileSizes(filename) }),
        {} as FileSizes,
      );

      const jsFiles: Record<string, number> = {};
      const cssFiles: Record<string, number> = {};
      let layoutSize = 0;

      for (const [filename, size] of Object.entries(layoutFilesSize)) {
        if (filename.includes("/layout")) {
          layoutSize = size;
        } else if (filename.endsWith(".css")) {
          cssFiles[filename] = size;
        } else if (filename.endsWith(".js")) {
          jsFiles[filename] = size;
        }
      }

      acc[layoutKey] = {
        cssFiles,
        jsFiles,
        layoutSize,
      };

      return acc;
    },
    {} as Record<string, LayoutInfo>,
  );

  const pages = Object.fromEntries(
    Object.entries(manifest.pages).filter(([key]) => !key.endsWith("/layout")),
  );

  return {
    layouts,
    pages,
  };
};
