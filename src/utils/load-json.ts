import fs from "fs";
import path from "path";

export const loadJSON = (filePath: string) => {
  const root = process.env.GITHUB_WORKSPACE || process.cwd();

  const data = fs.readFileSync(
    new URL(path.join(root, filePath), import.meta.url),
    "utf-8",
  );

  return JSON.parse(data);
};
