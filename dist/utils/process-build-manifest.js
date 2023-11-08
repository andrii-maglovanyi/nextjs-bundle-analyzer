function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function _object_without_properties(source, excluded) {
    if (source == null) return {};
    var target = _object_without_properties_loose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _object_without_properties_loose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
import { getFileSizes } from "./file-size.js";
const hasLayoutEntry = (manifest)=>"/layout" in manifest.pages;
export const processBuildManifest = (manifest)=>{
    if (!hasLayoutEntry(manifest)) {
        throw new Error("No layout entry in build manifest!");
    }
    const _manifest_pages = manifest.pages, { ["/layout"]: layoutFiles } = _manifest_pages, pages = _object_without_properties(_manifest_pages, [
        "/layout"
    ]);
    const layoutFilesSize = layoutFiles.reduce((files, filename)=>_object_spread({}, files, getFileSizes(filename)), {});
    const jsFiles = {};
    const cssFiles = {};
    let indexLayoutSize = 0;
    for (const [filename, size] of Object.entries(layoutFilesSize)){
        if (filename.includes("static/chunks/app/layout")) {
            indexLayoutSize = size;
        } else if (filename.endsWith(".css")) {
            cssFiles[filename] = size;
        } else if (filename.endsWith(".js")) {
            jsFiles[filename] = size;
        }
    }
    return {
        layout: {
            jsFiles,
            cssFiles
        },
        indexLayoutSize,
        pages
    };
};
