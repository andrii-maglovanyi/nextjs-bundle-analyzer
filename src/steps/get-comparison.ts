import { type FileSizes } from "../utils/file-size.js";
import { type Report } from "./get-analysis.js";

export interface FileSizeInfo {
  size: number;
  delta: number;
}

export interface ComparisonResult {
  added: Record<string, FileSizeInfo>;
  changed: Record<string, FileSizeInfo>;
  unchanged: Record<string, FileSizeInfo>;
  removed: Record<string, FileSizeInfo>;
}

export interface ComparisonReport {
  pages: ComparisonResult;
  chunks: {
    js: ComparisonResult;
    css: ComparisonResult;
  };
}

const getStats = (base: FileSizes, current: FileSizes): ComparisonResult => {
  const result: ComparisonResult = {
    added: {},
    changed: {},
    removed: {},
    unchanged: {},
  };

  // Compare
  for (const key in base) {
    const baseSize = base[key] || 0;
    const currentSize = current[key] || 0;
    const delta = currentSize - baseSize;

    if (delta !== 0) {
      result.changed[key] = { delta, size: currentSize };
    } else {
      result.unchanged[key] = { delta, size: currentSize };
    }
  }

  // Find added
  for (const key in current) {
    if (!base[key]) {
      const currentSize = current[key];
      result.added[key] = { delta: currentSize, size: currentSize };
    }
  }

  // Find removed
  for (const key in base) {
    if (!current[key]) {
      const baseSize = base[key];
      result.removed[key] = { delta: -baseSize, size: baseSize };
      // Remove the entry from "changed" if it's also marked as "removed"
      delete result.changed[key];
    }
  }

  return result;
};

export const getComparison = (
  baseReport: Report,
  currentReport: Report,
): ComparisonReport => ({
  chunks: {
    css: getStats(baseReport.chunks.css, currentReport.chunks.css),
    js: getStats(baseReport.chunks.js, currentReport.chunks.js),
  },
  pages: getStats(baseReport.pages, currentReport.pages),
});
