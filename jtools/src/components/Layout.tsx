import type { PropsWithChildren, ReactNode } from 'react'
import { Container, Flex } from '@chakra-ui/react'
import Footer from './Footer'
import NavBar, { type NavLinkConfig } from './NavBar'

type LayoutProps = PropsWithChildren<{
  navLinks?: NavLinkConfig[]
  footerBranding?: ReactNode
}>

const Layout = ({ children, navLinks, footerBranding }: LayoutProps) => {
  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      <NavBar links={navLinks} />
      <Container as="main" maxW="6xl" flex={1} py={{ base: 8, md: 12 }}>
        {children}
      </Container>
      <Footer branding={footerBranding} />
    </Flex>
  )
}

export default Layout
