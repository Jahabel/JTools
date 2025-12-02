import { Box, Container, Flex, Link, Text, useColorModeValue } from '@chakra-ui/react'

const Footer = () => {
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box as="footer" borderTopWidth={1} borderColor={borderColor} py={6} mt={12}>
      <Container maxW="6xl">
        <Flex align="center" justify="space-between" direction={{ base: 'column', sm: 'row' }} gap={3}>
          <Text fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} JTools. All rights reserved.
          </Text>
          <Flex gap={4} fontSize="sm" color="gray.500">
            <Link href="https://vite.dev" isExternal>
              Built with Vite
            </Link>
            <Link href="https://chakra-ui.com" isExternal>
              Chakra UI
            </Link>
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
