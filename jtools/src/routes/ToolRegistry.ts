import type { ComponentType } from 'react'
import JsonFormatter from '../tools/json-formatter'
import UrlEncoder from '../tools/url-encoder'
import UuidGenerator from '../tools/uuid-generator'

export type ToolDefinition = {
  slug: string
  name: string
  description: string
  tags: string[]
  icon?: string
  component: ComponentType
}

export const toolRegistry: ToolDefinition[] = [
  {
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, pretty-print, and minify JSON payloads for easy sharing.',
    tags: ['data', 'formatting', 'json'],
    icon: '🧩',
    component: JsonFormatter,
  },
  {
    slug: 'url-encoder',
    name: 'URL Encoder / Decoder',
    description: 'Encode or decode URL query parameters to keep web requests tidy.',
    tags: ['web', 'networking', 'encoding'],
    icon: '🔗',
    component: UrlEncoder,
  },
  {
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate RFC 4122 UUIDs for identifiers, tracking, or prototyping.',
    tags: ['ids', 'randomness', 'utilities'],
    icon: '✨',
    component: UuidGenerator,
  },
]

export const getToolBySlug = (slug: string) => toolRegistry.find((tool) => tool.slug === slug)
