// Core utilities export - browser-safe only
// For scanner and other Node.js features, use '@ui8kit/mdx-react/server'

export * from './types'
export * from './parser'
export * from './slugify'

// NOTE: scanner.ts is NOT exported here because it uses Node.js fs module
// Import from '@ui8kit/mdx-react/server' instead
