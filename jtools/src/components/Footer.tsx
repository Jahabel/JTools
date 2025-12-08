import type { ReactNode } from 'react'
import { Box, Container, Flex, Link, Stack, Text, useColorModeValue } from '@chakra-ui/react'

type FooterProps = {
  branding?: ReactNode
}

const Footer = ({ branding }: FooterProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box as="footer" borderTopWidth={1} borderColor={borderColor} py={8} mt={16} bg="white">
      <Container maxW="7xl">
        <Flex
          align="center"
          justify="space-between"
          direction={{ base: 'column', md: 'row' }}
          gap={4}
          wrap="wrap"
        >
          <Stack spacing={1}>
            <Text fontSize="sm" color="gray.600">
              © 2025 JTools. Made with care for the developer community by Veli "Jahabel" Yılmaz.
            </Text>
            <Flex gap={4} fontSize="sm" color="gray.600" wrap="wrap">
              <Link href="https://mordok.com" isExternal>
                Mordok Media
              </Link>
              <Link href="https://letmeprovide.com" isExternal>
                LetMeProvide Hosting
              </Link>
              <Link href="https://veliyilmaz.net" isExternal>
                Veli Yılmaz
              </Link>
            </Flex>
          </Stack>
          <Flex gap={4} fontSize="sm" color="gray.500" align="center">
            <Link href="https://vite.dev" isExternal>
              Built with Vite
            </Link>
            <Link href="https://chakra-ui.com" isExternal>
              Chakra UI
            </Link>
            {branding && <Box>{branding}</Box>}
          </Flex>
        </Flex>
      </Container>
    </Box>
  )
}

export default Footer
