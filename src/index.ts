import { setBudget, setPrefix } from "./config.js";
import { getAnalysis } from "./steps/get-analysis.js";
import { getComparison } from "./steps/get-comparison.js";
import { exportToFile } from "./utils/export-to-file.js";
import { loadJSON } from "./utils/load-json.js";
import { renderReport } from "./utils/render-report.js";
import * as core from "@actions/core";
import * as github from "@actions/github";

let baseReport;
let appBuildManifest;

const defaultBranch = core.getInput("default-branch");
const prefix = core.getInput("prefix");
const budget = +core.getInput("budget");

console.log("SET BUDEGT", budget);
const payload = JSON.stringify(github.context.payload, undefined, 2);
console.log(`The event payload: ${payload}`);

setPrefix(prefix);
setBudget(budget);

const importBaseReportPath = `${prefix}/analyze/${defaultBranch}/report.json`;
const appBuildManifestPath = `${prefix}/app-build-manifest.json`;

const exportPath = `${prefix}/analyze`;

try {
  baseReport = loadJSON(importBaseReportPath);
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

exportToFile(
  exportPath,
  `${defaultBranch}/report.json`
)(JSON.stringify(currentReport));

const comparison = getComparison(baseReport, currentReport);

const comparisonReport = renderReport(comparison);

exportToFile(exportPath, "report.txt")(comparisonReport);
