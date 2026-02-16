/**
 * @ui8kit/mdx-react/service
 * 
 * Service adapter for MDX documentation generation.
 * Implements IService interface for Orchestrator integration.
 * 
 * @example
 * ```typescript
 * import { MdxService } from '@ui8kit/mdx-react/service';
 * 
 * const service = new MdxService();
 * await service.initialize(context);
 * const result = await service.execute({
 *   docsDir: './docs',
 *   outputDir: './dist/html',
 * });
 * ```
 */

export {
  MdxService,
  type MdxServiceInput,
  type MdxServiceOutput,
  type MdxServiceContext,
  type MdxServiceOptions,
  type MdxFileSystem,
  type MdxLogger,
  type MdxEventBus,
} from './MdxService'
