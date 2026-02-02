import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Loop } from './Loop';

describe('Loop', () => {
  it('renders single span with data-gen-loop when no data', () => {
    const html = renderToStaticMarkup(
      createElement(Loop, { each: 'items', as: 'item', children: 'Item' })
    );
    expect(html).toContain('data-gen-loop="item:items"');
    expect(html).toContain('Item');
  });

  it('renders one span per data item when data is provided', () => {
    const html = renderToStaticMarkup(
      createElement(Loop, { each: 'products', as: 'product', data: [{ id: '1' }, { id: '2' }], children: 'Card' })
    );
    expect(html).toContain('data-gen-loop="product:products"');
    expect(html).toContain('Card');
    const spanCount = (html.match(/data-gen-loop/g) ?? []).length;
    expect(spanCount).toBe(2);
  });

  it('adds data-gen-key when keyExpr is provided', () => {
    const html = renderToStaticMarkup(
      createElement(Loop, { each: 'items', as: 'item', keyExpr: 'item.id', children: 'X' })
    );
    expect(html).toContain('data-gen-key="item.id"');
  });

  it('adds data-gen-index when index is provided', () => {
    const html = renderToStaticMarkup(
      createElement(Loop, { each: 'items', as: 'item', index: 'i', children: 'X' })
    );
    expect(html).toContain('data-gen-index="i"');
  });

  it('renders empty fragment when data is empty array', () => {
    const html = renderToStaticMarkup(
      createElement(Loop, { each: 'items', as: 'item', data: [], children: 'Item' })
    );
    expect(html).toBe('');
  });

  it('renders single span when data is not an array', () => {
    const html = renderToStaticMarkup(
      createElement(Loop, { each: 'items', as: 'item', data: null as unknown as unknown[], children: 'Item' })
    );
    expect(html).toContain('data-gen-loop="item:items"');
  });

  it('has displayName GenLoop', () => {
    expect(Loop.displayName).toBe('GenLoop');
  });
});
