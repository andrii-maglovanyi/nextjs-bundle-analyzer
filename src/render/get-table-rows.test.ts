import { getTableRows } from "./get-table-rows.js";

describe("get-table-rows", () => {
  test("should return table rows", () => {
    const data = {
      "/": { size: 100, delta: 0 },
      "/about": { size: 200, delta: 20 },
    };

    const expected = `| / | 100B | 0% |
| /about | 200B | 20% |`;

    expect(
      getTableRows(data, (title, size, delta) => [
        title,
        `${size}B`,
        `${delta}%`,
      ])
    ).toEqual(expected);
  });

  test("should return undefined if no data", () => {
    expect(getTableRows({}, () => [])).toEqual("");
  });
});
