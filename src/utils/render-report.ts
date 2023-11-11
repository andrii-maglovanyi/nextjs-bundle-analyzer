import { getBudget } from "../config.js";
import { getDeltaSummary } from "../render/get-delta-summary.js";
import { getFilesSummary } from "../render/get-files-summary.js";
import { getTableRows } from "../render/get-table-rows.js";
import {
  ComparisonReport,
  type FileSizeInfo,
} from "../steps/get-comparison.js";
import { formatBytes } from "./format-bytes.js";
import { getSum } from "./get-sum.js";

const budget = getBudget();

const getPercentage = (size: number) => ((size / budget) * 100).toFixed(2);

const getDetails = (size: number, delta: number, totalChunksSize?: number) => {
  if (!totalChunksSize) return ["", ""];

  const totalSize = size + totalChunksSize;
  const percentageChange = delta ? ` (${getPercentage(delta)}%)` : "";

  return [
    formatBytes(totalSize),
    `${getPercentage(size + totalSize)}% ${percentageChange}`,
  ];
};

const addedEntries = (
  entries: Record<string, FileSizeInfo>,
  totalChunksSize?: number
) =>
  getTableRows(entries, (title: string, size: number, delta: number) => [
    "+",
    title,
    `${formatBytes(size)}`,
    ...getDetails(size, 0, totalChunksSize),
  ]);

const changedEntries = (
  entries: Record<string, FileSizeInfo>,
  totalChunksSize?: number
) =>
  getTableRows(entries, (title: string, size: number, delta: number) => [
    "±",
    title,
    `${formatBytes(size)} (${formatBytes(delta, true)})`,
    ...getDetails(size, delta, totalChunksSize),
  ]);

const unchangedEntries = (
  entries: Record<string, FileSizeInfo>,
  totalChunksSize?: number
) =>
  getTableRows(entries, (title: string, size: number) => [
    "",
    title,
    formatBytes(size),
    ...getDetails(size, 0, totalChunksSize),
  ]);

const removedEntries = (entries: Record<string, FileSizeInfo>) =>
  getTableRows(entries, (title: string, size: number, delta: number) => [
    "−",
    title,
    `${formatBytes(size)}`,
  ]);

export const renderReport = (comparison: ComparisonReport) => {
  const { pages, chunks } = comparison;
  const { js, css } = chunks;

  const totalJSChunksSize = getSum<FileSizeInfo>(
    {
      ...js.added,
      ...js.changed,
      ...js.unchanged,
    },
    "size"
  );

  const totalCSSChunksSize = getSum<FileSizeInfo>(
    {
      ...css.added,
      ...css.changed,
      ...css.unchanged,
    },
    "size"
  );

  return `# Bundle Size Report

${[getDeltaSummary(comparison), getFilesSummary(pages)].join("\\\n")}

|| Route | Size | Total size | % of Budget (\`${formatBytes(budget)}\`) |
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
<summary>JS shared by all pages <code>${formatBytes(
    totalJSChunksSize
  )}</code></summary>

\
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
<summary>CSS shared by all pages <code>${formatBytes(
    totalCSSChunksSize
  )}</code></summary>

\
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
