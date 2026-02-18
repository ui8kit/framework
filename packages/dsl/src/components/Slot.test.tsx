import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Slot } from './Slot';

describe('Slot', () => {
  it('renders span with data-gen-slot default "content" when name not provided', () => {
    const html = renderToStaticMarkup(
      createElement(Slot, null, 'Default content')
    );
    expect(html).toContain('data-gen-slot="content"');
    expect(html).toContain('Default content');
    expect(html).toContain('display:contents');
  });

  it('renders with custom name', () => {
    const html = renderToStaticMarkup(
      createElement(Slot, { name: 'header' }, 'Header content')
    );
    expect(html).toContain('data-gen-slot="header"');
    expect(html).toContain('Header content');
  });

  it('renders empty when no children', () => {
    const html = renderToStaticMarkup(
      createElement(Slot, { name: 'sidebar' })
    );
    expect(html).toContain('data-gen-slot="sidebar"');
  });

  it('has displayName GenSlot', () => {
    expect(Slot.displayName).toBe('GenSlot');
  });
});
