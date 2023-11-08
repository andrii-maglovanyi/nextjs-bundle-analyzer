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
    unchanged: {},
    removed: {},
  };

  // Compare
  for (const key of Object.keys(base)) {
    const baseSize = base[key] || 0;
    const currentSize = current[key] || 0;
    const delta = currentSize - baseSize;

    if (delta > 0) {
      result.changed[key] = { size: currentSize, delta };
    } else if (delta < 0) {
      result.changed[key] = { size: currentSize, delta };
    } else {
      result.unchanged[key] = { size: currentSize, delta };
    }
  }

  // Find added
  for (const key of Object.keys(current)) {
    if (!base[key]) {
      const currentSize = current[key];
      result.added[key] = { size: currentSize, delta: currentSize };
    }
  }

  // Find removed
  for (const key of Object.keys(base)) {
    if (!current[key]) {
      const baseSize = base[key];
      result.removed[key] = { size: baseSize, delta: -baseSize };
      // Remove the entry from "changed" if it's also marked as "removed"
      delete result.changed[key];
    }
  }

  return result;
};

export const getComparison = (
  baseReport: Report,
  currentReport: Report
): ComparisonReport => ({
  pages: getStats(baseReport.pages, currentReport.pages),
  chunks: {
    js: getStats(baseReport.chunks.js, currentReport.chunks.js),
    css: getStats(baseReport.chunks.css, currentReport.chunks.css),
  },
});
