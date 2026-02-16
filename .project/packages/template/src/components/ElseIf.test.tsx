import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { ElseIf } from './ElseIf';

describe('ElseIf', () => {
  it('renders children in a span with data-gen-elseif when value is true', () => {
    const html = renderToStaticMarkup(
      createElement(ElseIf, { test: "status === 'error'", value: true, children: 'Error view' })
    );
    expect(html).toContain('data-gen-elseif');
    expect(html).toContain('status');
    expect(html).toContain('error');
    expect(html).toContain('Error view');
    expect(html).toContain('display:contents');
  });

  it('renders children when value is undefined', () => {
    const html = renderToStaticMarkup(
      createElement(ElseIf, { test: 'hasError', children: 'Error' })
    );
    expect(html).toContain('data-gen-elseif="hasError"');
    expect(html).toContain('Error');
  });

  it('returns null when value is false', () => {
    const html = renderToStaticMarkup(
      createElement(ElseIf, { test: 'hasError', value: false, children: 'Error' })
    );
    expect(html).toBe('');
  });

  it('has displayName GenElseIf', () => {
    expect(ElseIf.displayName).toBe('GenElseIf');
  });
});
