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
import { formatBytes } from "../utils/format-bytes.js";
const getDelta = ({ added, changed, removed })=>Object.values(_object_spread({}, added, changed, removed)).reduce((total, { delta })=>total + delta, 0);
const getBaseSize = ({ changed, unchanged, removed })=>{
    const sizeWithChangeDelta = Object.values(_object_spread({}, changed, unchanged, removed)).reduce((total, { size })=>total + size, 0);
    const changeDelta = Object.values(changed).reduce((total, { delta })=>total + delta, 0);
    return sizeWithChangeDelta - changeDelta;
};
export const getDeltaSummary = (comparison)=>{
    const pagesSize = getBaseSize(comparison.pages);
    const jsSize = getBaseSize(comparison.chunks.js);
    const cssSize = getBaseSize(comparison.chunks.css);
    const pagesDelta = getDelta(comparison.pages);
    const jsDelta = getDelta(comparison.chunks.js);
    const cssDelta = getDelta(comparison.chunks.css);
    const totalDelta = pagesDelta + jsDelta + cssDelta;
    const totalBaseSize = pagesSize + jsSize + cssSize;
    const sign = totalDelta < 0 ? "-" : "+";
    const percent = totalDelta && totalBaseSize ? totalDelta / totalBaseSize : totalBaseSize ? 0 : 1;
    const sizeChangeInPct = totalDelta ? ` (${sign}${Math.abs(percent * 100).toFixed(2)}%)` : "";
    const sizeStats = `${formatBytes(totalDelta, true)}${sizeChangeInPct}`;
    if (totalDelta === 0) return "🤔 Total bundle size unchanged";
    return totalDelta < 0 ? `🎉 Total bundle size decreased \`${sizeStats}\`` : `💥 Total bundle size increased \`${sizeStats}\``;
};
