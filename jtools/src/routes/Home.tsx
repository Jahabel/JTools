import { useMemo } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Stack,
  Tag,
  TagLabel,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { FiArrowRight, FiCompass, FiCpu, FiFeather, FiHeart, FiTool } from 'react-icons/fi'
import { toolRegistry } from './ToolRegistry'

const Home = () => {
  const accentBg = useColorModeValue('white', 'gray.900')
  const accentBorder = useColorModeValue('gray.200', 'gray.700')
  const gradient = useColorModeValue('linear(to-r, brand.500, brand.600)', 'linear(to-r, brand.300, brand.500)')

  const featured = useMemo(() => toolRegistry.slice(0, 4), [])
  const categories = useMemo(() => Array.from(new Set(toolRegistry.flatMap((tool) => tool.tags))).slice(0, 6), [])
  const totalTools = toolRegistry.length

  return (
    <Stack spacing={{ base: 10, md: 16 }}>
      <Box
        borderRadius="3xl"
        bgGradient={gradient}
        color="white"
        px={{ base: 6, md: 12 }}
        py={{ base: 10, md: 14 }}
        shadow="lg"
        position="relative"
        overflow="hidden"
      >
        <Box
          position="absolute"
          inset={0}
          bgGradient="radial(at 20% 20%, rgba(255,255,255,0.2), transparent 40%)"
          pointerEvents="none"
        />
        <Stack spacing={6} position="relative">
          <Badge bg="white" color="brand.700" width="fit-content" px={3} py={1} borderRadius="full" fontWeight="semibold">
            JTools Studio
          </Badge>
          <Heading size="2xl" maxW="3xl" lineHeight={1.1}>
            Purpose-built developer utilities with thoughtful UX
          </Heading>
          <Text fontSize={{ base: 'md', md: 'lg' }} maxW="2xl" color="whiteAlpha.900">
            Curated by Veli “Jahabel” Yılmaz for makers who want polished, ready-to-run tools without the clutter. Jump in,
            ship faster, and keep the focus on your craft.
          </Text>
          <HStack spacing={4} wrap="wrap">
            <Button as={RouterLink} to="/tools" size="lg" colorScheme="whiteAlpha" rightIcon={<FiArrowRight />}>
              Explore the toolbox
            </Button>
            <Button as={RouterLink} to={`/tools/${featured[0]?.slug ?? ''}`} size="lg" variant="outline" colorScheme="whiteAlpha">
              Open a featured tool
            </Button>
          </HStack>
          <HStack spacing={8} pt={4} wrap="wrap">
            <Stack spacing={0}>
              <Text fontSize="sm" color="whiteAlpha.800">
                Available tools
              </Text>
              <Heading size="lg">{totalTools}</Heading>
            </Stack>
            <Stack spacing={0}>
              <Text fontSize="sm" color="whiteAlpha.800">
                Curated categories
              </Text>
              <Heading size="lg">{categories.length}</Heading>
            </Stack>
            <Stack spacing={0}>
              <Text fontSize="sm" color="whiteAlpha.800">
                Crafted for builders
              </Text>
              <Heading size="lg">Frictionless</Heading>
            </Stack>
          </HStack>
        </Stack>
      </Box>

      <Grid templateColumns={{ base: '1fr', md: 'repeat(12, 1fr)' }} gap={8}>
        <GridItem colSpan={{ base: 12, md: 5 }}>
          <Stack spacing={4}>
            <Badge colorScheme="purple" width="fit-content">Experience</Badge>
            <Heading size="lg">A calmer way to find the right tool</Heading>
            <Text color="gray.600">
              Browse a human-friendly catalog, skim the essentials, and jump straight into the interface you need. Each page is
              tuned for readability and speed so you can stay focused on what matters.
            </Text>
            <Stack spacing={3}>
              {[{ label: 'Discover', icon: FiCompass, detail: 'Browse organized collections and scan clean summaries.' }, { label: 'Launch', icon: FiTool, detail: 'Open a tool instantly with smooth navigation and zero clutter.' }, { label: 'Share', icon: FiFeather, detail: 'Copy deep links to share favorite utilities with your team.' }].map((item) => (
                <HStack key={item.label} align="flex-start" spacing={4}>
                  <Box bg="brand.50" color="brand.700" borderRadius="full" p={3} borderWidth={1} borderColor="brand.100">
                    <Icon as={item.icon} boxSize={5} />
                  </Box>
                  <Stack spacing={1}>
                    <Text fontWeight="semibold">{item.label}</Text>
                    <Text color="gray.600">{item.detail}</Text>
                  </Stack>
                </HStack>
              ))}
            </Stack>
            <HStack spacing={3} pt={2}>
              <Icon as={FiHeart} color="pink.400" />
              <Text color="gray.600">Designed with care for the developer community.</Text>
            </HStack>
          </Stack>
        </GridItem>

        <GridItem colSpan={{ base: 12, md: 7 }}>
          <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
            {featured.map((tool) => (
              <Box
                key={tool.slug}
                borderWidth={1}
                borderColor={accentBorder}
                borderRadius="xl"
                p={5}
                bg={accentBg}
                shadow="sm"
                _hover={{ shadow: 'md', transform: 'translateY(-2px)', borderColor: 'brand.100' }}
                transition="all 0.15s ease"
              >
                <HStack spacing={3} align="flex-start">
                  {tool.icon && (
                    <Box boxSize={10} borderRadius="md" bg="brand.50" color="brand.700" display="grid" placeItems="center" fontSize="xl">
                      {tool.icon}
                    </Box>
                  )}
                  <Stack spacing={2} flex={1}>
                    <Stack spacing={1}>
                      <HStack spacing={2}>
                        <Heading size="md">{tool.name}</Heading>
                        <Badge colorScheme="green" variant="subtle">
                          Featured
                        </Badge>
                      </HStack>
                      <Text color="gray.600" noOfLines={2}>
                        {tool.description}
                      </Text>
                    </Stack>
                    <HStack spacing={2} wrap="wrap">
                      {tool.tags.slice(0, 3).map((tag) => (
                        <Tag key={tag} size="sm" colorScheme="blue" borderRadius="full" variant="subtle">
                          <TagLabel>{tag}</TagLabel>
                        </Tag>
                      ))}
                    </HStack>
                    <Button
                      as={RouterLink}
                      to={`/tools/${tool.slug}`}
                      size="sm"
                      rightIcon={<FiArrowRight />}
                      colorScheme="brand"
                      alignSelf="flex-start"
                    >
                      Launch tool
                    </Button>
                  </Stack>
                </HStack>
              </Box>
            ))}
          </SimpleGrid>
        </GridItem>
      </Grid>

      <Box borderRadius="2xl" borderWidth={1} borderColor={accentBorder} bg={accentBg} p={{ base: 6, md: 8 }} shadow="md">
        <Stack spacing={4}>
          <HStack justify="space-between" align={{ base: 'flex-start', md: 'center' }} spacing={4} wrap="wrap">
            <Stack spacing={1}>
              <Heading size="md">Collections worth exploring</Heading>
              <Text color="gray.600">Quick links into popular categories curated for the community.</Text>
            </Stack>
            <Button as={RouterLink} to="/tools" colorScheme="brand" rightIcon={<FiArrowRight />} variant="outline">
              Browse all tools
            </Button>
          </HStack>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 6 }} spacing={3}>
            {categories.map((tag) => (
              <Link
                as={RouterLink}
                to={`/tools?tag=${encodeURIComponent(tag)}`}
                key={tag}
                _hover={{ textDecoration: 'none' }}
              >
                <Box
                  borderWidth={1}
                  borderColor={accentBorder}
                  borderRadius="lg"
                  p={3}
                  bg="gray.50"
                  _hover={{ borderColor: 'brand.200', bg: 'white', shadow: 'sm' }}
                  transition="all 0.15s ease"
                  textAlign="center"
                >
                  <Text fontWeight="semibold" textTransform="capitalize">
                    {tag}
                  </Text>
                </Box>
              </Link>
            ))}
          </SimpleGrid>
        </Stack>
      </Box>

      <Box borderRadius="2xl" bg="gray.900" color="white" p={{ base: 6, md: 8 }} shadow="lg">
        <Stack spacing={3}>
          <Badge bg="whiteAlpha.300" color="white" width="fit-content" px={3} py={1} borderRadius="full">
            Crafted for developers
          </Badge>
          <Heading size="lg">Every interaction feels intentional</Heading>
          <Text color="whiteAlpha.800" maxW="3xl">
            JTools is a calm, reliable space for builders. Clear copy, practical navigation, and thoughtful theming keep you in
            flow while you evaluate and use tools.
          </Text>
          <Flex gap={4} wrap="wrap">
            {[{ icon: FiCpu, label: 'Fast by default' }, { icon: FiCompass, label: 'Guided navigation' }, { icon: FiHeart, label: 'Community-first' }].map((item) => (
              <HStack
                key={item.label}
                borderWidth={1}
                borderColor="whiteAlpha.300"
                borderRadius="lg"
                p={3}
                bg="whiteAlpha.100"
                minW={{ base: 'full', sm: '200px' }}
                spacing={3}
              >
                <Box
                  borderRadius="md"
                  bg="whiteAlpha.200"
                  color="white"
                  display="grid"
                  placeItems="center"
                  boxSize={10}
                >
                  <Icon as={item.icon} />
                </Box>
                <Text fontWeight="semibold">{item.label}</Text>
              </HStack>
            ))}
          </Flex>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Home
