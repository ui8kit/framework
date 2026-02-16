import React from 'react'
import type { PropDefinition, ComponentPropsData } from '../core/types'

export interface PropsTableProps {
  /**
   * Component name to display props for
   */
  component: string
  
  /**
   * Props data (provided by build-time extraction or manual)
   */
  data?: ComponentPropsData
  
  /**
   * Manual props definition (alternative to data)
   */
  props?: PropDefinition[]
  
  /**
   * Show required column
   */
  showRequired?: boolean
  
  /**
   * Show default values column
   */
  showDefaults?: boolean
}

/**
 * PropsTable - Auto-generated component props documentation
 * 
 * Features:
 * - Display prop types, defaults, and descriptions
 * - Works with TypeScript-extracted data
 * - Manual props definition support
 * 
 * @example
 * ```mdx
 * ## Props
 * 
 * <PropsTable component="Button" />
 * ```
 * 
 * @example
 * ```mdx
 * <PropsTable 
 *   component="Button"
 *   props={[
 *     { name: 'variant', type: "'primary' | 'secondary'", required: false, defaultValue: "'default'" },
 *     { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, defaultValue: "'md'" },
 *   ]}
 * />
 * ```
 */
export function PropsTable({
  component,
  data,
  props,
  showRequired = true,
  showDefaults = true,
}: PropsTableProps): React.ReactElement {
  // Use provided props or extract from data
  const propsList = props || data?.props || []
  
  if (propsList.length === 0) {
    return (
      <div className="props-table-empty" data-class="props-table-empty">
        <p>No props documentation available for {component}.</p>
      </div>
    )
  }
  
  return (
    <div className="props-table-wrapper" data-class="props-table-wrapper">
      <table className="props-table" data-class="props-table">
        <thead>
          <tr>
            <th data-class="props-th">Prop</th>
            <th data-class="props-th">Type</th>
            {showDefaults && <th data-class="props-th">Default</th>}
            {showRequired && <th data-class="props-th">Required</th>}
            <th data-class="props-th">Description</th>
          </tr>
        </thead>
        <tbody>
          {propsList.map((prop) => (
            <tr key={prop.name} data-class="props-row">
              <td data-class="props-td props-name">
                <code>{prop.name}</code>
              </td>
              <td data-class="props-td props-type">
                <code>{formatType(prop.type)}</code>
              </td>
              {showDefaults && (
                <td data-class="props-td props-default">
                  {prop.defaultValue ? <code>{prop.defaultValue}</code> : '—'}
                </td>
              )}
              {showRequired && (
                <td data-class="props-td props-required">
                  {prop.required ? (
                    <span className="required-badge" data-class="required-badge">Yes</span>
                  ) : (
                    <span className="optional-badge" data-class="optional-badge">No</span>
                  )}
                </td>
              )}
              <td data-class="props-td props-description">
                {prop.description || '—'}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

PropsTable.displayName = 'PropsTable'

/**
 * Format type string for display
 * Handles long union types by adding line breaks
 */
function formatType(type: string): string {
  // If it's a short type, return as-is
  if (type.length < 40) return type
  
  // For long union types, format with breaks
  if (type.includes(' | ')) {
    return type.split(' | ').join(' | ')
  }
  
  return type
}

// ============================================================================
// CSS Classes Reference (for semantic CSS generation)
// ============================================================================

/**
 * CSS classes used by PropsTable:
 * 
 * .props-table-wrapper   - Table container
 * .props-table           - Table element
 * .props-th              - Header cell
 * .props-row             - Body row
 * .props-td              - Body cell
 * .props-name            - Prop name cell
 * .props-type            - Type cell
 * .props-default         - Default value cell
 * .props-required        - Required indicator cell
 * .props-description     - Description cell
 * .required-badge        - Required "Yes" badge
 * .optional-badge        - Optional "No" badge
 * .props-table-empty     - Empty state container
 */
