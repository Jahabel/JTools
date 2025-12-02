import type { PropsWithChildren } from 'react'
import { Container, Flex } from '@chakra-ui/react'
import Footer from './Footer'
import NavBar from './NavBar'

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      <NavBar />
      <Container as="main" maxW="6xl" flex={1} py={{ base: 8, md: 12 }}>
        {children}
      </Container>
      <Footer />
    </Flex>
  )
}

export default Layout
