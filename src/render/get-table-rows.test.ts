import { getTableRows } from "./get-table-rows.js";

describe("get-table-rows", () => {
  test("should return table rows", () => {
    const data = {
      "/": { delta: 0, size: 100 },
      "/about": { delta: 20, size: 200 },
    };

    const expected = `| / | 100B | 0% |
| /about | 200B | 20% |`;

    expect(
      getTableRows(data, (title, size, delta) => [
        title,
        `${size}B`,
        `${delta}%`,
      ]),
    ).toEqual(expected);
  });

  test("should return undefined if no data", () => {
    expect(getTableRows({}, () => [])).toEqual("");
  });
});
