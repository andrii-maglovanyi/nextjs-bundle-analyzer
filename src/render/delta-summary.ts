import {
  type ComparisonReport,
  type ComparisonResult,
} from "../steps/get-comparison.js";
import { formatBytes } from "../utils/format-bytes.js";
import { sumValues } from "../utils/sum-values.js";

const getDelta = ({ added, changed, removed }: ComparisonResult) =>
  sumValues({ ...added, ...changed, ...removed }, "delta");

const getBaseSize = ({ changed, removed, unchanged }: ComparisonResult) => {
  const totalSize = sumValues({ ...changed, ...unchanged, ...removed }, "size");
  const changeDelta = sumValues(changed, "delta");

  return totalSize - changeDelta;
};

export const getDeltaSummary = (comparison: ComparisonReport) => {
  const calculateSizeAndDelta = (part: ComparisonResult) => ({
    delta: getDelta(part),
    size: getBaseSize(part),
  });

  const pages = calculateSizeAndDelta(comparison.pages);
  const js = calculateSizeAndDelta(comparison.chunks.js);
  const css = calculateSizeAndDelta(comparison.chunks.css);

  const totalDelta = pages.delta + js.delta + css.delta;
  const totalBaseSize = pages.size + js.size + css.size;
  const sign = totalDelta < 0 ? "-" : "+";

  let percent = 100;

  if (totalDelta && totalBaseSize) {
    percent = Math.abs((totalDelta / totalBaseSize) * 100);
  } else if (totalBaseSize) {
    percent = 0;
  }

  const sizeChangeInPct = totalDelta ? ` (${sign}${percent.toFixed(2)}%)` : "";

  const sizeStats = `${formatBytes(totalDelta, true)}${sizeChangeInPct}`;

  if (totalDelta === 0) return "🤔 Total bundle size unchanged";
  return totalDelta < 0
    ? `🎉 Total bundle size decreased \`${sizeStats}\``
    : `🏋️ Total bundle size increased \`${sizeStats}\``;
};
