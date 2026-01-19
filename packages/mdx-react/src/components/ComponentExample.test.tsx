import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ComponentExample } from './ComponentExample';

// Mock component for testing
const MockComponent = ({ variant }: { variant?: string }) => (
  <button data-testid="mock-component" data-variant={variant}>
    Mock Component
  </button>
);

describe('ComponentExample', () => {
  it('should render component with default props', () => {
    render(<ComponentExample component={MockComponent} />);

    const component = screen.getByTestId('mock-component');
    expect(component).toBeInTheDocument();
    expect(component).toHaveTextContent('Mock Component');
  });

  it('should render with title when provided', () => {
    render(
      <ComponentExample
        component={MockComponent}
        title="Test Component"
      />
    );

    expect(screen.getByText('Test Component')).toBeInTheDocument();
  });

  it('should handle variant switching', () => {
    const { rerender } = render(
      <ComponentExample
        component={MockComponent}
        variants={['primary', 'secondary']}
      />
    );

    // Check that variant buttons are rendered
    expect(screen.getByRole('button', { name: /primary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /secondary/i })).toBeInTheDocument();

    // Check that component renders with default variant (first in array)
    const component = screen.getByTestId('mock-component');
    expect(component).toHaveAttribute('data-variant', 'primary');
  });

  it('should switch component variant when variant button is clicked', async () => {
    const { user } = render(
      <ComponentExample
        component={MockComponent}
        variants={['primary', 'secondary']}
      />
    );

    // Click secondary variant button
    const secondaryButton = screen.getByRole('button', { name: /secondary/i });
    await user.click(secondaryButton);

    // Check that component now has secondary variant
    const component = screen.getByTestId('mock-component');
    expect(component).toHaveAttribute('data-variant', 'secondary');
  });

  it('should display code when provided', () => {
    const testCode = '<MockComponent variant="primary" />';
    render(
      <ComponentExample
        component={MockComponent}
        code={testCode}
      />
    );

    expect(screen.getByText(testCode)).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(
      <ComponentExample
        component={MockComponent}
        className="custom-class"
      />
    );

    const container = screen.getByRole('region');
    expect(container).toHaveClass('custom-class');
  });

  it('should have proper accessibility attributes', () => {
    render(
      <ComponentExample
        component={MockComponent}
        title="Accessible Example"
      />
    );

    const container = screen.getByRole('region');
    expect(container).toHaveAttribute('aria-label', 'Accessible Example');
  });
});