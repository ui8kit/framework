import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { If } from './If';

describe('If', () => {
  it('renders children in a span with data-gen-if when value is true', () => {
    const html = renderToStaticMarkup(
      createElement(If, { test: 'isActive', value: true, children: 'Active' })
    );
    expect(html).toContain('data-gen-if="isActive"');
    expect(html).toContain('Active');
    expect(html).toContain('display:contents');
  });

  it('renders children when value is undefined (dev mode fallback)', () => {
    const html = renderToStaticMarkup(
      createElement(If, { test: 'isLoading', children: 'Loading...' })
    );
    expect(html).toContain('data-gen-if="isLoading"');
    expect(html).toContain('Loading...');
  });

  it('returns null when value is false', () => {
    const html = renderToStaticMarkup(
      createElement(If, { test: 'isLoading', value: false, children: 'Loading...' })
    );
    expect(html).toBe('');
  });

  it('has displayName GenIf', () => {
    expect(If.displayName).toBe('GenIf');
  });
});
