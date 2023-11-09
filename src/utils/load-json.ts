import fs from "fs";
import path from "path";

export const loadJSON = (filePath: string) => {
  const data = fs.readFileSync(
    new URL(
      path.join(process.env.GITHUB_WORKSPACE!, filePath),
      import.meta.url
    ),
    "utf-8"
  );

  return JSON.parse(data);
};
