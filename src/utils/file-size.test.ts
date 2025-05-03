import { setPrefix } from "../config.js";
import { getFileSizes } from "./file-size.js";

describe("getFileSizes", () => {
  beforeAll(() => {
    setPrefix("src/__fixtures__/");
  });

  test("should return the size of a file", () => {
    const size = getFileSizes("file.txt");
    expect(size).toEqual({ "file.txt": 32 });
  });

  test("should throw an error if the file does not exist", () => {
    expect(() => getFileSizes("no-such-file.txt")).toThrow(
      "ENOENT: no such file or directory",
    );
  });
});
