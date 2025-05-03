import { getBudget } from "../config.js";
import { getDeltaSummary } from "../render/delta-summary.js";
import { getFilesSummary } from "../render/files-summary.js";
import { getTableRows } from "../render/get-table-rows.js";
import {
  ComparisonReport,
  type FileSizeInfo,
} from "../steps/get-comparison.js";
import { formatBytes } from "./format-bytes.js";
import { sumValues } from "./sum-values.js";

const getPercentage = (size: number) => ((size / getBudget()) * 100).toFixed(2);

const getDetails = (size: number, delta: number, totalChunksSize?: number) => {
  if (!totalChunksSize) return ["", ""];

  const totalSize = size + totalChunksSize;
  const sign = delta > 0 ? "+" : "";
  const percentageChange = delta ? ` (${sign}${getPercentage(delta)}%)` : "";

  return [
    formatBytes(totalSize),
    `${getPercentage(size + totalSize)}% ${percentageChange}`,
  ];
};

const addedEntries = (
  entries: Record<string, FileSizeInfo>,
  totalChunksSize?: number,
) =>
  getTableRows(entries, (title: string, size: number) => [
    "+",
    title,
    `+${formatBytes(size)}`,
    ...getDetails(size, 0, totalChunksSize),
  ]);

const changedEntries = (
  entries: Record<string, FileSizeInfo>,
  totalChunksSize?: number,
) =>
  getTableRows(entries, (title: string, size: number, delta: number) => [
    "±",
    title,
    `${formatBytes(size)} (${formatBytes(delta, true)})`,
    ...getDetails(size, delta, totalChunksSize),
  ]);

const unchangedEntries = (
  entries: Record<string, FileSizeInfo>,
  totalChunksSize?: number,
) =>
  getTableRows(entries, (title: string, size: number) => [
    "",
    title,
    formatBytes(size),
    ...getDetails(size, 0, totalChunksSize),
  ]);

const removedEntries = (entries: Record<string, FileSizeInfo>) =>
  getTableRows(entries, (title: string, size: number) => [
    "−",
    title,
    `-${formatBytes(size)}`,
  ]);

export const renderReport = (comparison: ComparisonReport) => {
  const { chunks, pages } = comparison;
  const { css, js } = chunks;

  const totalJSChunksSize = sumValues<FileSizeInfo>(
    {
      ...js.added,
      ...js.changed,
      ...js.unchanged,
    },
    "size",
  );

  const totalCSSChunksSize = sumValues<FileSizeInfo>(
    {
      ...css.added,
      ...css.changed,
      ...css.unchanged,
    },
    "size",
  );

  return `# Bundle Size Report

${[getDeltaSummary(comparison), getFilesSummary(pages, "pages")].join("\\\n")}

|| Route | Size | Total size | % of \`${formatBytes(getBudget())}\` budget |
| :---: | :--- | :--- | ---: | :--- |
${[
  addedEntries(pages.added, totalJSChunksSize),
  changedEntries(pages.changed, totalJSChunksSize),
  unchangedEntries(pages.unchanged, totalJSChunksSize),
  removedEntries(pages.removed),
]
  .filter((item) => item)
  .join("\n")}

<details>
<summary>
  JS shared by all pages <code>${formatBytes(totalJSChunksSize)}</code>
</summary>
<br>

${getFilesSummary(js)}
|| Chunk file name | Size |
| :---: | :--- | :--- |
${[
  addedEntries(js.added),
  changedEntries(js.changed),
  unchangedEntries(js.unchanged),
  removedEntries(js.removed),
]
  .filter((item) => item)
  .join("\n")}

</details>

<details>
<summary>
CSS shared by all pages <code>${formatBytes(totalCSSChunksSize)}</code>
</summary>
<br>

${getFilesSummary(css)}
|| Chunk file name | Size |
| :---: | :--- | :--- |
${[
  addedEntries(css.added),
  changedEntries(css.changed),
  unchangedEntries(css.unchanged),
  removedEntries(css.removed),
]
  .filter((item) => item)
  .join("\n")}

</details>

<!-- GH NBA -->`;
};
