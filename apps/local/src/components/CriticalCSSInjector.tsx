import { useEffect } from 'react';

interface CriticalCSSInjectorProps {
  /** CSS content to inject into head */
  css: string;
  /** Unique ID for the style element */
  id?: string;
}

/**
 * Component that injects critical CSS directly into the document head
 * for optimal performance - only styles needed for current route
 */
export function CriticalCSSInjector({ css, id = 'critical-css' }: CriticalCSSInjectorProps) {
  useEffect(() => {
    // Remove any existing critical CSS
    const existingStyle = document.getElementById(id);
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.textContent = css;

    // Insert at the beginning of head for highest priority
    document.head.insertBefore(styleElement, document.head.firstChild);

    // Cleanup on unmount
    return () => {
      const styleToRemove = document.getElementById(id);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [css, id]);

  // This component doesn't render anything
  return null;
}

// Hook version for functional components
export function useCriticalCSS(css: string, id = 'critical-css') {
  useEffect(() => {
    const existingStyle = document.getElementById(id);
    if (existingStyle) {
      existingStyle.remove();
    }

    const styleElement = document.createElement('style');
    styleElement.id = id;
    styleElement.textContent = css;

    document.head.insertBefore(styleElement, document.head.firstChild);

    return () => {
      const styleToRemove = document.getElementById(id);
      if (styleToRemove) {
        styleToRemove.remove();
      }
    };
  }, [css, id]);
}
