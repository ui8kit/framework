import { describe, it, expect, beforeEach } from 'vitest';
import { createCache } from './cache';

describe('createCache', () => {
  let cache: ReturnType<typeof createCache<string, number>>;

  beforeEach(() => {
    cache = createCache<string, number>(3);
  });

  it('returns undefined for missing key', () => {
    expect(cache.get('a')).toBeUndefined();
  });

  it('returns value after set', () => {
    cache.set('a', 1);
    expect(cache.get('a')).toBe(1);
  });

  it('returns same reference for same key', () => {
    const obj = { x: 1 };
    const objCache = createCache<string, { x: number }>(3);
    objCache.set('a', obj);
    expect(objCache.get('a')).toBe(obj);
  });

  it('evicts oldest when maxSize exceeded', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);

    cache.set('d', 4);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
    expect(cache.get('d')).toBe(4);
  });

  it('updating existing key does not evict', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.set('c', 3);
    cache.set('a', 10);
    expect(cache.get('a')).toBe(10);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBe(3);
  });

  it('clear removes all entries', () => {
    cache.set('a', 1);
    cache.set('b', 2);
    cache.clear();
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBeUndefined();
  });
});
