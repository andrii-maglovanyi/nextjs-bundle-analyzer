const getStats = (base, current)=>{
    const result = {
        added: {},
        changed: {},
        unchanged: {},
        removed: {}
    };
    // Compare
    for (const key of Object.keys(base)){
        const baseSize = base[key] || 0;
        const currentSize = current[key] || 0;
        const delta = currentSize - baseSize;
        if (delta > 0) {
            result.changed[key] = {
                size: currentSize,
                delta
            };
        } else if (delta < 0) {
            result.changed[key] = {
                size: currentSize,
                delta
            };
        } else {
            result.unchanged[key] = {
                size: currentSize,
                delta
            };
        }
    }
    // Find added
    for (const key of Object.keys(current)){
        if (!base[key]) {
            const currentSize = current[key];
            result.added[key] = {
                size: currentSize,
                delta: currentSize
            };
        }
    }
    // Find removed
    for (const key of Object.keys(base)){
        if (!current[key]) {
            const baseSize = base[key];
            result.removed[key] = {
                size: baseSize,
                delta: -baseSize
            };
            // Remove the entry from "changed" if it's also marked as "removed"
            delete result.changed[key];
        }
    }
    return result;
};
export const getComparison = (baseReport, currentReport)=>({
        pages: getStats(baseReport.pages, currentReport.pages),
        chunks: {
            js: getStats(baseReport.chunks.js, currentReport.chunks.js),
            css: getStats(baseReport.chunks.css, currentReport.chunks.css)
        }
    });
