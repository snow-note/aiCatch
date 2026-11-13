import { describe, expect, it } from 'vitest';
import { checkTotal, SIZE_LIMIT } from '../../scripts/check-size.mjs';

describe('SIZE_LIMIT', () => {
  it('is 1 MiB (1,048,576 bytes)', () => {
    expect(SIZE_LIMIT).toBe(1_048_576);
  });
});

describe('checkTotal', () => {
  it('returns total 0 and ok for an empty list', () => {
    expect(checkTotal([])).toEqual({ total: 0, ok: true });
  });

  it('sums several sizes under the limit and is ok', () => {
    expect(checkTotal([1000, 2000, 3000])).toEqual({ total: 6000, ok: true });
  });

  it('is ok one byte below the limit', () => {
    expect(checkTotal([SIZE_LIMIT - 1])).toEqual({ total: SIZE_LIMIT - 1, ok: true });
  });

  it('is not ok exactly at the limit', () => {
    expect(checkTotal([SIZE_LIMIT])).toEqual({ total: SIZE_LIMIT, ok: false });
  });

  it('is not ok over the limit', () => {
    expect(checkTotal([SIZE_LIMIT, 1])).toEqual({ total: SIZE_LIMIT + 1, ok: false });
  });

  it('honours a custom limit', () => {
    expect(checkTotal([50, 49], 100).ok).toBe(true);
    expect(checkTotal([50, 50], 100).ok).toBe(false);
  });
});
