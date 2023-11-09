const fs = require("fs");
const path = require("path");

// The path to the current directory
const directoryPath = path.join(__dirname);

try {
  // Synchronously read the directory contents
  const files = fs.readdirSync(directoryPath);

  // Listing all files
  files.forEach((file: any) => {
    console.log(file);
  });
} catch (err) {
  console.log("Unable to scan directory: " + err);
}
