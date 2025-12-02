import { useParams } from 'react-router-dom'
import { Badge, Box, Heading, Stack, Text } from '@chakra-ui/react'

const ToolDetailPage = () => {
  const { slug } = useParams<{ slug: string }>()

  return (
    <Stack spacing={6}>
      <Heading size="lg">Tool details</Heading>
      <Box borderWidth={1} borderColor="gray.100" borderRadius="lg" p={6} bg="white">
        <Badge colorScheme="blue" mb={2}>
          Slug
        </Badge>
        <Text fontSize="xl" fontWeight="semibold">
          {slug}
        </Text>
        <Text mt={4} color="gray.600">
          Use this page to describe the selected tool, outline how it works, and link to documentation or demos.
          Content can be tailored to each tool using the dynamic route parameter above.
        </Text>
      </Box>
    </Stack>
  )
}

export default ToolDetailPage
