const kb = 1024;
const sizes = ["B", "kB", "mB", "gB", "tB"];

export const formatBytes = (bytes: number, signed = false) => {
  const sign = signed ? (bytes < 0 ? "-" : "+") : "";
  if (bytes === 0) return `${sign}0B`;

  const i = Math.floor(Math.log(Math.abs(bytes)) / Math.log(kb));

  return `${sign}${parseFloat(Math.abs(bytes / Math.pow(kb, i)).toFixed(2))}${
    sizes[i]
  }`;
};
