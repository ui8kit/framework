export interface Cache<K, V> {
  get(key: K): V | undefined;
  set(key: K, value: V): void;
  clear(): void;
  size(): number;
  keys(): K[];
  stats(): CacheStats;
}

export interface CacheStats {
  hits: number;
  misses: number;
  sets: number;
  evictions: number;
  size: number;
  maxSize: number;
}

export function createCache<K, V>(maxSize: number): Cache<K, V> {
  const map = new Map<K, V>();
  let hits = 0;
  let misses = 0;
  let sets = 0;
  let evictions = 0;

  return {
    get(key: K): V | undefined {
      if (map.has(key)) {
        hits += 1;
      } else {
        misses += 1;
      }
      return map.get(key);
    },
    set(key: K, value: V): void {
      sets += 1;
      if (map.size >= maxSize && !map.has(key)) {
        const firstKey = map.keys().next().value;
        if (firstKey !== undefined) {
          map.delete(firstKey);
          evictions += 1;
        }
      }
      map.set(key, value);
    },
    clear(): void {
      map.clear();
      hits = 0;
      misses = 0;
      sets = 0;
      evictions = 0;
    },
    size(): number {
      return map.size;
    },
    keys(): K[] {
      return Array.from(map.keys());
    },
    stats(): CacheStats {
      return {
        hits,
        misses,
        sets,
        evictions,
        size: map.size,
        maxSize,
      };
    },
  };
}
