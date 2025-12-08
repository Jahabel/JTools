import type { PropsWithChildren, ReactNode } from 'react'
import { Container, Flex, VisuallyHidden, useToast } from '@chakra-ui/react'
import { useEffect, useRef } from 'react'
import Footer from './Footer'
import NavBar, { type NavLinkConfig } from './NavBar'

type LayoutProps = PropsWithChildren<{
  navLinks?: NavLinkConfig[]
  footerBranding?: ReactNode
}>

const Layout = ({ children, navLinks, footerBranding }: LayoutProps) => {
  const toast = useToast()
  const konamiIndexRef = useRef(0)
  const konamiCode = useRef([
    'ArrowUp',
    'ArrowUp',
    'ArrowDown',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'ArrowLeft',
    'ArrowRight',
    'b',
    'a',
  ])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const normalizedKey = event.key.length === 1 ? event.key.toLowerCase() : event.key
      const expectedKey = konamiCode.current[konamiIndexRef.current]

      if (normalizedKey === expectedKey) {
        konamiIndexRef.current += 1

        if (konamiIndexRef.current === konamiCode.current.length) {
          konamiIndexRef.current = 0
          toast({
            title: "Veli 'Jahabel' Yılmaz",
            description: 'Signature unlocked.',
            status: 'info',
            duration: 4000,
            isClosable: true,
          })
        }
      } else {
        konamiIndexRef.current = normalizedKey === konamiCode.current[0] ? 1 : 0
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [toast])

  return (
    <Flex direction="column" minH="100vh" bg="gray.50">
      <NavBar links={navLinks} />
      <Container as="main" maxW="7xl" flex={1} py={{ base: 10, md: 14 }}>
        {children}
      </Container>
      <Footer branding={footerBranding} />
      <VisuallyHidden aria-hidden>Veli 'Jahabel' Yılmaz quietly supports this space.</VisuallyHidden>
    </Flex>
  )
}

export default Layout
