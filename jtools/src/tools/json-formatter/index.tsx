import { useMemo, useState } from 'react'
import { Box, Button, Code, Heading, HStack, Stack, Text, Textarea, Tooltip, useToast } from '@chakra-ui/react'

const JsonFormatter = () => {
  const [input, setInput] = useState('{\n  "message": "Hello, world!"\n}')
  const [formatted, setFormatted] = useState('')
  const [error, setError] = useState('')
  const toast = useToast()

  const isDisabled = useMemo(() => !input.trim(), [input])

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(input)
      setFormatted(JSON.stringify(parsed, null, 2))
      setError('')
    } catch (err) {
      setFormatted('')
      setError(err instanceof Error ? err.message : 'Unable to format JSON')
      toast({
        title: 'Invalid JSON',
        description: 'Please provide valid JSON before formatting.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(input)
      setFormatted(JSON.stringify(parsed))
      setError('')
    } catch (err) {
      setFormatted('')
      setError(err instanceof Error ? err.message : 'Unable to minify JSON')
    }
  }

  return (
    <Stack spacing={6}>
      <Stack spacing={4}>
        <Textarea
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste JSON here"
          minH="200px"
          bg="white"
        />

        <HStack spacing={3}>
          <Button colorScheme="blue" onClick={handleFormat} isDisabled={isDisabled}>
            Format JSON
          </Button>
          <Button variant="outline" onClick={handleMinify} isDisabled={isDisabled}>
            Minify JSON
          </Button>
          {error && (
            <Tooltip label={error} placement="right">
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            </Tooltip>
          )}
        </HStack>

        <Box borderWidth={1} borderColor="gray.200" borderRadius="md" bg="gray.900" color="green.100" p={4}>
          <Stack spacing={2}>
            <Heading size="sm">Output</Heading>
            {formatted ? (
              <Code whiteSpace="pre" width="full" display="block" bg="transparent" color="inherit">
                {formatted}
              </Code>
            ) : (
              <Text color="gray.400">Formatted JSON will appear here.</Text>
            )}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  )
}

export default JsonFormatter
