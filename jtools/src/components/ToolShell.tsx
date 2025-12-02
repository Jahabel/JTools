import type { ReactNode } from 'react'
import { Box, Heading, HStack, Stack, Tag, TagLabel, Text, Wrap, WrapItem } from '@chakra-ui/react'

export type ToolShellProps = {
  title: string
  description: string
  tags: string[]
  hero?: ReactNode
  actions?: ReactNode
  children: ReactNode
}

const ToolShell = ({ title, description, tags, hero, actions, children }: ToolShellProps) => {
  return (
    <Stack spacing={6}>
      <Stack spacing={3}>
        <HStack align={{ base: 'start', md: 'center' }} justify="space-between" spacing={4}>
          <HStack align="start" spacing={3}>
            {hero && (
              <Box boxSize={12} borderRadius="full" bg="blue.50" display="grid" placeItems="center" fontSize="2xl">
                {hero}
              </Box>
            )}
            <Stack spacing={1}>
              <Heading size="lg">{title}</Heading>
              <Text color="gray.600">{description}</Text>
            </Stack>
          </HStack>
          {actions && <Box>{actions}</Box>}
        </HStack>

        <Wrap spacing={2}>
          {tags.map((tag) => (
            <WrapItem key={tag}>
              <Tag colorScheme="blue" variant="subtle">
                <TagLabel>{tag}</TagLabel>
              </Tag>
            </WrapItem>
          ))}
        </Wrap>
      </Stack>

      <Box borderWidth={1} borderColor="gray.100" borderRadius="lg" bg="white" p={{ base: 4, md: 6 }} shadow="sm">
        {children}
      </Box>
    </Stack>
  )
}

export default ToolShell
