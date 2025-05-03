import { getTableRows } from "./get-table-rows.js";

describe("getTableRows", () => {
  const mockData = {
    "/about.html": { delta: -20, size: 2048 },
    "/contact.html": { delta: 5, size: 512 },
    "/index.html": { delta: 10, size: 1024 },
  };

  const rowFormatter = (title: string, size: number, delta: number) => [
    title,
    `${size} bytes`,
    `${delta >= 0 ? "+" : ""}${delta} bytes`,
  ];

  test("should correctly format table rows", () => {
    const expectedOutput = [
      "| /about.html | 2048 bytes | -20 bytes |",
      "| /contact.html | 512 bytes | +5 bytes |",
      "| /index.html | 1024 bytes | +10 bytes |",
    ].join("\n");

    const result = getTableRows(mockData, rowFormatter);
    expect(result).toBe(expectedOutput);
  });

  test("should handle empty data", () => {
    const result = getTableRows({}, rowFormatter);
    expect(result).toBe("");
  });
});
