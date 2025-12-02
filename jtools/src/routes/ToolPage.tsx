import { Link as RouterLink, useParams } from 'react-router-dom'
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Heading, Stack, Text } from '@chakra-ui/react'
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

      <ToolComponent />
    </Stack>
  )
}

export default ToolPage
