const renderRow = (args)=>`| ${args.join(" | ")} |`;
export const getTableRows = (data, cb)=>Object.entries(data).sort((a, b)=>a[0].localeCompare(b[0])).map(([page, { size, delta }])=>cb(page, size, delta)).map(renderRow).join("\n");
