import { useMemo, useState } from 'react'
import { Link as RouterLink, useLocation } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  HStack,
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
import { FiArrowUpRight, FiCopy, FiFilter, FiRefreshCw, FiSearch } from 'react-icons/fi'
import { toolRegistry } from './ToolRegistry'

const ToolsIndex = () => {
  const accentBg = useColorModeValue('white', 'gray.900')
  const accentBorder = useColorModeValue('gray.200', 'gray.700')
  const muted = useColorModeValue('gray.600', 'gray.300')
  const toast = useToast()
  const location = useLocation()

  const queryParamTag = useMemo(() => new URLSearchParams(location.search).get('tag'), [location.search])
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(queryParamTag)

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

  const copyLink = (slug: string, name: string) => {
    const url = new URL(`/tools/${slug}`, window.location.origin).toString()
    navigator.clipboard
      .writeText(url)
      .then(() => {
        toast({ title: 'Copied', description: `${name} link is ready to share.`, status: 'success', duration: 2500 })
      })
      .catch(() => {
        toast({ title: 'Unable to copy link', description: 'Copy the URL manually instead.', status: 'error' })
      })
  }

  return (
    <Stack spacing={{ base: 8, md: 12 }}>
      <Stack spacing={3}>
        <Badge colorScheme="brand" width="fit-content" display="inline-flex" alignItems="center" gap={2}>
          <FiFilter /> Curated tools
        </Badge>
        <Heading size="2xl">Explore the JTools collection</Heading>
        <Text color={muted} maxW="3xl">
          Dedicated browsing for every utility in the catalog. Filter by keyword or category, then open a tool with a single
          click.
        </Text>
      </Stack>

      <Flex gap={6} direction={{ base: 'column', lg: 'row' }} align="flex-start">
        <Box
          flexBasis={{ base: '100%', lg: '280px' }}
          borderWidth={1}
          borderColor={accentBorder}
          borderRadius="lg"
          bg={accentBg}
          p={4}
          shadow="sm"
          position="sticky"
          top="96px"
        >
          <Stack spacing={4}>
            <Heading size="sm">Filters</Heading>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <FiSearch color="#A0AEC0" />
              </InputLeftElement>
              <Input
                placeholder="Search tools"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                bg="white"
              />
            </InputGroup>

            <Stack spacing={2}>
              <Text fontWeight="medium">Categories</Text>
              <Wrap spacing={2}>
                <WrapItem>
                  <Button
                    size="sm"
                    variant={activeTag === null ? 'solid' : 'outline'}
                    colorScheme="brand"
                    onClick={() => setActiveTag(null)}
                  >
                    All
                  </Button>
                </WrapItem>
                {tags.map((tag) => (
                  <WrapItem key={tag}>
                    <Button
                      size="sm"
                      variant={activeTag === tag ? 'solid' : 'outline'}
                      colorScheme="brand"
                      onClick={() => setActiveTag((current) => (current === tag ? null : tag))}
                    >
                      {tag}
                    </Button>
                  </WrapItem>
                ))}
              </Wrap>
            </Stack>

            <Button
              variant="ghost"
              leftIcon={<FiRefreshCw />}
              onClick={() => {
                setActiveTag(null)
                setQuery('')
              }}
            >
              Reset filters
            </Button>
          </Stack>
        </Box>

        <Stack flex={1} spacing={6} width="100%">
          <Flex align="center" justify="space-between" wrap="wrap" gap={3}>
            <Stack spacing={0}>
              <Text fontWeight="medium">{filteredTools.length} tools</Text>
              <Text color={muted}>Sorted alphabetically for quick scanning.</Text>
            </Stack>
            <HStack spacing={2}>
              {activeTag && (
                <Badge colorScheme="blue" variant="subtle" px={3} py={1} borderRadius="full">
                  Filtered by “{activeTag}”
                </Badge>
              )}
              {query && (
                <Badge colorScheme="purple" variant="subtle" px={3} py={1} borderRadius="full">
                  Search: {query}
                </Badge>
              )}
            </HStack>
          </Flex>

          {filteredTools.length === 0 && (
            <Box borderWidth={1} borderColor={accentBorder} borderRadius="lg" p={8} textAlign="center" bg={accentBg}>
              <Heading size="md" mb={2}>
                No tools found
              </Heading>
              <Text color={muted}>Try a different keyword or clear the active filters.</Text>
            </Box>
          )}

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {filteredTools.map((tool) => (
              <Card
                key={tool.slug}
                borderWidth={1}
                borderColor={accentBorder}
                bg={accentBg}
                shadow="sm"
                _hover={{ shadow: 'md', borderColor: 'brand.100', transform: 'translateY(-2px)' }}
                transition="all 0.15s ease"
              >
                <CardBody>
                  <Stack spacing={3}>
                    <HStack justify="space-between" align="flex-start" spacing={4}>
                      <HStack spacing={3} align="flex-start">
                        {tool.icon && (
                          <Box
                            boxSize={10}
                            borderRadius="md"
                            bg="brand.50"
                            color="brand.700"
                            display="grid"
                            placeItems="center"
                            fontSize="xl"
                          >
                            {tool.icon}
                          </Box>
                        )}
                        <Stack spacing={1}>
                          <Heading size="md">{tool.name}</Heading>
                          <Text color={muted} noOfLines={2}>
                            {tool.description}
                          </Text>
                        </Stack>
                      </HStack>
                      <HStack spacing={1}>
                        <Tooltip label="Copy direct link" placement="top">
                          <IconButton
                            aria-label="Copy link"
                            icon={<FiCopy />}
                            size="sm"
                            variant="ghost"
                            onClick={() => copyLink(tool.slug, tool.name)}
                          />
                        </Tooltip>
                        <Button
                          as={RouterLink}
                          to={`/tools/${tool.slug}`}
                          size="sm"
                          colorScheme="brand"
                          rightIcon={<FiArrowUpRight />}
                        >
                          Open
                        </Button>
                      </HStack>
                    </HStack>

                    <Wrap spacing={2}>
                      {tool.tags.map((tag) => (
                        <WrapItem key={tag}>
                          <Tag size="sm" variant="subtle" colorScheme="blue" borderRadius="full">
                            <TagLabel>{tag}</TagLabel>
                          </Tag>
                        </WrapItem>
                      ))}
                    </Wrap>
                  </Stack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Flex>
    </Stack>
  )
}

export default ToolsIndex
