import { useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  Textarea,
  useToast,
} from '@chakra-ui/react'
import ToolShell from '../../components/ToolShell'
import type { ToolDefinition } from '../../routes/ToolRegistry'

const DEFAULT_PARAGRAPHS = 3
const DEFAULT_SENTENCES = 4
const MIN_PARAGRAPHS = 1
const MAX_PARAGRAPHS = 10
const MIN_SENTENCES = 1
const MAX_SENTENCES = 12

const WORDS = [
  'adipiscing',
  'aliqua',
  'aliquet',
  'amet',
  'ante',
  'arcu',
  'aute',
  'commodo',
  'condimentum',
  'consectetur',
  'consequat',
  'culpa',
  'cupidatat',
  'dapibus',
  'deserunt',
  'diam',
  'dictum',
  'dignissim',
  'do',
  'dolor',
  'duis',
  'egestas',
  'eiusmod',
  'elit',
  'enim',
  'erat',
  'eros',
  'est',
  'et',
  'eu',
  'ex',
  'excepteur',
  'exercitation',
  'felis',
  'fermentum',
  'fusce',
  'gravida',
  'iaculis',
  'imperdiet',
  'incididunt',
  'ipsum',
  'justo',
  'laboris',
  'laborum',
  'lacus',
  'lectus',
  'ligula',
  'litora',
  'lobortis',
  'lorem',
  'malesuada',
  'massa',
  'mauris',
  'metus',
  'mollis',
  'nec',
  'nibh',
  'nisi',
  'non',
  'nostrud',
  'nulla',
  'nullam',
  'occaecat',
  'odio',
  'orci',
  'pariatur',
  'penatibus',
  'placerat',
  'porta',
  'posuere',
  'proident',
  'pulvinar',
  'quam',
  'qui',
  'quis',
  'rhoncus',
  'risus',
  'sagittis',
  'sapien',
  'scelerisque',
  'sed',
  'sem',
  'semper',
  'senectus',
  'sint',
  'sit',
  'sociis',
  'sollicitudin',
  'sunt',
  'tellus',
  'tempor',
  'tincidunt',
  'tortor',
  'tristique',
  'ullamco',
  'urna',
  'ut',
  'varius',
  'vehicula',
  'velit',
  'venenatis',
  'vitae',
  'volutpat',
]

const START_PHRASE = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'] as const

const createRandom = (seedInput?: number) => {
  let seed = seedInput ?? Date.now()

  try {
    const buffer = new Uint32Array(1)
    crypto.getRandomValues(buffer)
    seed = buffer[0] || seed
  } catch {
    seed = Date.now()
  }

  return () => {
    seed = (seed * 1664525 + 1013904223) % 2 ** 32
    return seed / 2 ** 32
  }
}

const generateSeed = () => {
  try {
    const buffer = new Uint32Array(1)
    crypto.getRandomValues(buffer)
    return buffer[0] || Date.now()
  } catch {
    return Date.now()
  }
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const buildSentence = (random: () => number, startWithLorem: boolean, isFirst: boolean) => {
  const length = 8 + Math.floor(random() * 8)
  const words: string[] = []

  for (let index = 0; index < length; index += 1) {
    const word = WORDS[Math.floor(random() * WORDS.length)]
    words.push(word)
  }

  if (startWithLorem && isFirst) {
    const remaining = words.slice(START_PHRASE.length)
    const phrase = [...START_PHRASE, ...remaining]
    phrase[0] = phrase[0][0].toUpperCase() + phrase[0].slice(1)
    return `${phrase.join(' ')}.`
  }

  const [first, ...rest] = words
  const capitalized = first.charAt(0).toUpperCase() + first.slice(1)

  return `${[capitalized, ...rest].join(' ')}.`
}

const generateLorem = (paragraphs: number, sentences: number, startWithLorem: boolean, seed: number) => {
  const random = createRandom(seed)

  return Array.from({ length: paragraphs }, (_, paragraphIndex) => {
    const paragraphSentences = Array.from({ length: sentences }, (_, sentenceIndex) =>
      buildSentence(random, startWithLorem, paragraphIndex === 0 && sentenceIndex === 0),
    )

    return paragraphSentences.join(' ')
  })
}

const LoremIpsumToolContent = () => {
  const [paragraphs, setParagraphs] = useState(DEFAULT_PARAGRAPHS)
  const [sentencesPerParagraph, setSentencesPerParagraph] = useState(DEFAULT_SENTENCES)
  const [startWithLorem, setStartWithLorem] = useState(true)
  const [seed, setSeed] = useState(() => generateSeed())
  const output = useMemo(
    () => generateLorem(paragraphs, sentencesPerParagraph, startWithLorem, seed),
    [paragraphs, seed, sentencesPerParagraph, startWithLorem],
  )
  const toast = useToast()

  const generatorDescription = useMemo(
    () => `Generate ${paragraphs} paragraph${paragraphs === 1 ? '' : 's'} with ${sentencesPerParagraph} sentence${sentencesPerParagraph === 1 ? '' : 's'} each.`,
    [paragraphs, sentencesPerParagraph],
  )

  const regenerate = useCallback(() => {
    setSeed(generateSeed())
  }, [])

  const handleCopy = useCallback(async () => {
    const text = output.join('\n\n')

    try {
      await navigator.clipboard.writeText(text)
      toast({ title: 'Copied', description: 'All paragraphs copied to your clipboard.', status: 'success', duration: 2500 })
    } catch {
      toast({ title: 'Unable to copy', description: 'Copy the text manually instead.', status: 'error' })
    }
  }, [output, toast])

  return (
    <Stack spacing={6}>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
        <FormControl>
          <FormLabel fontWeight="semibold">Paragraphs</FormLabel>
          <Input
            type="number"
            value={paragraphs}
            min={MIN_PARAGRAPHS}
            max={MAX_PARAGRAPHS}
            onChange={(event) => {
              const value = Number(event.target.value)
              if (Number.isNaN(value)) return
              setParagraphs(clamp(value, MIN_PARAGRAPHS, MAX_PARAGRAPHS))
            }}
          />
          <FormHelperText color="gray.600">Choose between {MIN_PARAGRAPHS} and {MAX_PARAGRAPHS} paragraphs.</FormHelperText>
        </FormControl>

        <FormControl>
          <FormLabel fontWeight="semibold">Sentences per paragraph</FormLabel>
          <Input
            type="number"
            value={sentencesPerParagraph}
            min={MIN_SENTENCES}
            max={MAX_SENTENCES}
            onChange={(event) => {
              const value = Number(event.target.value)
              if (Number.isNaN(value)) return
              setSentencesPerParagraph(clamp(value, MIN_SENTENCES, MAX_SENTENCES))
            }}
          />
          <FormHelperText color="gray.600">Between {MIN_SENTENCES} and {MAX_SENTENCES} sentences keep paragraphs readable.</FormHelperText>
        </FormControl>
      </SimpleGrid>

      <HStack justify="space-between" align={{ base: 'start', md: 'center' }} spacing={4} flexDir={{ base: 'column', md: 'row' }}>
        <HStack spacing={3} align="center">
          <Switch colorScheme="blue" isChecked={startWithLorem} onChange={(event) => setStartWithLorem(event.target.checked)} />
          <Text>Start with “Lorem ipsum dolor sit amet…”</Text>
        </HStack>

        <HStack spacing={3} align="center">
          <Button colorScheme="blue" onClick={regenerate}>
            Generate text
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              setParagraphs(DEFAULT_PARAGRAPHS)
              setSentencesPerParagraph(DEFAULT_SENTENCES)
              setStartWithLorem(true)
              setSeed(generateSeed())
            }}
          >
            Reset to defaults
          </Button>
        </HStack>
      </HStack>

      <Box borderWidth={1} borderColor="gray.200" borderRadius="md" p={4} bg="gray.50">
        <HStack justify="space-between" mb={3} align={{ base: 'start', md: 'center' }} flexDir={{ base: 'column', md: 'row' }}>
          <Stack spacing={0}>
            <Text fontWeight="semibold">Generated text</Text>
            <Text fontSize="sm" color="gray.600">
              {generatorDescription}
            </Text>
          </Stack>
          <Button size="sm" onClick={handleCopy} isDisabled={output.length === 0}>
            Copy all
          </Button>
        </HStack>

        <Box borderWidth={1} borderColor="gray.200" borderRadius="md" bg="white" p={3} maxH="320px" overflowY="auto">
          <Stack spacing={4}>
            {output.map((paragraph, index) => (
              <Textarea key={index} value={paragraph} readOnly resize="none" bg="gray.50" />
            ))}
          </Stack>
        </Box>
      </Box>
    </Stack>
  )
}

const LoremIpsumTool = () => {
  return (
    <ToolShell
      title={loremIpsumDefinition.name}
      description={loremIpsumDefinition.description}
      tags={loremIpsumDefinition.tags}
      hero={loremIpsumDefinition.icon}
    >
      <LoremIpsumToolContent />
    </ToolShell>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const loremIpsumDefinition: ToolDefinition = {
  slug: 'lorem-ipsum',
  name: 'Lorem Ipsum Generator',
  description: 'Generate placeholder paragraphs with configurable lengths and the classic opening.',
  tags: ['content', 'prototyping', 'utilities'],
  icon: '📜',
  component: LoremIpsumTool,
}

export default LoremIpsumTool
