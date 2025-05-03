import { formatBytes } from "./format-bytes.js";

describe("formatBytes", () => {
  test("should return 0 bytes", () => {
    const size = formatBytes(0);
    expect(size).toEqual("0B");
  });

  test("should return unformatted bytes value", () => {
    const size = formatBytes(32);
    expect(size).toEqual("32B");
  });

  test("should return value in kilobytes", () => {
    const size = formatBytes(1024);
    expect(size).toEqual("1.00KB");
  });

  test("should return value in kilobytes with two decimal points ", () => {
    const size = formatBytes(1500);
    expect(size).toEqual("1.46KB");
  });

  test("should return value in megabytes", () => {
    const size = formatBytes(2048 * 1024);
    expect(size).toEqual("2.00MB");
  });

  test("should return signed value", () => {
    const size = formatBytes(-1024 * 1024 * 1024 * 5, true);
    expect(size).toEqual("-5.00GB");
  });

  test("should handle boundary value just below 1KB", () => {
    const size = formatBytes(1023); // Just below 1KB
    expect(size).toEqual("1023B");
  });
});
