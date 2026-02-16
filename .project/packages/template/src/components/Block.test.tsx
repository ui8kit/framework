import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { DefineBlock } from './Block';

describe('DefineBlock', () => {
  it('renders span with data-gen-block and name', () => {
    const html = renderToStaticMarkup(
      createElement(DefineBlock, { name: 'title' }, 'Default Title')
    );
    expect(html).toContain('data-gen-block="title"');
    expect(html).toContain('Default Title');
    expect(html).toContain('display:contents');
  });

  it('renders without children', () => {
    const html = renderToStaticMarkup(
      createElement(DefineBlock, { name: 'sidebar' })
    );
    expect(html).toContain('data-gen-block="sidebar"');
  });

  it('has displayName GenDefineBlock', () => {
    expect(DefineBlock.displayName).toBe('GenDefineBlock');
  });
});
