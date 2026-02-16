import React, { forwardRef, useState } from 'react'

export interface ComponentExampleProps {
  component: React.ComponentType<Record<string, unknown>>
  variants?: string[]
  sizes?: string[]
  title?: string
  code?: string
  showCode?: boolean
  className?: string
}

/**
 * Simple className joiner (no external dependency)
 */
function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * Interactive component example for documentation
 * 
 * Renders a component with optional variant/size controls and code preview.
 * 
 * @example
 * ```mdx
 * <ComponentExample
 *   component={Button}
 *   variants={['primary', 'secondary']}
 *   sizes={['sm', 'md', 'lg']}
 *   title="Button Variants"
 *   code={`<Button variant="primary">Click</Button>`}
 * />
 * ```
 */
export const ComponentExample = forwardRef<HTMLDivElement, ComponentExampleProps>(
  ({
    component: Component,
    variants = [],
    sizes = [],
    title,
    code,
    showCode = true,
    className,
    ...props
  }, ref) => {
    const [activeVariant, setActiveVariant] = useState(0)
    const [activeSize, setActiveSize] = useState(0)

    const currentVariant = variants[activeVariant]
    const currentSize = sizes[activeSize]

    const componentProps: Record<string, unknown> = {
      ...(currentVariant && { variant: currentVariant }),
      ...(currentSize && { size: currentSize }),
    }

    return (
      <div
        ref={ref}
        role="region"
        aria-label={title}
        className={cn('component-example', className)}
        data-class="component-example"
        {...props}
      >
        {title && (
          <h3 className="component-example-title" data-class="component-example-title">
            {title}
          </h3>
        )}

        <div className="component-example-preview" data-class="component-example-preview">
          <Component {...componentProps}>
            {currentVariant || 'Example'}
          </Component>
        </div>

        {(variants.length > 0 || sizes.length > 0) && (
          <div className="component-example-controls" data-class="component-example-controls">
            {variants.length > 0 && (
              <div className="variant-controls" data-class="variant-controls">
                {variants.map((variant, index) => (
                  <button
                    key={variant}
                    type="button"
                    onClick={() => setActiveVariant(index)}
                    className={cn(
                      'variant-button',
                      activeVariant === index && 'active'
                    )}
                    data-class="variant-button"
                    data-active={activeVariant === index}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            )}

            {sizes.length > 0 && (
              <div className="size-controls" data-class="size-controls">
                {sizes.map((size, index) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setActiveSize(index)}
                    className={cn(
                      'size-button',
                      activeSize === index && 'active'
                    )}
                    data-class="size-button"
                    data-active={activeSize === index}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {showCode && code && (
          <div className="component-example-code" data-class="component-example-code">
            <pre><code>{code}</code></pre>
          </div>
        )}
      </div>
    )
  }
)

ComponentExample.displayName = 'ComponentExample'
