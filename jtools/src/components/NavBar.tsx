import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Flex, Heading, HStack, Link, useColorModeValue } from '@chakra-ui/react'

const NavBar = () => {
  const bg = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box as="header" borderBottomWidth={1} borderColor={borderColor} bg={bg} position="sticky" top={0} zIndex={10}>
      <Container maxW="6xl" py={4}>
        <Flex align="center" justify="space-between">
          <Heading size="md" color="brand.600">
            <Link as={RouterLink} to="/">
              JTools
            </Link>
          </Heading>
          <HStack spacing={6} fontWeight="medium">
            <Link as={RouterLink} to="/">
              Home
            </Link>
            <Link as={RouterLink} to="/tools/sample-tool">
              Sample Tool
            </Link>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default NavBar
