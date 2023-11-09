import { setBudget, setPrefix } from "./config.js";
import { getAnalysis } from "./steps/get-analysis.js";
import { getComparison } from "./steps/get-comparison.js";
import { exportToFile } from "./utils/export-to-file.js";
import { loadJSON } from "./utils/load-json.js";
import { renderReport } from "./utils/render-report.js";
import * as core from "@actions/core";

import "./readdir.js";

let baseReport;
let appBuildManifest;

const defaultBranch = core.getInput("default-branch") || "main";
const prefix = core.getInput("prefix") || ".next";
const budget = +core.getInput("budget") || 200;

setPrefix(prefix);
setBudget(budget);

const reportPath = `${prefix}/analyze/${defaultBranch}/report.json`;
const appBuildManifestPath = `${prefix}/app-build-manifest.json`;

console.log("");

console.log("reportPath", reportPath);
console.log("appBuildManifestPath", appBuildManifestPath);

try {
  baseReport = loadJSON(reportPath);
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

console.log("appBuildManifest", appBuildManifest);

const currentReport = getAnalysis(appBuildManifest);
console.log("CURRENT REPORT", currentReport);

exportToFile("analyze", "report.json")(JSON.stringify(currentReport));

const comparison = getComparison(baseReport, currentReport);

const comparisonReport = renderReport(comparison);

console.log(comparisonReport);

exportToFile("analyze", "report.txt")(comparisonReport);
