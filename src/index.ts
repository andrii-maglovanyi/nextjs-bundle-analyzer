import { setBudget, setPrefix } from "./config.js";
import { getAnalysis } from "./steps/get-analysis.js";
import { getComparison } from "./steps/get-comparison.js";
import { exportToFile } from "./utils/export-to-file.js";
import { loadJSON } from "./utils/load-json.js";
import { renderReport } from "./utils/render-report.js";
import * as core from "@actions/core";
import path from "path";

let baseReport;
let appBuildManifest;

try {
  const branch = core.getInput("default-branch") || "main";
  const prefix = core.getInput("prefix") || ".next";
  const budget = +core.getInput("budget") || 200;

  console.log("SET BUDEGT", budget);
  console.log("SET PREFIX", prefix);
  console.log("SET BRANCH", branch);
  console.log(`The event payload: ${core.summary}`);
  console.log(JSON.stringify(process.env, null, 2));

  setPrefix(prefix);
  setBudget(budget);

  const importReportPath = path.join(prefix, "analyze", branch, "report.json");
  const appBuildManifestPath = path.join(prefix, "app-build-manifest.json");
  const exportPath = path.join(prefix, "analyze");
  const exportReportPath = path.join(exportPath, branch);

  try {
    baseReport = loadJSON(importReportPath);
  } catch (error) {
    baseReport = {
      pages: {},
      chunks: { js: {}, css: {} },
    };
  }

  try {
    appBuildManifest = loadJSON(appBuildManifestPath);
  } catch (error) {
    appBuildManifest = {
      pages: {
        ["/layout"]: [],
      },
    };
  }

  const currentReport = getAnalysis(appBuildManifest);
  const comparison = getComparison(baseReport, currentReport);
  const comparisonReport = renderReport(comparison);

  exportToFile(exportReportPath, "report.json")(JSON.stringify(currentReport));
  exportToFile(exportPath, "report.txt")(comparisonReport);
} catch (error) {
  if (error instanceof Error) {
    core.setFailed(error.message);
  }
}
