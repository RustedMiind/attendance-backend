function checkValueObjectArr<T>(
  arr: T[],
  key: keyof T,
  value: unknown
): boolean {
  if (!(arr.length && arr[0] && typeof arr[0] === "object" && arr[0][key]))
    return false;
  arr.forEach((item) => {
    if (item[key] === value) {
      return true;
    }
  });
  return false;
}

export default checkValueObjectArr;
