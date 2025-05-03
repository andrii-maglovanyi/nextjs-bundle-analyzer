import { type ComparisonResult } from "../steps/get-comparison.js";

export const getFilesSummary = (
  { added, changed, removed }: ComparisonResult,
  type: "files" | "pages" = "files",
) => {
  const icon = type === "files" ? "📦" : "📄";

  const addedCount = Object.keys(added).length;
  const changedCount = Object.keys(changed).length;
  const removedCount = Object.keys(removed).length;

  return `${icon} \`${addedCount}\` new, \`${changedCount}\` changed and \`${removedCount}\` deleted ${type}`;
};
