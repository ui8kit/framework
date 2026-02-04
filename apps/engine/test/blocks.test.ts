/**
 * Block Generation Tests
 * 
 * Tests that blocks from @ui8kit/blocks generate valid templates
 * for both Liquid and Handlebars engines.
 */

import { describe, it, expect } from 'vitest';
import { TemplateService } from '../../../packages/generator/src/services/template/TemplateService';
import { resolve } from 'path';

describe('Block Template Generation', () => {
  const sourceDir = resolve(process.cwd(), '../../packages/blocks/src');
  const outputDir = resolve(process.cwd(), './dist/test-templates');

  it('should generate Liquid templates from blocks', async () => {
    const service = new TemplateService();
    
    await service.initialize({
      appRoot: process.cwd(),
      outputDir,
      logger: console,
      config: {},
    });

    const result = await service.execute({
      sourceDirs: [sourceDir],
      outputDir: resolve(outputDir, 'liquid'),
      engine: 'liquid',
      include: ['**/HeroBlock.tsx'],
      exclude: ['**/*.test.tsx', '**/index.ts'],
      verbose: false,
    });

    expect(result.errors).toHaveLength(0);
    expect(result.files.length).toBeGreaterThan(0);
    
    // Check that HeroBlock was processed
    const heroFile = result.files.find(f => f.componentName.includes('Hero'));
    expect(heroFile).toBeDefined();
  });

  it('should generate Handlebars templates from blocks', async () => {
    const service = new TemplateService();
    
    await service.initialize({
      appRoot: process.cwd(),
      outputDir,
      logger: console,
      config: {},
    });

    const result = await service.execute({
      sourceDirs: [sourceDir],
      outputDir: resolve(outputDir, 'handlebars'),
      engine: 'handlebars',
      include: ['**/HeroBlock.tsx'],
      exclude: ['**/*.test.tsx', '**/index.ts'],
      verbose: false,
    });

    expect(result.errors).toHaveLength(0);
    expect(result.files.length).toBeGreaterThan(0);
    
    // Check that HeroBlock was processed
    const heroFile = result.files.find(f => f.componentName.includes('Hero'));
    expect(heroFile).toBeDefined();
  });

  it('should extract variables from blocks', async () => {
    const service = new TemplateService();
    
    await service.initialize({
      appRoot: process.cwd(),
      outputDir,
      logger: console,
      config: {},
    });

    const result = await service.execute({
      sourceDirs: [sourceDir],
      outputDir: resolve(outputDir, 'variables'),
      engine: 'liquid',
      include: ['**/HeroBlock.tsx'],
      exclude: ['**/*.test.tsx', '**/index.ts'],
      verbose: false,
    });

    const heroFile = result.files.find(f => f.componentName.includes('Hero'));
    expect(heroFile).toBeDefined();
    
    // HeroBlock should have variables like title, subtitle, ctaText
    if (heroFile) {
      expect(heroFile.variables.length).toBeGreaterThan(0);
      expect(heroFile.variables).toContain('title');
    }
  });
});
