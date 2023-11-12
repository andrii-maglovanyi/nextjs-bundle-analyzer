import {
  type ComparisonReport,
  type ComparisonResult,
} from "../steps/get-comparison.js";
import { formatBytes } from "../utils/format-bytes.js";

const getDelta = ({ added, changed, removed }: ComparisonResult) =>
  Object.values({
    ...added,
    ...changed,
    ...removed,
  }).reduce((total, { delta }) => total + delta, 0);

const getBaseSize = ({ changed, removed, unchanged }: ComparisonResult) => {
  const sizeWithChangeDelta = Object.values({
    ...changed,
    ...unchanged,
    ...removed,
  }).reduce((total, { size }) => total + size, 0);

  const changeDelta = Object.values(changed).reduce(
    (total, { delta }) => total + delta,
    0,
  );

  return sizeWithChangeDelta - changeDelta;
};

export const getDeltaSummary = (comparison: ComparisonReport) => {
  const pagesSize = getBaseSize(comparison.pages);
  const jsSize = getBaseSize(comparison.chunks.js);
  const cssSize = getBaseSize(comparison.chunks.css);

  const pagesDelta = getDelta(comparison.pages);
  const jsDelta = getDelta(comparison.chunks.js);
  const cssDelta = getDelta(comparison.chunks.css);

  const totalDelta = pagesDelta + jsDelta + cssDelta;
  const totalBaseSize = pagesSize + jsSize + cssSize;
  const sign = totalDelta < 0 ? "-" : "+";

  const percent =
    totalDelta && totalBaseSize
      ? totalDelta / totalBaseSize
      : totalBaseSize
      ? 0
      : 1;

  const sizeChangeInPct = totalDelta
    ? ` (${sign}${Math.abs(percent * 100).toFixed(2)}%)`
    : "";

  const sizeStats = `${formatBytes(totalDelta, true)}${sizeChangeInPct}`;

  if (totalDelta === 0) return "🤔 Total bundle size unchanged";

  return totalDelta < 0
    ? `🎉 Total bundle size decreased \`${sizeStats}\``
    : `🏋️ Total bundle size increased \`${sizeStats}\``;
};
