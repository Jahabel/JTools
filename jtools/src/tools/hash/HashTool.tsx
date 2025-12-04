import { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Stack,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import { FiClipboard } from 'react-icons/fi'
import ToolShell from '../../components/ToolShell'
import type { ToolDefinition } from '../../routes/ToolRegistry'

const algorithms = [
  { value: 'SHA-256', label: 'SHA-256 (recommended)' },
  { value: 'SHA-384', label: 'SHA-384' },
  { value: 'SHA-512', label: 'SHA-512' },
  { value: 'SHA-1', label: 'SHA-1 (legacy, limited support)' },
] as const

const arrayBufferToHex = (buffer: ArrayBuffer) =>
  Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')

const HashToolContent = () => {
  const [text, setText] = useState('')
  const [algorithm, setAlgorithm] = useState<(typeof algorithms)[number]['value']>('SHA-256')
  const [hash, setHash] = useState('')
  const [error, setError] = useState('')
  const [isComputing, setIsComputing] = useState(false)
  const toast = useToast()

  const isSubtleAvailable = useMemo(() => typeof crypto !== 'undefined' && Boolean(crypto?.subtle), [])
  const isCalculateDisabled = !text.trim() || !isSubtleAvailable || isComputing

  const calculateHash = useCallback(async () => {
    if (!isSubtleAvailable) {
      setError('Hashing is not supported in this environment.')
      return
    }

    setIsComputing(true)
    setError('')
    setHash('')

    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(text)
      const digest = await crypto.subtle.digest(algorithm, data)
      setHash(arrayBufferToHex(digest))
    } catch (computeError) {
      if (computeError instanceof DOMException && computeError.name === 'NotSupportedError') {
        setError('Selected algorithm is not supported by this browser. Choose another option.')
        return
      }

      const message = computeError instanceof Error ? computeError.message : 'Unable to compute hash.'
      setError(message)
    } finally {
      setIsComputing(false)
    }
  }, [algorithm, isSubtleAvailable, text])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(hash)
      toast({ title: 'Hash copied', description: 'Digest copied to your clipboard.', status: 'success', duration: 2500 })
    } catch {
      toast({ title: 'Unable to copy', description: 'Copy the hash manually instead.', status: 'error' })
    }
  }, [hash, toast])

  return (
    <Stack spacing={6}>
      <FormControl>
        <FormLabel fontWeight="semibold">Text to hash</FormLabel>
        <Textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Paste or type the content you want to hash"
          minH="160px"
          bg="gray.50"
        />
      </FormControl>

      <FormControl>
        <FormLabel fontWeight="semibold">Algorithm</FormLabel>
        <Select value={algorithm} onChange={(event) => setAlgorithm(event.target.value as typeof algorithm)}>
          {algorithms.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
        <FormHelperText color="gray.600">
          Uses the Web Crypto API&apos;s <code>crypto.subtle.digest</code>. MD5 and other insecure algorithms are intentionally
          excluded.
        </FormHelperText>
      </FormControl>

      {error && (
        <Text color="red.500" fontSize="sm" role="alert">
          {error}
        </Text>
      )}

      <HStack spacing={3} align={{ base: 'stretch', md: 'center' }} flexDir={{ base: 'column', md: 'row' }}>
        <Button colorScheme="blue" onClick={calculateHash} isDisabled={isCalculateDisabled} isLoading={isComputing}>
          Calculate
        </Button>
        <Button variant="ghost" onClick={() => setText('')} isDisabled={!text && !hash}>
          Clear
        </Button>
      </HStack>

      <Box borderWidth={1} borderColor="gray.200" borderRadius="md" p={4} bg="gray.900" color="blue.100">
        <Stack spacing={3}>
          <Text fontWeight="semibold">Hash output</Text>
          <InputGroup size="md">
            <Input value={hash} isReadOnly placeholder="Your hash will appear here" bg="gray.800" color="blue.50" />
            <InputRightElement width="3rem">
              <IconButton
                aria-label="Copy hash"
                icon={<FiClipboard />}
                size="sm"
                colorScheme="blue"
                variant="ghost"
                onClick={handleCopy}
                isDisabled={!hash}
              />
            </InputRightElement>
          </InputGroup>
          <Text fontSize="sm" color="blue.100">
            Hashes are deterministic: the same input and algorithm always produce the same output.
          </Text>
        </Stack>
      </Box>
    </Stack>
  )
}

const HashTool = () => {
  return (
    <ToolShell
      title={hashToolDefinition.name}
      description={hashToolDefinition.description}
      tags={hashToolDefinition.tags}
      hero={hashToolDefinition.icon}
    >
      <HashToolContent />
    </ToolShell>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const hashToolDefinition: ToolDefinition = {
  slug: 'hash',
  name: 'Hash Generator',
  description: 'Calculate cryptographic hashes (SHA-1/SHA-2) using the Web Crypto API.',
  tags: ['security', 'utilities', 'encoding'],
  icon: '🧮',
  component: HashTool,
}

export default HashTool
