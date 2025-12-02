import { Link as RouterLink } from 'react-router-dom'
import { Box, Button, Heading, Stack, Text, Link, SimpleGrid, Card, CardBody } from '@chakra-ui/react'

const LandingPage = () => {
  return (
    <Stack spacing={12}>
      <Stack spacing={4} align={{ base: 'start', md: 'center' }} textAlign={{ base: 'left', md: 'center' }}>
        <Heading size={{ base: 'xl', md: '2xl' }}>Welcome to JTools</Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} maxW="2xl" color="gray.600">
          Explore a curated collection of handy utilities for developers. Browse tools, jump into the details,
          and get productive faster.
        </Text>
        <Button as={RouterLink} to="/tools/sample-tool" colorScheme="blue" size="lg">
          View a sample tool
        </Button>
      </Stack>

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        {['Generators', 'Formatters', 'Integrations'].map((category) => (
          <Card key={category} shadow="sm" borderWidth={1} borderColor="gray.100">
            <CardBody>
              <Heading size="md" mb={2}>
                {category}
              </Heading>
              <Text color="gray.600">
                Discover helpful {category.toLowerCase()} that streamline your workflows and keep your projects
                moving.
              </Text>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>

      <Box textAlign="center">
        <Text fontSize="sm" color="gray.500">
          Want to dive deeper? Check out a specific tool page for more details.
        </Text>
        <Link as={RouterLink} to="/tools/sample-tool" color="blue.500" fontWeight="medium">
          Go to sample tool
        </Link>
      </Box>
    </Stack>
  )
}

export default LandingPage
