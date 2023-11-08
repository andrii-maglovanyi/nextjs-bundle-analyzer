import fs from "fs";
import path from "path";
import zlib from "zlib";
import { getPrefix } from "../config.js";
export const getFileSizes = (pathToFile)=>{
    const fullPath = path.join(process.cwd(), getPrefix(), pathToFile);
    const bytes = fs.readFileSync(fullPath);
    const zippedBytes = zlib.gzipSync(bytes);
    return {
        [pathToFile]: zippedBytes.byteLength
    };
};
