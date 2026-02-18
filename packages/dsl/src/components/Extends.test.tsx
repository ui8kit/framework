import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Extends } from './Extends';

describe('Extends', () => {
  it('renders span with data-gen-extends and layout name', () => {
    const html = renderToStaticMarkup(
      createElement(Extends, { layout: 'base' })
    );
    expect(html).toContain('data-gen-extends="base"');
    expect(html).toContain('display:none');
  });

  it('has displayName GenExtends', () => {
    expect(Extends.displayName).toBe('GenExtends');
  });
});
