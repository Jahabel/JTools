import type { ComponentType } from 'react'
import { jsonFormatterDefinition } from '../tools/json-formatter'
import { urlEncoderDefinition } from '../tools/url-encoder'
import { uuidGeneratorDefinition } from '../tools/uuid-generator'

export type ToolDefinition = {
  slug: string
  name: string
  description: string
  tags: string[]
  icon?: string
  component: ComponentType
}

export const toolRegistry: ToolDefinition[] = [
  jsonFormatterDefinition,
  urlEncoderDefinition,
  uuidGeneratorDefinition,
]

export const getToolBySlug = (slug: string) => toolRegistry.find((tool) => tool.slug === slug)
