import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Raw } from './Raw';

describe('Raw', () => {
  it('renders data-gen-raw and placeholder when no value', () => {
    const html = renderToStaticMarkup(
      createElement(Raw, null, 'htmlContent')
    );
    expect(html).toContain('data-gen-raw="htmlContent"');
    expect(html).toContain('{{htmlContent}}');
  });

  it('renders value as inner HTML when value prop is provided', () => {
    const html = renderToStaticMarkup(
      createElement(Raw, { value: '<b>Bold</b>', children: 'htmlContent' })
    );
    expect(html).toContain('data-gen-raw="htmlContent"');
    expect(html).toContain('<b>Bold</b>');
  });

  it('uses empty string for varName when children is not a string', () => {
    const html = renderToStaticMarkup(
      createElement(Raw, { value: 'x', children: undefined })
    );
    expect(html).toContain('data-gen-raw=""');
    expect(html).toContain('x');
  });

  it('has displayName GenRaw', () => {
    expect(Raw.displayName).toBe('GenRaw');
  });
});
