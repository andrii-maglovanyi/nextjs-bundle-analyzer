import fs from "fs";
export const loadJSON = (path)=>{
    const data = fs.readFileSync(new URL(path, import.meta.url), "utf-8");
    return JSON.parse(data);
};
