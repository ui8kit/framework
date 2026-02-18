import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Include } from './Include';

describe('Include', () => {
  it('renders span with data-gen-include and partial name', () => {
    const html = renderToStaticMarkup(
      createElement(Include, { partial: 'header' })
    );
    expect(html).toContain('data-gen-include="header"');
    expect(html).toContain('display:contents');
  });

  it('adds data-gen-props with JSON when props is provided', () => {
    const html = renderToStaticMarkup(
      createElement(Include, { partial: 'card', props: { title: 'item.title', active: 'isActive' } })
    );
    expect(html).toContain('data-gen-include="card"');
    expect(html).toContain('data-gen-props');
    expect(html).toContain('title');
    expect(html).toContain('item.title');
    expect(html).toContain('active');
    expect(html).toContain('isActive');
  });

  it('renders without data-gen-props when props is undefined', () => {
    const html = renderToStaticMarkup(
      createElement(Include, { partial: 'footer' })
    );
    expect(html).not.toContain('data-gen-props');
  });

  it('has displayName GenInclude', () => {
    expect(Include.displayName).toBe('GenInclude');
  });
});
