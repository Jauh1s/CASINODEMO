/** Unbiased integer in [0,n) from the browser's CSPRNG (rejection sampling). */
export function rand(n: number): number {
  const lim = Math.floor(0x100000000 / n) * n, a = new Uint32Array(1);
  do crypto.getRandomValues(a); while (a[0] >= lim);
  return a[0] % n;
}
export function shuffle<T>(x: T[]): T[] {
  const a = [...x];
  for (let i = a.length - 1; i > 0; i--) { const j = rand(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
