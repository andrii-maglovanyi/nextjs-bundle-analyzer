import { type FileSizeInfo } from "../steps/get-comparison.js";

interface RowFormatter {
  (title: string, size: number, delta: number): Array<string>;
}

const renderRow = (args: Array<string>) => `| ${args.join(" | ")} |`;

export const getTableRows = (
  data: Record<string, FileSizeInfo>,
  cb: RowFormatter,
) =>
  Object.entries(data)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([page, { delta, size }]) => cb(page, size, delta))
    .map(renderRow)
    .join("\n");
