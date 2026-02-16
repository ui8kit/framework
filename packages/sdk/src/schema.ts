import { z } from 'zod';
import { SDK_SCHEMA_URL, SDK_CONFIG_VERSION } from './constants';

export const appConfigSchema = z.object({
  $schema: z.string().optional().default(SDK_SCHEMA_URL),
  configVersion: z.string().optional().default(SDK_CONFIG_VERSION),
  brand: z.string().min(1),
  framework: z.literal('vite-react'),
  typescript: z.boolean().optional().default(true),
  target: z.enum(['react', 'liquid', 'handlebars', 'twig', 'latte']),
  outDir: z.string().optional().default('dist/react'),
  aliases: z.record(z.string(), z.string()),
  fixtures: z.string().default('./fixtures'),
  tokens: z.string().default('./src/css/shadcn.css'),
  componentsDir: z.string().default('./src/components'),
  blocksDir: z.string().optional().default('./src/blocks'),
  layoutsDir: z.string().optional().default('./src/layouts'),
  partialsDir: z.string().optional().default('./src/partials'),
  libDir: z.string().default('./src/lib'),
  registry: z.string().optional().default('@ui8kit'),
  lint: z
    .object({
      strict: z.boolean().optional().default(false),
      dsl: z.boolean().optional().default(true),
    })
    .optional()
    .default({ strict: false, dsl: true }),
});
