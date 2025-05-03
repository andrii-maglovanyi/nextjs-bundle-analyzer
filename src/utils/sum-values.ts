export const sumValues = <T>(obj: Record<string, T>, prop: keyof T) =>
  Object.values(obj).reduce((total, value) => total + +value[prop], 0);
