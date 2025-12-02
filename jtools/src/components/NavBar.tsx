import type { ReactNode } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { Box, Container, Flex, Heading, HStack, Link, useColorModeValue } from '@chakra-ui/react'
import { toolRegistry } from '../routes/ToolRegistry'

export type NavLinkConfig = {
  label: string
  to: string
  rightSlot?: ReactNode
}

type NavBarProps = {
  links?: NavLinkConfig[]
}

const defaultLinks: NavLinkConfig[] = [
  { label: 'Home', to: '/' },
  { label: 'Tools', to: '/#tools' },
]

const NavBar = ({ links = defaultLinks }: NavBarProps) => {
  const bg = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const primaryTool = toolRegistry[0]

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
            {links.map((link) => (
              <Link key={link.to} as={RouterLink} to={link.to}>
                {link.label}
                {link.rightSlot}
              </Link>
            ))}
            {primaryTool && (
              <Link as={RouterLink} to={`/tools/${primaryTool.slug}`} color="blue.500">
                Open {primaryTool.name}
              </Link>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default NavBar
