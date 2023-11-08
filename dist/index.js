import { getAnalysis } from "./steps/get-analysis.js";
import { getComparison } from "./steps/get-comparison.js";
import { exportToFile } from "./utils/export-to-file.js";
import { loadJSON } from "./utils/load-json.js";
import { renderReport } from "./utils/render-report.js";
let baseReport;
let appBuildManifest;
try {
    baseReport = loadJSON("../../.next/analyze/main/report.json");
} catch (error) {
    baseReport = {
        pages: {},
        chunks: {
            js: {},
            css: {}
        }
    };
}
try {
    appBuildManifest = loadJSON("../../.next/app-build-manifest.json");
} catch (error) {
    appBuildManifest = {
        pages: {
            ["/layout"]: []
        }
    };
}
const currentReport = getAnalysis(appBuildManifest);
exportToFile("analyze", "report.json")(JSON.stringify(currentReport));
const comparison = getComparison(baseReport, currentReport);
const comparisonReport = renderReport(comparison);
console.log(comparisonReport);
exportToFile("analyze", "report.txt")(comparisonReport);
