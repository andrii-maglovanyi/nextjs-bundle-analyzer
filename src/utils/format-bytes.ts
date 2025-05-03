const kb = 1024;
const sizes = ["B", "KB", "MB", "GB", "TB"];

export const formatBytes = (bytes: number, signed = false) => {
  let sign = "";

  if (signed) {
    sign = bytes < 0 ? "-" : "+";
  }

  if (bytes === 0) return `${sign}0B`;

  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(kb));
  const size = Math.abs(bytes / Math.pow(kb, i));

  // Special handling for byte-sized values to avoid unnecessary decimal places
  const formattedSize = sizes[i] === "B" ? size : size.toFixed(2);

  return `${sign}${formattedSize}${sizes[i]}`;
};
