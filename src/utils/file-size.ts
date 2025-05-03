import fs from "fs";
import path from "path";
import zlib from "zlib";

import { getPrefix } from "../config.js";

export interface FileSizes {
  [filename: string]: number;
}

export const getFileSizes = (pathToFile: string): FileSizes => {
  const fullPath = path.join(process.cwd(), getPrefix(), pathToFile);
  const bytes = fs.readFileSync(fullPath);
  const zippedBytes = zlib.gzipSync(bytes, {
    level: zlib.constants.Z_BEST_COMPRESSION,
    memLevel: 9,
    strategy: zlib.constants.Z_DEFAULT_STRATEGY,
  });

  return { [pathToFile]: zippedBytes.byteLength };
};
