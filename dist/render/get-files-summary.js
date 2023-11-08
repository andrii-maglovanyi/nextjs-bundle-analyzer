export const getFilesSummary = (changes, type = "files")=>{
    const icon = type === "files" ? "📦" : "📄";
    const addedCount = Object.keys(changes.added).length;
    const changedCount = Object.keys(changes.changed).length;
    const removedCount = Object.keys(changes.removed).length;
    return `${icon} \`${addedCount}\` new, \`${changedCount}\` changed, \`${removedCount}\` deleted ${type}`;
};
