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
import { getBudget } from "../config.js";
import { getDeltaSummary } from "../render/get-delta-summary.js";
import { getFilesSummary } from "../render/get-files-summary.js";
import { getTableRows } from "../render/get-table-rows.js";
import { formatBytes } from "./format-bytes.js";
import { getSum } from "./get-sum.js";
const budget = getBudget();
const getPercentage = (size)=>(size / budget * 100).toFixed(2);
const getDetails = (size, delta, totalChunksSize)=>{
    if (!totalChunksSize) return [
        "",
        ""
    ];
    const totalSize = size + totalChunksSize;
    const percentageChange = delta ? ` (${getPercentage(delta)}%)` : "";
    return [
        formatBytes(totalSize),
        `${getPercentage(size + totalSize)}% ${percentageChange}`
    ];
};
const addedEntries = (entries, totalChunksSize)=>getTableRows(entries, (title, size, delta)=>[
            "+",
            title,
            `${formatBytes(size)}`,
            ...getDetails(size, 0, totalChunksSize)
        ]);
const changedEntries = (entries, totalChunksSize)=>getTableRows(entries, (title, size, delta)=>[
            "±",
            title,
            `${formatBytes(size)} (${formatBytes(delta, true)})`,
            ...getDetails(size, delta, totalChunksSize)
        ]);
const unchangedEntries = (entries, totalChunksSize)=>getTableRows(entries, (title, size)=>[
            "",
            title,
            formatBytes(size),
            ...getDetails(size, 0, totalChunksSize)
        ]);
const removedEntries = (entries)=>getTableRows(entries, (title, size, delta)=>[
            "−",
            title,
            `${formatBytes(size)}`
        ]);
export const renderReport = (comparison)=>{
    const { pages, chunks } = comparison;
    const { js, css } = chunks;
    const totalJSChunksSize = getSum(_object_spread({}, js.added, js.changed, js.unchanged), "size");
    const totalCSSChunksSize = getSum(_object_spread({}, css.added, css.changed, css.unchanged), "size");
    return `# Bundle Size Report

${[
        getDeltaSummary(comparison),
        getFilesSummary(pages)
    ].join("\\\n")}

|| Route | Size | Total size | % of Budget (\`${formatBytes(budget)}\`) |
| :---: | :--- | :--- | ---: | :--- |
${[
        addedEntries(pages.added, totalJSChunksSize),
        changedEntries(pages.changed, totalJSChunksSize),
        unchangedEntries(pages.unchanged, totalJSChunksSize),
        removedEntries(pages.removed)
    ].filter((item)=>item).join("\n")}

<details>
<summary>JS shared by all pages <code>${formatBytes(totalJSChunksSize)}</code></summary>


${getFilesSummary(js)}
|| Chunk file name | Size |
| :---: | :--- | :--- |
${[
        addedEntries(js.added),
        changedEntries(js.changed),
        unchangedEntries(js.unchanged),
        removedEntries(js.removed)
    ].filter((item)=>item).join("\n")}

</details>

<details>
<summary>CSS shared by all pages <code>${formatBytes(totalCSSChunksSize)}</code></summary>


${getFilesSummary(css)}
|| Chunk file name | Size |
| :---: | :--- | :--- |
${[
        addedEntries(css.added),
        changedEntries(css.changed),
        unchangedEntries(css.unchanged),
        removedEntries(css.removed)
    ].filter((item)=>item).join("\n")}

</details>

<!-- GH NBA -->`;
};
