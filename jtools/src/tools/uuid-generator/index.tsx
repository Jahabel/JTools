import { useCallback, useState } from 'react'
import { Box, Button, Code, Stack, Text } from '@chakra-ui/react'

const generateUuid = () => crypto.randomUUID()

const UuidGenerator = () => {
  const [uuid, setUuid] = useState(() => generateUuid())

  const handleGenerate = useCallback(() => {
    setUuid(generateUuid())
  }, [])

  return (
    <Stack spacing={6}>
      <Box borderWidth={1} borderColor="gray.200" borderRadius="md" p={4} bg="gray.900" color="blue.100">
        <Stack spacing={3} align="start">
          <Code fontSize="lg" bg="transparent" color="inherit" px={0}>
            {uuid}
          </Code>
          <Button colorScheme="blue" onClick={handleGenerate}>
            Generate new UUID
          </Button>
        </Stack>
      </Box>

      <Text fontSize="sm" color="gray.600">
        UUIDs are random strings that are extremely unlikely to collide. Use them when you need a unique identifier
        without coordinating with a server.
      </Text>
    </Stack>
  )
}

export default UuidGenerator
