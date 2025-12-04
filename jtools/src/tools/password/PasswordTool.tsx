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
  SimpleGrid,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Stack,
  Switch,
  Text,
  useToast,
} from '@chakra-ui/react'
import { FiClipboard } from 'react-icons/fi'
import ToolShell from '../../components/ToolShell'
import type { ToolDefinition } from '../../routes/ToolRegistry'

const MIN_LENGTH = 8
const MAX_LENGTH = 64

const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz'
const numberChars = '0123456789'
const symbolChars = '!@#$%^&*()-_=+[]{}|;:,.<>?/'

const PasswordToolContent = () => {
  const [length, setLength] = useState(16)
  const [includeUppercase, setIncludeUppercase] = useState(true)
  const [includeLowercase, setIncludeLowercase] = useState(true)
  const [includeNumbers, setIncludeNumbers] = useState(true)
  const [includeSymbols, setIncludeSymbols] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const toast = useToast()

  const allowedCharacters = useMemo(() => {
    let characters = ''

    if (includeUppercase) characters += uppercaseChars
    if (includeLowercase) characters += lowercaseChars
    if (includeNumbers) characters += numberChars
    if (includeSymbols) characters += symbolChars

    return characters
  }, [includeLowercase, includeNumbers, includeSymbols, includeUppercase])

  const validationError = useMemo(() => {
    if (length < MIN_LENGTH) {
      return `Password length must be at least ${MIN_LENGTH} characters.`
    }

    if (!allowedCharacters) {
      return 'Select at least one character set to generate a password.'
    }

    return ''
  }, [allowedCharacters, length])

  const generatePassword = useCallback(() => {
    if (validationError) {
      setError(validationError)
      setPassword('')
      return
    }

    const charset = allowedCharacters
    const charsetLength = charset.length
    const randomValues = new Uint32Array(length)
    crypto.getRandomValues(randomValues)

    const result = Array.from(randomValues, (value) => charset[value % charsetLength]).join('')
    setPassword(result)
    setError('')
  }, [allowedCharacters, length, validationError])

  const handleCopy = useCallback(async () => {
    if (!password) {
      setError('Generate a password before copying.')
      return
    }

    try {
      await navigator.clipboard.writeText(password)
      toast({
        title: 'Copied to clipboard',
        description: 'Your generated password is ready to paste.',
        status: 'success',
        duration: 2500,
        isClosable: true,
      })
    } catch (copyError) {
      const message = copyError instanceof Error ? copyError.message : 'Unable to copy password.'
      setError(message)
    }
  }, [password, toast])

  const inlineError = error || validationError

  return (
    <Stack spacing={6}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel fontWeight="semibold">Length</FormLabel>
          <Stack spacing={3}>
            <Slider
              aria-label="password-length"
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              step={1}
              value={length}
              onChange={setLength}
            >
              <SliderTrack>
                <SliderFilledTrack />
              </SliderTrack>
              <SliderThumb />
            </Slider>
            <Input
              type="number"
              value={length}
              min={MIN_LENGTH}
              max={MAX_LENGTH}
              onChange={(event) => {
                const nextValue = Number(event.target.value)
                if (Number.isNaN(nextValue)) return
                setLength(Math.min(Math.max(nextValue, MIN_LENGTH), MAX_LENGTH))
              }}
            />
            <FormHelperText color="gray.600">Choose between {MIN_LENGTH} and {MAX_LENGTH} characters.</FormHelperText>
          </Stack>
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="semibold">Character sets</FormLabel>
          <Stack spacing={3}>
            <HStack justify="space-between">
              <Text>Uppercase (A-Z)</Text>
              <Switch colorScheme="blue" isChecked={includeUppercase} onChange={(event) => setIncludeUppercase(event.target.checked)} />
            </HStack>
            <HStack justify="space-between">
              <Text>Lowercase (a-z)</Text>
              <Switch colorScheme="blue" isChecked={includeLowercase} onChange={(event) => setIncludeLowercase(event.target.checked)} />
            </HStack>
            <HStack justify="space-between">
              <Text>Numbers (0-9)</Text>
              <Switch colorScheme="blue" isChecked={includeNumbers} onChange={(event) => setIncludeNumbers(event.target.checked)} />
            </HStack>
            <HStack justify="space-between">
              <Text>Symbols (!@#$…)</Text>
              <Switch colorScheme="blue" isChecked={includeSymbols} onChange={(event) => setIncludeSymbols(event.target.checked)} />
            </HStack>
            <FormHelperText color="gray.600">Enable at least one character set for a valid password.</FormHelperText>
          </Stack>
        </FormControl>
      </SimpleGrid>

      {inlineError && (
        <Text color="red.500" fontSize="sm" role="alert">
          {inlineError}
        </Text>
      )}

      <Stack spacing={3}>
        <InputGroup size="lg">
          <Input value={password} placeholder="Your generated password will appear here" isReadOnly bg="gray.50" />
          <InputRightElement width="3rem">
            <IconButton
              aria-label="Copy password"
              icon={<FiClipboard />}
              size="sm"
              colorScheme="blue"
              variant="ghost"
              onClick={handleCopy}
            />
          </InputRightElement>
        </InputGroup>
        <HStack spacing={3}>
          <Button colorScheme="blue" onClick={generatePassword} isDisabled={Boolean(validationError)}>
            Generate password
          </Button>
          <Button variant="ghost" onClick={() => setPassword('')}>
            Clear
          </Button>
        </HStack>
        <Text fontSize="sm" color="gray.600">
          Uses the browser&apos;s secure <code>crypto.getRandomValues</code> to build strong, unique passwords.
        </Text>
      </Stack>

      <Box borderWidth={1} borderColor="gray.100" borderRadius="md" p={4} bg="gray.50">
        <Stack spacing={2}>
          <Text fontWeight="semibold">Tips for stronger passwords</Text>
          <Text color="gray.700">Combine multiple character sets and aim for at least 16 characters whenever possible.</Text>
        </Stack>
      </Box>
    </Stack>
  )
}

const PasswordTool = () => {
  return (
    <ToolShell
      title={passwordToolDefinition.name}
      description={passwordToolDefinition.description}
      tags={passwordToolDefinition.tags}
      hero={passwordToolDefinition.icon}
    >
      <PasswordToolContent />
    </ToolShell>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const passwordToolDefinition: ToolDefinition = {
  slug: 'password',
  name: 'Password Generator',
  description: 'Generate secure passwords with customizable length and character sets.',
  tags: ['security', 'randomness', 'utilities'],
  icon: '🔐',
  component: PasswordTool,
}

export default PasswordTool
