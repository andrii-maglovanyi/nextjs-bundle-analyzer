import { readdir } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the current file path from import.meta.url
const __filename = fileURLToPath(import.meta.url);

// Get the current directory path
const __dirname = dirname(__filename);

async function listFiles() {
  try {
    const files = await readdir(__dirname);
    for (const file of files) {
      console.log(file);
    }
  } catch (err) {
    console.error("Error reading directory", err);
  }
}

listFiles();
