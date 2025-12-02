import { useMemo, useState } from 'react'
import { Box, Button, FormControl, FormLabel, Input, Stack, Text, Textarea } from '@chakra-ui/react'

const UrlEncoder = () => {
  const [input, setInput] = useState('https://example.com?message=hello world')
  const [output, setOutput] = useState('')

  const isDisabled = useMemo(() => !input.trim(), [input])

  const encodeValue = () => {
    setOutput(encodeURIComponent(input))
  }

  const decodeValue = () => {
    setOutput(decodeURIComponent(input))
  }

  return (
    <Stack spacing={6}>
      <Stack spacing={4}>
        <FormControl>
          <FormLabel>Value</FormLabel>
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Enter text or a full URL"
            minH="120px"
            bg="white"
          />
        </FormControl>

        <Stack direction={{ base: 'column', md: 'row' }} spacing={3}>
          <Button colorScheme="blue" onClick={encodeValue} isDisabled={isDisabled}>
            Encode
          </Button>
          <Button variant="outline" onClick={decodeValue} isDisabled={isDisabled}>
            Decode
          </Button>
        </Stack>

        <FormControl>
          <FormLabel>Result</FormLabel>
          <Input value={output} readOnly bg="gray.50" placeholder="Encoded or decoded value will appear here" />
        </FormControl>
      </Stack>

      <Box borderWidth={1} borderColor="gray.200" borderRadius="md" p={4} bg="white">
        <Text fontSize="sm" color="gray.600">
          Encoding replaces unsafe URL characters with percent-encoded values so they can be safely transported as part
          of a query string. Decoding reverses the process to make the text human readable again.
        </Text>
      </Box>
    </Stack>
  )
}

export default UrlEncoder
