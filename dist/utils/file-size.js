import fs from "fs";
import path from "path";
import zlib from "zlib";
import { getPrefix } from "../config.js";
export const getFileSizes = (pathToFile)=>{
    console.log("CWD", process.cwd());
    console.log("PREFIX", getPrefix());
    console.log("PATH", pathToFile);
    const fullPath = path.join(process.cwd(), getPrefix(), pathToFile);
    const bytes = fs.readFileSync(fullPath);
    const zippedBytes = zlib.gzipSync(bytes);
    return {
        [pathToFile]: zippedBytes.byteLength
    };
};
