export function removeDuplicates<T>(arr: T[] | undefined): T[] | undefined {
  if (!Array.isArray(arr)) {
    return undefined;
  }
  const result: T[] = [];
  for (const item of arr) {
    if (!result.includes(item)) {
      result.push(item);
    }
  }
  return result;
}
