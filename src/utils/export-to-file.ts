import fs from "fs";
import path from "path";
import { getPrefix } from "../config.js";

export const exportToFile =
  (dirname: string, filename: string) => (data: string) => {
    const outDir = path.join(process.cwd(), getPrefix(), dirname);
    const outFile = path.join(outDir, filename);

    try {
      fs.mkdirSync(outDir);
    } catch (e) {
      // Ignore (dir exists)
    }

    fs.writeFileSync(outFile, data);
  };
