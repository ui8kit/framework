import { Generator, type GeneratorConfig, type RouteConfig } from './generator.js';

export { Generator, type GeneratorConfig, type RouteConfig };

export const generator = new Generator();

// Variant scripts
export {
    emitVariantsApplyCss,
    emitVariantsArtifacts,
    type EmitVariantsApplyCssOptions,
    type VariantsArtifacts,
  } from './scripts/emit-variants-apply.js';
  
  export {
    emitVariantElements,
    type EmitVariantElementsOptions,
    type EmitVariantElementsResult,
  } from './scripts/emit-variant-elements.js';