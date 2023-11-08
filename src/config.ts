let prefix = ".next";
let budget = 200 * 1024;

export const setPrefix = (newPrefix: string) => (prefix = newPrefix);
export const getPrefix = () => prefix;

export const setBudget = (newBudget: typeof budget) =>
  (budget = newBudget * 1024);
export const getBudget = () => budget;
