import React, { Children, isValidElement, cloneElement } from 'react'

export interface ComponentPreviewProps {
  /**
   * Preview title (optional)
   */
  title?: string
  
  /**
   * Preview description (optional)
   */
  description?: string
  
  /**
   * Show code toggle (default: true)
   */
  showCode?: boolean
  
  /**
   * Custom code to display (if not provided, extracted from children)
   */
  code?: string
  
  /**
   * Children components to preview
   */
  children: React.ReactNode
  
  /**
   * Additional class name
   */
  className?: string
}

/**
 * Extract JSX code string from React children for display
 * This is a simplified version - in build mode we use AST
 */
function extractCodeFromChildren(children: React.ReactNode): string {
  const lines: string[] = []
  
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      if (typeof child === 'string' && child.trim()) {
        lines.push(child.trim())
      }
      return
    }
    
    const { type, props } = child
    const typeName = typeof type === 'string' 
      ? type 
      : (type as React.ComponentType).displayName || (type as React.ComponentType).name || 'Component'
    
    // Build props string
    const propsStr = Object.entries(props || {})
      .filter(([key]) => key !== 'children')
      .map(([key, value]) => {
        if (value === true) return key
        if (typeof value === 'string') return `${key}="${value}"`
        return `${key}={${JSON.stringify(value)}}`
      })
      .join(' ')
    
    const hasChildren = props?.children
    const childrenStr = hasChildren 
      ? (typeof props.children === 'string' ? props.children : '...')
      : ''
    
    if (hasChildren) {
      lines.push(`<${typeName}${propsStr ? ' ' + propsStr : ''}>${childrenStr}</${typeName}>`)
    } else {
      lines.push(`<${typeName}${propsStr ? ' ' + propsStr : ''} />`)
    }
  })
  
  return lines.join('\n')
}

/**
 * ComponentPreview - Shadcn-style component preview with code
 * 
 * Features:
 * - Live preview of components
 * - Code display with CSS-only toggle (no JS)
 * - Works in both dev (React) and build (Liquid) modes
 * 
 * @example
 * ```mdx
 * <ComponentPreview title="Button Variants">
 *   <Button variant="primary">Primary</Button>
 *   <Button variant="secondary">Secondary</Button>
 * </ComponentPreview>
 * ```
 */
export function ComponentPreview({
  title,
  description,
  showCode = true,
  code,
  children,
  className,
}: ComponentPreviewProps): React.ReactElement {
  const displayCode = code || extractCodeFromChildren(children)
  
  return (
    <div 
      className={`component-preview ${className || ''}`}
      data-class="component-preview"
    >
      {/* Header */}
      {(title || description) && (
        <div className="preview-header" data-class="preview-header">
          {title && (
            <h4 className="preview-title" data-class="preview-title">
              {title}
            </h4>
          )}
          {description && (
            <p className="preview-description" data-class="preview-description">
              {description}
            </p>
          )}
        </div>
      )}
      
      {/* Preview Panel */}
      <div className="preview-panel" data-class="preview-panel">
        <div className="preview-content" data-class="preview-content">
          {children}
        </div>
      </div>
      
      {/* Code Panel - CSS-only toggle using <details> */}
      {showCode && displayCode && (
        <details className="preview-code-wrapper" data-class="preview-code-wrapper">
          <summary className="preview-code-toggle" data-class="preview-code-toggle">
            <span className="toggle-icon" data-class="toggle-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
            </span>
            <span>View Code</span>
          </summary>
          <div className="preview-code" data-class="preview-code">
            <pre><code>{displayCode}</code></pre>
          </div>
        </details>
      )}
    </div>
  )
}

ComponentPreview.displayName = 'ComponentPreview'

// ============================================================================
// Additional Doc Components
// ============================================================================

export interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'tip'
  title?: string
  children: React.ReactNode
}

/**
 * Callout - Info/Warning/Error boxes for documentation
 */
export function Callout({ 
  type = 'info', 
  title, 
  children 
}: CalloutProps): React.ReactElement {
  const icons: Record<string, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    error: '❌',
    tip: '💡',
  }
  
  return (
    <div 
      className={`callout callout-${type}`}
      data-class={`callout callout-${type}`}
    >
      <div className="callout-icon" data-class="callout-icon">
        {icons[type]}
      </div>
      <div className="callout-content" data-class="callout-content">
        {title && (
          <div className="callout-title" data-class="callout-title">
            {title}
          </div>
        )}
        <div className="callout-body" data-class="callout-body">
          {children}
        </div>
      </div>
    </div>
  )
}

Callout.displayName = 'Callout'

export interface StepsProps {
  children: React.ReactNode
}

/**
 * Steps - Step-by-step guide container
 */
export function Steps({ children }: StepsProps): React.ReactElement {
  return (
    <div className="steps" data-class="steps">
      {Children.map(children, (child, index) => (
        <div className="step" data-class="step" data-step={index + 1}>
          <div className="step-number" data-class="step-number">
            {index + 1}
          </div>
          <div className="step-content" data-class="step-content">
            {child}
          </div>
        </div>
      ))}
    </div>
  )
}

Steps.displayName = 'Steps'
