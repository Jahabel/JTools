import { useEffect, useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  Text,
  Tooltip,
  Wrap,
  WrapItem,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react'
import { FiArrowUpRight, FiCopy, FiSearch, FiShuffle } from 'react-icons/fi'
import { getToolBySlug, toolRegistry } from './ToolRegistry'

const Landing = () => {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [spotlightIndex, setSpotlightIndex] = useState(0)
  const highlight = useColorModeValue('blue.50', 'gray.800')
  const spotlightBg = useColorModeValue('white', 'gray.900')
  const toast = useToast()

  const spotlightTools = useMemo(() => toolRegistry.slice(0, 3), [])

  const tags = useMemo(() => {
    const allTags = toolRegistry.flatMap((tool) => tool.tags)
    return Array.from(new Set(allTags)).sort()
  }, [])

  const collections = useMemo(() => {
    const counts = new Map<string, { count: number; example: (typeof toolRegistry)[number] }>()

    toolRegistry.forEach((tool) => {
      tool.tags.forEach((tag) => {
        const entry = counts.get(tag) ?? { count: 0, example: tool }
        counts.set(tag, { ...entry, count: entry.count + 1 })
      })
    })

    return Array.from(counts.entries())
      .sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))
      .slice(0, 6)
      .map(([tag, info]) => ({ tag, count: info.count, example: info.example }))
  }, [])

  const filteredTools = useMemo(() => {
    return toolRegistry.filter((tool) => {
      const matchesQuery =
        !query.trim() ||
        tool.name.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase()) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))

      const matchesTag = !activeTag || tool.tags.includes(activeTag)

      return matchesQuery && matchesTag
    })
  }, [activeTag, query])

  const featuredTool = useMemo(() => getToolBySlug('json-formatter') ?? toolRegistry[0], [])

  useEffect(() => {
    if (spotlightTools.length === 0) return

    const interval = setInterval(() => {
      setSpotlightIndex((current) => (current + 1) % spotlightTools.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [spotlightTools.length])

  const handleCopyLink = (slug: string, name: string) => {
    const url = new URL(`/tools/${slug}`, window.location.origin).toString()
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({ title: 'Link copied', description: `${name} link is ready to share.`, status: 'success', duration: 2500 })
      })
      .catch(() => {
        toast({ title: 'Unable to copy link', description: 'Copy the URL manually instead.', status: 'error' })
      })
  }

  return (
    <Stack spacing={12}>
      <Stack spacing={6} align={{ base: 'start', md: 'center' }} textAlign={{ base: 'left', md: 'center' }}>
        <Badge colorScheme="blue" fontSize="sm" px={3} py={1} borderRadius="full">
          JTools Playground
        </Badge>
        <Heading size={{ base: 'xl', md: '2xl' }}>A registry of ready-to-use developer utilities</Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} maxW="3xl" color="gray.600">
          Search by name or category, pick a tool, and jump straight into the interface. New utilities are added as the
          toolkit grows.
        </Text>
        <HStack spacing={4}>
          {featuredTool && (
            <Button as={RouterLink} to={`/tools/${featuredTool.slug}`} colorScheme="blue" size="lg">
              Open {featuredTool.name}
            </Button>
          )}
          <Button as={RouterLink} to="#tools" variant="outline" size="lg">
            Browse all tools
          </Button>
        </HStack>
      </Stack>

      {spotlightTools.length > 0 && (
        <Card borderWidth={1} borderColor="blue.100" shadow="sm" bg={spotlightBg}>
          <CardBody>
            <Stack direction={{ base: 'column', md: 'row' }} spacing={6} align="center" justify="space-between">
              <Stack spacing={1} align={{ base: 'start', md: 'flex-start' }}>
                <Badge colorScheme="purple" width="fit-content" display="inline-flex" alignItems="center" gap={2}>
                  <Icon as={FiShuffle} />
                  Spotlight
                </Badge>
                <Heading size="md">{spotlightTools[spotlightIndex]?.name}</Heading>
                <Text color="gray.600" maxW="3xl">{spotlightTools[spotlightIndex]?.description}</Text>
                <Wrap spacing={2}>
                  {spotlightTools[spotlightIndex]?.tags.map((tag) => (
                    <WrapItem key={tag}>
                      <Tag size="sm" variant="solid" colorScheme="purple">
                        <TagLabel>{tag}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </Stack>
              <Button
                as={RouterLink}
                to={`/tools/${spotlightTools[spotlightIndex]?.slug ?? ''}`}
                colorScheme="purple"
                size="lg"
              >
                Open spotlight tool
              </Button>
            </Stack>
          </CardBody>
        </Card>
      )}

      <Stack spacing={4} id="tools">
        <Heading size="md">Browse tools</Heading>
        <Stack spacing={3}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FiSearch} color="gray.500" />
            </InputLeftElement>
            <Input
              placeholder="Search by name, description, or tag"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              bg="white"
            />
          </InputGroup>

          <Wrap spacing={3}>
            <WrapItem>
              <Button
                size="sm"
                variant={activeTag === null ? 'solid' : 'outline'}
                colorScheme="blue"
                onClick={() => setActiveTag(null)}
              >
                All categories
              </Button>
            </WrapItem>
            {tags.map((tag) => (
              <WrapItem key={tag}>
                <Button
                  size="sm"
                  variant={activeTag === tag ? 'solid' : 'outline'}
                  colorScheme="blue"
                  onClick={() => setActiveTag(tag)}
                >
                  {tag}
                </Button>
              </WrapItem>
            ))}
          </Wrap>
        </Stack>

        {collections.length > 0 && (
          <Stack spacing={3}>
            <Heading size="sm">Collections</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
              {collections.map((collection) => (
                <Card key={collection.tag} borderWidth={1} borderColor="gray.100" bg="white" shadow="xs">
                  <CardBody>
                    <Stack spacing={2}>
                      <HStack justify="space-between" align="start">
                        <Stack spacing={0}>
                          <Text fontWeight="semibold" textTransform="capitalize">
                            {collection.tag}
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {collection.count} tool{collection.count === 1 ? '' : 's'} in this collection
                          </Text>
                        </Stack>
                        <Button
                          size="sm"
                          variant={activeTag === collection.tag ? 'solid' : 'outline'}
                          colorScheme="blue"
                          onClick={() => setActiveTag((current) => (current === collection.tag ? null : collection.tag))}
                        >
                          {activeTag === collection.tag ? 'Viewing' : 'View'}
                        </Button>
                      </HStack>
                      <Divider />
                      <Stack spacing={1}>
                        <Text fontSize="xs" color="gray.500">
                          Example
                        </Text>
                        <HStack spacing={3} align="center">
                          {collection.example.icon && (
                            <Box boxSize={9} borderRadius="full" bg={highlight} display="grid" placeItems="center" fontSize="lg">
                              {collection.example.icon}
                            </Box>
                          )}
                          <Stack spacing={0}>
                            <Text fontSize="sm" fontWeight="semibold">
                              {collection.example.name}
                            </Text>
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              {collection.example.description}
                            </Text>
                          </Stack>
                        </HStack>
                      </Stack>
                    </Stack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        )}

        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} pt={2}>
          {filteredTools.map((tool) => (
            <Card key={tool.slug} borderWidth={1} borderColor="gray.100" shadow="sm" bg="white" _hover={{ shadow: 'md', borderColor: 'blue.100', transform: 'translateY(-2px)' }} transition="all 0.15s ease">
              <CardHeader pb={0}>
                <HStack spacing={3} align="start">
                  {tool.icon && (
                    <Box boxSize={10} borderRadius="full" bg={highlight} display="grid" placeItems="center" fontSize="xl">
                      {tool.icon}
                    </Box>
                  )}
                  <Stack spacing={1}>
                    <Heading size="md">{tool.name}</Heading>
                    <Text color="gray.600" noOfLines={2}>
                      {tool.description}
                    </Text>
                  </Stack>
                </HStack>
              </CardHeader>
              <CardBody>
                <Wrap spacing={2}>
                  {tool.tags.map((tag) => (
                    <WrapItem key={tag}>
                      <Tag size="sm" variant="subtle" colorScheme="blue">
                        <TagLabel>{tag}</TagLabel>
                      </Tag>
                    </WrapItem>
                  ))}
                </Wrap>
              </CardBody>
              <CardFooter pt={0} justify="space-between" alignItems="center">
                <Text fontSize="sm" color="gray.600">
                  Quick actions
                </Text>
                <ButtonGroup size="sm" variant="ghost" spacing={1}>
                  <Tooltip label="Copy direct link" placement="top">
                    <IconButton aria-label="Copy link" icon={<FiCopy />} onClick={() => handleCopyLink(tool.slug, tool.name)} />
                  </Tooltip>
                  <Button as={RouterLink} to={`/tools/${tool.slug}`} rightIcon={<FiArrowUpRight />}>Open</Button>
                </ButtonGroup>
              </CardFooter>
            </Card>
          ))}
        </SimpleGrid>

        {filteredTools.length === 0 && (
          <Box borderWidth={1} borderColor="gray.100" borderRadius="md" p={6} textAlign="center" bg="white">
            <Heading size="sm" mb={2}>
              No tools found
            </Heading>
            <Text color="gray.600">Try a different search term or choose another category.</Text>
          </Box>
        )}
      </Stack>
    </Stack>
  )
}

export default Landing
