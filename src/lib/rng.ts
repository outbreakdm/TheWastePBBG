// Mulberry32 — deterministic 32-bit seeded PRNG
export function createRng(seed: number) {
  let s = seed | 0

  function next(): number {
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }

  return {
    // 0..1 float
    random: next,

    // inclusive int range
    int(min: number, max: number): number {
      return Math.floor(next() * (max - min + 1)) + min
    },

    // roll against a probability (0-1)
    chance(probability: number): boolean {
      return next() < probability
    },

    // pick random item from array
    pick<T>(arr: T[]): T {
      return arr[Math.floor(next() * arr.length)]
    },
  }
}

export type SeededRng = ReturnType<typeof createRng>

export function generateSeed(): number {
  return Math.floor(Math.random() * 2147483647)
}
