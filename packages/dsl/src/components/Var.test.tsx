import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';
import { Var } from './Var';

describe('Var', () => {
  it('renders data-gen-var from name prop and placeholder when no value', () => {
    const html = renderToStaticMarkup(
      createElement(Var, { name: 'user.name' })
    );
    expect(html).toContain('data-gen-var="user.name"');
    expect(html).toContain('{{user.name}}');
  });

  it('uses children as variable name when name is not provided', () => {
    const html = renderToStaticMarkup(
      createElement(Var, null, 'title')
    );
    expect(html).toContain('data-gen-var="title"');
    expect(html).toContain('{{title}}');
  });

  it('prefers name over children when both provided', () => {
    const html = renderToStaticMarkup(
      createElement(Var, { name: 'price' }, 'other')
    );
    expect(html).toContain('data-gen-var="price"');
  });

  it('renders runtime value when value prop is provided', () => {
    const html = renderToStaticMarkup(
      createElement(Var, { name: 'title', value: 'Hello' })
    );
    expect(html).toContain('Hello');
    expect(html).not.toContain('{{title}}');
  });

  it('adds data-gen-default when default prop is provided', () => {
    const html = renderToStaticMarkup(
      createElement(Var, { name: 'title', default: 'Untitled' })
    );
    expect(html).toContain('data-gen-default="Untitled"');
  });

  it('adds data-gen-filter when filter prop is provided', () => {
    const html = renderToStaticMarkup(
      createElement(Var, { name: 'price', filter: 'currency' })
    );
    expect(html).toContain('data-gen-filter="currency"');
  });

  it('formats number as currency when filter is currency and value is number', () => {
    const html = renderToStaticMarkup(
      createElement(Var, { name: 'price', filter: 'currency', value: 99.5 })
    );
    expect(html).toContain('$99.50');
  });

  it('adds data-gen-raw when raw prop is true', () => {
    const html = renderToStaticMarkup(
      createElement(Var, { name: 'html', raw: true })
    );
    expect(html).toContain('data-gen-raw="true"');
  });

  it('renders empty string varName when neither name nor string children', () => {
    const html = renderToStaticMarkup(
      createElement(Var, { value: 'x' })
    );
    expect(html).toContain('data-gen-var=""');
    expect(html).toContain('x');
  });

  it('has displayName GenVar', () => {
    expect(Var.displayName).toBe('GenVar');
  });
});
