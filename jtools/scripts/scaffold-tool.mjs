import { existsSync } from 'node:fs'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { stdin as input, stdout as output } from 'node:process'
import { createInterface } from 'node:readline/promises'
import { fileURLToPath } from 'node:url'

const rl = createInterface({ input, output })

const question = async (prompt, defaultValue) => {
  const suffix = defaultValue ? ` (${defaultValue})` : ''
  const answer = (await rl.question(`${prompt}${suffix}: `)).trim()
  return answer || defaultValue || ''
}

const toSlug = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

const toCamelCase = (value) =>
  value
    .split('-')
    .filter(Boolean)
    .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join('')

const toPascalCase = (value) => {
  const camel = toCamelCase(value)
  return camel ? camel.charAt(0).toUpperCase() + camel.slice(1) : ''
}

const getProjectRoot = () => path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const ensureUniqueSlug = (slug, registryContent) => {
  if (registryContent.includes(`slug: '${slug}'`) || registryContent.includes(`slug: "${slug}"`)) {
    throw new Error(`Tool slug "${slug}" already exists in ToolRegistry.`)
  }
}

const insertImport = (lines, definitionName, slug) => {
  const importStatement = `import { ${definitionName} } from '../tools/${slug}'`
  let lastImportIndex = -1

  lines.forEach((line, index) => {
    if (line.startsWith('import ')) {
      lastImportIndex = index
    }
  })

  if (lastImportIndex === -1) throw new Error('Could not find import section in ToolRegistry.ts')

  lines.splice(lastImportIndex + 1, 0, importStatement)
}

const insertRegistryEntry = (lines, definitionName) => {
  const registryStart = lines.findIndex((line) => line.includes('export const toolRegistry'))
  if (registryStart === -1) throw new Error('Could not find toolRegistry definition')

  const closingBracketOffset = lines.slice(registryStart).findIndex((line) => line.trim() === ']')
  if (closingBracketOffset === -1) throw new Error('Could not find closing bracket for toolRegistry')

  const insertionIndex = registryStart + closingBracketOffset
  lines.splice(insertionIndex, 0, `  ${definitionName},`)
}

const createToolFiles = async ({ name, slug, description, tags, icon }) => {
  const projectRoot = getProjectRoot()
  const toolsDir = path.join(projectRoot, 'src', 'tools', slug)

  if (existsSync(toolsDir)) {
    throw new Error(`Directory already exists for slug "${slug}" at ${toolsDir}`)
  }

  await mkdir(toolsDir, { recursive: true })

  const componentName = `${toPascalCase(slug)}Tool`
  const definitionName = `${toCamelCase(slug)}Definition`

  const tagsArray = tags.map((tag) => `'${tag}'`).join(', ')
  const iconLine = icon ? `\n  icon: '${icon}',` : ''

  const content = `import { Text } from '@chakra-ui/react'
import ToolShell from '../../components/ToolShell'
import type { ToolDefinition } from '../../routes/ToolRegistry'

const ${componentName} = () => {
  return (
    <ToolShell
      title={${definitionName}.name}
      description={${definitionName}.description}
      tags={${definitionName}.tags}
      hero={${definitionName}.icon}
    >
      <Text>Build the UI for ${name} here.</Text>
    </ToolShell>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const ${definitionName}: ToolDefinition = {
  slug: '${slug}',
  name: '${name}',
  description: '${description}',
  tags: [${tagsArray}],${iconLine}
  component: ${componentName},
}

export default ${componentName}
`

  await writeFile(path.join(toolsDir, 'index.tsx'), content, 'utf8')

  return { definitionName }
}

const updateRegistry = async ({ definitionName, slug }) => {
  const projectRoot = getProjectRoot()
  const registryPath = path.join(projectRoot, 'src', 'routes', 'ToolRegistry.ts')
  const registryContent = await readFile(registryPath, 'utf8')

  ensureUniqueSlug(slug, registryContent)

  const lines = registryContent.split('\n')
  insertImport(lines, definitionName, slug)
  insertRegistryEntry(lines, definitionName)

  await writeFile(registryPath, lines.join('\n'), 'utf8')
}

const main = async () => {
  try {
    const name = await question('Tool name')
    if (!name) throw new Error('Tool name is required.')

    const suggestedSlug = toSlug(name)
    const slug = toSlug(await question('Tool slug', suggestedSlug))
    if (!slug) throw new Error('Tool slug is required.')

    const description = await question('Short description')
    if (!description) throw new Error('A short description is required.')

    const tagsInput = await question('Comma-separated tags')
    const tags = tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    if (tags.length === 0) throw new Error('At least one tag is required.')

    const icon = await question('Icon (emoji or text, optional)')

    const { definitionName } = await createToolFiles({ name, slug, description, tags, icon })
    await updateRegistry({ definitionName, slug })

    console.log(`\nCreated tool \"${name}\" in src/tools/${slug} and registered it in ToolRegistry.`)
  } catch (error) {
    console.error(error instanceof Error ? error.message : error)
  } finally {
    rl.close()
  }
}

main()
