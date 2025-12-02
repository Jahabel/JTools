import { Link as RouterLink, useParams } from 'react-router-dom'
import { Badge, Box, Button, Heading, Stack, Text } from '@chakra-ui/react'
import { getToolBySlug } from './ToolRegistry'

const ToolPage = () => {
  const { slug } = useParams<{ slug: string }>()
  const tool = slug ? getToolBySlug(slug) : undefined

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
      <Stack spacing={2}>
        <Badge colorScheme="blue" alignSelf="start">
          {tool.slug}
        </Badge>
        <Heading size="lg">{tool.name}</Heading>
        <Text color="gray.600">{tool.description}</Text>
      </Stack>

      <ToolComponent />
    </Stack>
  )
}

export default ToolPage
