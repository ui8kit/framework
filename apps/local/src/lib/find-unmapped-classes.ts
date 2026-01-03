/**
 * Find all UI8Kit classes that still need CSS mapping
 * Extracts classes with CSS mapping needed comments
 */

import cssMappingRaw from './ui8kit-css-mapping.json';

// Cast to typed mapping
const cssMapping = cssMappingRaw as Record<string, string>;

/**
 * Find all classes that need CSS mapping
 */
function findUnmappedClasses(): string[] {
  const unmapped: string[] = [];

  for (const [className, css] of Object.entries(cssMapping)) {
    if (css.startsWith('/*') && css.includes('CSS mapping needed')) {
      unmapped.push(className);
    }
  }

  return unmapped.sort();
}

/**
 * Group unmapped classes by category for easier processing
 */
function groupUnmappedClasses(unmapped: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};

  for (const className of unmapped) {
    // Extract prefix (everything before first dash or number)
    const prefix = className.split(/[-0-9]/)[0];

    if (!groups[prefix]) {
      groups[prefix] = [];
    }
    groups[prefix].push(className);
  }

  // Sort groups and classes within groups
  const sortedGroups: Record<string, string[]> = {};
  const sortedKeys = Object.keys(groups).sort();

  for (const key of sortedKeys) {
    sortedGroups[key] = groups[key].sort();
  }

  return sortedGroups;
}

/**
 * Generate a processing plan for unmapped classes
 */
function generateProcessingPlan(groups: Record<string, string[]>): string {
  let plan = '# UI8Kit CSS Mapping Processing Plan\n\n';
  plan += `Total unmapped classes: ${Object.values(groups).flat().length}\n\n`;

  for (const [category, classes] of Object.entries(groups)) {
    plan += `## ${category} (${classes.length} classes)\n\n`;

    // Show first few examples
    const examples = classes.slice(0, 5);
    for (const cls of examples) {
      plan += `- \`${cls}\`\n`;
    }

    if (classes.length > 5) {
      plan += `- ... and ${classes.length - 5} more\n`;
    }

    // Add processing hints based on category
    plan += '\n**Processing hint:** ';
    switch (category) {
      case 'backdrop':
        plan += 'CSS backdrop-filter properties with vendor prefixes';
        break;
      case 'animate':
        plan += 'CSS animations and keyframes';
        break;
      case 'scroll':
        plan += 'CSS scroll properties (scroll-margin, scroll-padding)';
        break;
      case 'content':
        plan += 'CSS content property for ::before/::after pseudo-elements';
        break;
      case 'transform':
        plan += 'CSS transform functions (translate, rotate, scale, skew)';
        break;
      case 'transition':
        plan += 'CSS transition properties';
        break;
      case 'will':
        plan += 'CSS will-change property';
        break;
      case 'isolate':
        plan += 'CSS isolation property';
        break;
      case 'mix':
        plan += 'CSS mix-blend-mode property';
        break;
      case 'forced':
        plan += 'CSS forced-color-adjust property';
        break;
      case 'aspect':
        plan += 'CSS aspect-ratio property';
        break;
      case 'object':
        plan += 'CSS object-fit and object-position properties';
        break;
      case 'list':
        plan += 'CSS list-style properties';
        break;
      case 'appearance':
        plan += 'CSS appearance property';
        break;
      case 'columns':
        plan += 'CSS columns (multi-column layout) properties';
        break;
      case 'space':
        plan += 'CSS margin utilities for child elements';
        break;
      case 'divide':
        plan += 'CSS border utilities for child elements';
        break;
      case 'ring':
        plan += 'CSS box-shadow for focus rings';
        break;
      case 'scale':
      case 'rotate':
      case 'translate':
      case 'skew':
        plan += 'CSS transform functions';
        break;
      case 'opacity':
        plan += 'CSS opacity values (0.05, 0.1, 0.25, etc.)';
        break;
      default:
        plan += 'Standard CSS properties - check Tailwind documentation';
    }
    plan += '\n\n';
  }

  return plan;
}

// Main execution
if (import.meta.main) {
  const unmapped = findUnmappedClasses();
  const groups = groupUnmappedClasses(unmapped);

  console.log(`Found ${unmapped.length} unmapped classes`);
  console.log('Grouped by category:');

  for (const [category, classes] of Object.entries(groups)) {
    console.log(`- ${category}: ${classes.length} classes`);
  }

  // Save detailed report
  const fs = require('fs');
  fs.writeFileSync('unmapped-classes-report.md', generateProcessingPlan(groups));
  fs.writeFileSync('unmapped-classes.json', JSON.stringify(unmapped, null, 2));

  console.log('\nSaved reports:');
  console.log('- unmapped-classes-report.md (processing plan)');
  console.log('- unmapped-classes.json (raw list)');
}
