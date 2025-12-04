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

const validateToolRegistry = (tools: ToolDefinition[]) => {
  if (!import.meta.env.DEV) return

  const seenSlugs = new Set<string>()

  tools.forEach((tool, index) => {
    if (!tool.slug?.trim()) {
      throw new Error(`ToolRegistry: Missing slug for tool at index ${index}.`)
    }

    if (seenSlugs.has(tool.slug)) {
      throw new Error(`ToolRegistry: Duplicate slug detected for "${tool.slug}".`)
    }

    seenSlugs.add(tool.slug)

    if (!tool.name?.trim()) {
      throw new Error(`ToolRegistry: Missing name for tool "${tool.slug}".`)
    }

    if (!tool.description?.trim()) {
      throw new Error(`ToolRegistry: Missing description for tool "${tool.slug}".`)
    }

    if (!Array.isArray(tool.tags) || tool.tags.length === 0 || tool.tags.some((tag) => !tag.trim())) {
      throw new Error(`ToolRegistry: Tool "${tool.slug}" must include at least one tag.`)
    }

    if (!tool.component) {
      throw new Error(`ToolRegistry: Missing component for tool "${tool.slug}".`)
    }
  })
}

validateToolRegistry(toolRegistry)

export const getToolBySlug = (slug: string) => toolRegistry.find((tool) => tool.slug === slug)
