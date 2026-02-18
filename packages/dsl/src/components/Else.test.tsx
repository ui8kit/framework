import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Else } from './Else';

describe('Else', () => {
  it('renders children in a span with data-gen-else', () => {
    const html = renderToStaticMarkup(
      createElement(Else, null, 'Fallback content')
    );
    expect(html).toContain('data-gen-else');
    expect(html).toContain('Fallback content');
    expect(html).toContain('display:contents');
  });

  it('renders empty children', () => {
    const html = renderToStaticMarkup(createElement(Else, null));
    expect(html).toContain('data-gen-else');
  });

  it('has displayName GenElse', () => {
    expect(Else.displayName).toBe('GenElse');
  });
});
