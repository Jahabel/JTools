import { useMemo, useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Heading,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  Text,
  Wrap,
  WrapItem,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiArrowUpRight, FiSearch } from 'react-icons/fi'
import { getToolBySlug, toolRegistry } from './ToolRegistry'

const Landing = () => {
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const highlight = useColorModeValue('blue.50', 'gray.800')

  const tags = useMemo(() => {
    const allTags = toolRegistry.flatMap((tool) => tool.tags)
    return Array.from(new Set(allTags)).sort()
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
              <CardFooter pt={0} justify="flex-end">
                <Button as={RouterLink} to={`/tools/${tool.slug}`} variant="ghost" rightIcon={<FiArrowUpRight />}>
                  Open
                </Button>
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
