import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Heading,
  HStack,
  Stack,
  Tag,
  Text,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import type { ToolDefinition } from './ToolRegistry'
import { getToolBySlug } from './ToolRegistry'

type ToolPageProps = {
  initialTool?: ToolDefinition
}

const ToolPage = ({ initialTool }: ToolPageProps) => {
  const { slug } = useParams<{ slug: string }>()
  const tool = initialTool ?? (slug ? getToolBySlug(slug) : undefined)

  if (!tool) {
    return (
      <Box borderWidth={1} borderColor="gray.100" borderRadius="md" p={6} bg="white">
        <Stack spacing={3}>
          <Heading size="md">Tool not found</Heading>
          <Text color="gray.600">The requested tool does not exist in the registry.</Text>
          <Button as={RouterLink} to="/" colorScheme="blue" alignSelf="start">
            Back to tools
          </Button>
        </Stack>
      </Box>
    )
  }

  const ToolComponent = tool.component

  return (
    <Stack spacing={6}>
      <Breadcrumb separator="/">
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/">
            Tools
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>{tool.name}</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Stack spacing={3}>
        <HStack spacing={3} align="center">
          {tool.icon && (
            <Box boxSize={10} borderRadius="full" bg="blue.50" display="grid" placeItems="center" fontSize="xl">
              {tool.icon}
            </Box>
          )}
          <Stack spacing={1}>
            <Heading size="lg">{tool.name}</Heading>
            <Text color="gray.600">{tool.description}</Text>
          </Stack>
        </HStack>
        <Wrap spacing={2}>
          {tool.tags.map((tag) => (
            <WrapItem key={tag}>
              <Tag colorScheme="blue" variant="subtle">
                {tag}
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </Stack>

      <ToolComponent />
    </Stack>
  )
}

export default ToolPage
