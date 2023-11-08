export const getSum = (obj, prop)=>Object.values(obj).reduce((total, value)=>total + +value[prop], 0);
