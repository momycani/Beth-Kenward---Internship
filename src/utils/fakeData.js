export function stableNumberFromId(id, min = 1, max = 100) {
  let hash = 0;
  const str = String(id ?? "");

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  return min + (Math.abs(hash) % (max - min + 1));
}
