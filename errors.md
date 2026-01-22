@ui8kit/generator:dev: src/core/interfaces/IConfig.ts:155:3 - error TS2739: Type '{ mode: "tailwind"; }' is missing the following properties from type '{ viewsDir: string; routes: Record<string, RouteConfig>; outputDir: string; mode?: "tailwind" | "semantic" | "inline" | undefined; partials?: { sourceDir: string; outputDir?: string | undefined; props?: Record<...> | undefined; } | undefined; stripDataClassInTailwind?: boolean | undefined; layout?: { ...; } | undefi...': viewsDir, routes, outputDir
@ui8kit/generator:dev: [vite:dts] Start rollup declaration files...
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 155   html: {
@ui8kit/generator:dev:       ~~~~
@ui8kit/generator:dev: 
@ui8kit/generator:dev:   src/core/interfaces/IConfig.ts:49:3
@ui8kit/generator:dev:     49   html: {
@ui8kit/generator:dev:          ~~~~
@ui8kit/generator:dev:     The expected type comes from property 'html' which is declared here on type 'Partial<GeneratorConfig>'
@ui8kit/generator:dev: src/generate.ts:143:51 - error TS2353: Object literal may only specify known properties, and 'converterMode' does not exist in type 'CssServiceOptions'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 143     orchestrator.registerService(new CssService({ converterMode: 'service' }));
@ui8kit/generator:dev:                                                       ~~~~~~~~~~~~~
@ui8kit/generator:dev: src/generate.ts:148:27 - error TS2345: Argument of type 'LayoutStage' is not assignable to parameter of type 'IPipelineStage<unknown, unknown>'.
@ui8kit/generator:dev:   Type 'LayoutStage' is missing the following properties from type 'IPipelineStage<unknown, unknown>': order, enabled, canExecute
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 148     orchestrator.addStage(new LayoutStage());
@ui8kit/generator:dev:                               ~~~~~~~~~~~~~~~~~
@ui8kit/generator:dev: src/generate.ts:149:27 - error TS2345: Argument of type 'ViewStage' is not assignable to parameter of type 'IPipelineStage<unknown, unknown>'.
@ui8kit/generator:dev:   Type 'ViewStage' is missing the following properties from type 'IPipelineStage<unknown, unknown>': order, enabled, canExecute
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 149     orchestrator.addStage(new ViewStage());
@ui8kit/generator:dev:                               ~~~~~~~~~~~~~~~
@ui8kit/generator:dev: src/generate.ts:150:27 - error TS2345: Argument of type 'CssStage' is not assignable to parameter of type 'IPipelineStage<unknown, unknown>'.
@ui8kit/generator:dev:   Type 'CssStage' is missing the following properties from type 'IPipelineStage<unknown, unknown>': order, enabled, canExecute
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 150     orchestrator.addStage(new CssStage());
@ui8kit/generator:dev:                               ~~~~~~~~~~~~~~
@ui8kit/generator:dev: src/generate.ts:151:27 - error TS2345: Argument of type 'HtmlStage' is not assignable to parameter of type 'IPipelineStage<unknown, unknown>'.
@ui8kit/generator:dev:   Type 'HtmlStage' is missing the following properties from type 'IPipelineStage<unknown, unknown>': order, enabled, canExecute
@ui8kit/generator:dev: 
@ui8kit/generator:dev: Analysis will use the bundled TypeScript version 5.8.2
@ui8kit/generator:dev: 151     orchestrator.addStage(new HtmlStage());
@ui8kit/generator:dev: *** The target project appears to use TypeScript 5.9.3 which is newer than the bundled compiler engine; consider upgrading API Extractor.
@ui8kit/generator:dev:                               ~~~~~~~~~~~~~~~
@ui8kit/generator:dev: src/generate.ts:152:27 - error TS2345: Argument of type 'AssetStage' is not assignable to parameter of type 'IPipelineStage<unknown, unknown>'.
@ui8kit/generator:dev:   Type 'AssetStage' is missing the following properties from type 'IPipelineStage<unknown, unknown>': order, enabled, canExecute
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 152     orchestrator.addStage(new AssetStage());
@ui8kit/generator:dev:                               ~~~~~~~~~~~~~~~~
@ui8kit/generator:dev: src/generate.ts:237:34 - error TS2345: Argument of type '{ config: any; logger: any; eventBus: { emit: () => void; on: () => () => void; once: () => () => void; off: () => void; removeAllListeners: () => void; listenerCount: () => number; }; registry: { has: () => boolean; resolve: () => never; }; }' is not assignable to 
parameter of type 'IServiceContext'.
@ui8kit/generator:dev:   Types of property 'registry' are incompatible.
@ui8kit/generator:dev:     Type '{ has: () => boolean; resolve: () => never; }' is missing the following properties from type 'IServiceRegistry': register, getServiceNames, 
getInitializationOrder, initializeAll, disposeAll
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 237   await renderService.initialize(minimalContext);
@ui8kit/generator:dev:                                      ~~~~~~~~~~~~~~
@ui8kit/generator:dev: src/generate.ts:321:37 - error TS2345: Argument of type '{ config: any; logger: any; eventBus: { emit: () => void; on: () => () => void; once: () => () => void; off: () => void; removeAllListeners: () => void; listenerCount: () => number; }; registry: { has: () => boolean; resolve: () => never; }; }' is not assignable to 
parameter of type 'IServiceContext'.
@ui8kit/generator:dev:   Types of property 'registry' are incompatible.
@ui8kit/generator:dev:     Type '{ has: () => boolean; resolve: () => never; }' is missing the following properties from type 'IServiceRegistry': register, getServiceNames, 
getInitializationOrder, initializeAll, disposeAll
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 321   await converterService.initialize(minimalContext);
@ui8kit/generator:dev:                                         ~~~~~~~~~~~~~~
@ui8kit/generator:dev: src/index.ts:72:3 - error TS2305: Module '"./services"' has no exported member 'LayoutTemplateConfig'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 72   LayoutTemplateConfig,
@ui8kit/generator:dev:      ~~~~~~~~~~~~~~~~~~~~
@ui8kit/generator:dev: src/index.ts:77:3 - error TS2305: Module '"./services"' has no exported member 'RouterParser'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 77   RouterParser,
@ui8kit/generator:dev:      ~~~~~~~~~~~~
@ui8kit/generator:dev: src/index.ts:82:3 - error TS2305: Module '"./services"' has no exported member 'CssOutputFileNames'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 82   CssOutputFileNames,
@ui8kit/generator:dev:      ~~~~~~~~~~~~~~~~~~
@ui8kit/generator:dev: src/index.ts:87:3 - error TS2305: Module '"./services"' has no exported member 'CssFileNames'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 87   CssFileNames,
@ui8kit/generator:dev:      ~~~~~~~~~~~~
@ui8kit/generator:dev: src/plugins/PluginManager.ts:81:20 - error TS2339: Property 'setup' does not exist on type 'PluginDefinition'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 81       await plugin.setup(context);
@ui8kit/generator:dev:                       ~~~~~
@ui8kit/generator:dev: src/plugins/PluginManager.ts:138:18 - error TS2339: Property 'teardown' does not exist on type 'PluginDefinition'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 138       if (plugin.teardown) {
@ui8kit/generator:dev:                      ~~~~~~~~
@ui8kit/generator:dev: src/plugins/PluginManager.ts:139:22 - error TS2339: Property 'teardown' does not exist on type 'PluginDefinition'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 139         await plugin.teardown();
@ui8kit/generator:dev:                          ~~~~~~~~
@ui8kit/generator:dev: src/plugins/PluginManager.ts:164:5 - error TS2353: Object literal may only specify known properties, and 'setup' does not exist in type 'PluginDefinition'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 164     setup: async (context) => {
@ui8kit/generator:dev:         ~~~~~
@ui8kit/generator:dev: src/plugins/PluginManager.ts:164:19 - error TS7006: Parameter 'context' implicitly has an 'any' type.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 164     setup: async (context) => {
@ui8kit/generator:dev:                       ~~~~~~~
@ui8kit/generator:dev: src/services/html-converter/HtmlConverterService.ts:85:38 - error TS2339: Property 'mappings' does not exist on type '{}'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 85     const mappings = context.config?.mappings;
@ui8kit/generator:dev:                                         ~~~~~~~~
@ui8kit/generator:dev: src/services/html/HtmlService.ts:109:54 - error TS2339: Property 'css' does not exist on type '{}'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 109         const pureCssFileName = this.context.config?.css?.outputFiles?.pureCss ?? 'ui8kit.local.css';
@ui8kit/generator:dev:                                                          ~~~
@ui8kit/generator:dev: src/services/index.ts:37:3 - error TS2305: Module '"./css"' has no exported member 'CssConverter'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 37   CssConverter,
@ui8kit/generator:dev:      ~~~~~~~~~~~~
@ui8kit/generator:dev: src/stages/AssetStage.ts:9:14 - error TS2420: Class 'AssetStage' incorrectly implements interface 'IPipelineStage<unknown, unknown>'.
@ui8kit/generator:dev:   Type 'AssetStage' is missing the following properties from type 'IPipelineStage<unknown, unknown>': order, enabled, canExecute
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 9 export class AssetStage implements IPipelineStage {
@ui8kit/generator:dev:                ~~~~~~~~~~
@ui8kit/generator:dev: src/stages/AssetStage.ts:25:26 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 25     const cssSourceDir = config.css?.outputDir ?? './dist/css';
@ui8kit/generator:dev:                             ~~~~~~
@ui8kit/generator:dev: src/stages/AssetStage.ts:26:23 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 26     const outputDir = config.html?.outputDir ?? './dist/html';
@ui8kit/generator:dev:                          ~~~~~~
@ui8kit/generator:dev: src/stages/AssetStage.ts:27:18 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 27     const mode = config.html?.mode ?? 'tailwind';
@ui8kit/generator:dev:                     ~~~~~~
@ui8kit/generator:dev: src/stages/AssetStage.ts:33:20 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 33       jsSourceDir: config.assets?.jsDir,
@ui8kit/generator:dev:                       ~~~~~~
@ui8kit/generator:dev: src/stages/AssetStage.ts:34:18 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 34       publicDir: config.assets?.publicDir,
@ui8kit/generator:dev:                     ~~~~~~
@ui8kit/generator:dev: src/stages/AssetStage.ts:40:13 - error TS2339: Property 'state' does not exist on type 'IPipelineContext'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 40     context.state.set('asset:result', result);
@ui8kit/generator:dev:                ~~~~~
@ui8kit/generator:dev: src/stages/CssStage.ts:9:14 - error TS2420: Class 'CssStage' incorrectly implements interface 'IPipelineStage<unknown, unknown>'.
@ui8kit/generator:dev:   Type 'CssStage' is missing the following properties from type 'IPipelineStage<unknown, unknown>': order, enabled, canExecute
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 9 export class CssStage implements IPipelineStage {
@ui8kit/generator:dev:                ~~~~~~~~
@ui8kit/generator:dev: src/stages/CssStage.ts:25:22 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 25     const viewsDir = config.html?.viewsDir ?? './views';
@ui8kit/generator:dev:                         ~~~~~~
@ui8kit/generator:dev: src/stages/CssStage.ts:26:23 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 26     const outputDir = config.css?.outputDir ?? './dist/css';
@ui8kit/generator:dev:                          ~~~~~~
@ui8kit/generator:dev: src/stages/CssStage.ts:27:20 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 27     const routes = config.html?.routes ?? {};
@ui8kit/generator:dev:                       ~~~~~~
@ui8kit/generator:dev: src/stages/CssStage.ts:28:21 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 28     const pureCss = config.css?.pureCss ?? false;
@ui8kit/generator:dev:                        ~~~~~~
@ui8kit/generator:dev: src/stages/CssStage.ts:37:17 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 37       mappings: config.mappings,
@ui8kit/generator:dev:                    ~~~~~~
@ui8kit/generator:dev: src/stages/CssStage.ts:41:13 - error TS2339: Property 'state' does not exist on type 'IPipelineContext'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 41     context.state.set('css:result', result);
@ui8kit/generator:dev:                ~~~~~
@ui8kit/generator:dev: src/stages/HtmlStage.ts:9:14 - error TS2420: Class 'HtmlStage' incorrectly implements interface 'IPipelineStage<unknown, unknown>'.
@ui8kit/generator:dev:   Type 'HtmlStage' is missing the following properties from type 'IPipelineStage<unknown, unknown>': order, enabled, canExecute
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 9 export class HtmlStage implements IPipelineStage {
@ui8kit/generator:dev:                ~~~~~~~~~
@ui8kit/generator:dev: src/stages/HtmlStage.ts:25:22 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 25     const viewsDir = config.html?.viewsDir ?? './views';
@ui8kit/generator:dev:                         ~~~~~~
@ui8kit/generator:dev: src/stages/HtmlStage.ts:26:23 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 26     const outputDir = config.html?.outputDir ?? './dist/html';
@ui8kit/generator:dev:                          ~~~~~~
@ui8kit/generator:dev: src/stages/HtmlStage.ts:27:20 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 27     const routes = config.html?.routes ?? {};
@ui8kit/generator:dev:                       ~~~~~~
@ui8kit/generator:dev: src/stages/HtmlStage.ts:28:18 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 28     const mode = config.html?.mode ?? 'tailwind';
@ui8kit/generator:dev:                     ~~~~~~
@ui8kit/generator:dev: src/stages/HtmlStage.ts:29:26 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 29     const cssOutputDir = config.css?.outputDir ?? './dist/css';
@ui8kit/generator:dev:                             ~~~~~~
@ui8kit/generator:dev: src/stages/HtmlStage.ts:38:33 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 38       stripDataClassInTailwind: config.html?.stripDataClass,
@ui8kit/generator:dev:                                    ~~~~~~
@ui8kit/generator:dev: src/stages/HtmlStage.ts:40:18 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 40       appConfig: config.app,
@ui8kit/generator:dev:                     ~~~~~~
@ui8kit/generator:dev: src/stages/HtmlStage.ts:44:13 - error TS2339: Property 'state' does not exist on type 'IPipelineContext'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 44     context.state.set('html:result', result);
@ui8kit/generator:dev:                ~~~~~
@ui8kit/generator:dev: src/stages/LayoutStage.ts:9:14 - error TS2420: Class 'LayoutStage' incorrectly implements interface 'IPipelineStage<unknown, unknown>'.
@ui8kit/generator:dev:   Type 'LayoutStage' is missing the following properties from type 'IPipelineStage<unknown, unknown>': order, enabled, canExecute
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 9 export class LayoutStage implements IPipelineStage {
@ui8kit/generator:dev:                ~~~~~~~~~~~
@ui8kit/generator:dev: src/stages/LayoutStage.ts:25:22 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 25     const viewsDir = config.html?.viewsDir ?? './views';
@ui8kit/generator:dev:                         ~~~~~~
@ui8kit/generator:dev: src/stages/LayoutStage.ts:32:13 - error TS2339: Property 'state' does not exist on type 'IPipelineContext'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 32     context.state.set('layout:result', result);
@ui8kit/generator:dev:                ~~~~~
@ui8kit/generator:dev: src/stages/ViewStage.ts:9:14 - error TS2420: Class 'ViewStage' incorrectly implements interface 'IPipelineStage<unknown, unknown>'.
@ui8kit/generator:dev:   Type 'ViewStage' is missing the following properties from type 'IPipelineStage<unknown, unknown>': order, enabled, canExecute
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 9 export class ViewStage implements IPipelineStage {
@ui8kit/generator:dev:                ~~~~~~~~~
@ui8kit/generator:dev: src/stages/ViewStage.ts:25:23 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 25     const entryPath = config.css?.entryPath ?? './src/main.tsx';
@ui8kit/generator:dev:                          ~~~~~~
@ui8kit/generator:dev: src/stages/ViewStage.ts:26:22 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 26     const viewsDir = config.html?.viewsDir ?? './views';
@ui8kit/generator:dev:                         ~~~~~~
@ui8kit/generator:dev: src/stages/ViewStage.ts:27:20 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 27     const routes = config.html?.routes ?? {};
@ui8kit/generator:dev:                       ~~~~~~
@ui8kit/generator:dev: src/stages/ViewStage.ts:35:17 - error TS18046: 'config' is of type 'unknown'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 35       partials: config.html?.partials,
@ui8kit/generator:dev:                    ~~~~~~
@ui8kit/generator:dev: src/stages/ViewStage.ts:39:13 - error TS2339: Property 'state' does not exist on type 'IPipelineContext'.
@ui8kit/generator:dev: 
@ui8kit/generator:dev: 39     context.state.set('view:result', result);
@ui8kit/generator:dev:                ~~~~~
@ui8kit/generator:dev: 
@ui8kit/generator:dev: [vite:dts] Internal Error: Unable to analyze the export "LayoutTemplateConfig" in
@ui8kit/generator:dev: E:/_@Bun/@ui8kit-generate/packages/generator/dist/services/index.d.ts
@ui8kit/generator:dev: 