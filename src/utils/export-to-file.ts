import fs from "fs";
import path from "path";

export const exportToFile =
  (dirPath: string, fileName: string) => (data: string) => {
    const root = process.env.GITHUB_WORKSPACE || process.cwd();

    const outDir = path.join(root, dirPath);
    const outFile = path.join(outDir, fileName);

    try {
      fs.mkdirSync(outDir);
    } catch (e) {
      // Ignore (dir exists)
    }

    fs.writeFileSync(outFile, data);
  };
