import {
  Flex,
  Link,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Image
} from '@chakra-ui/react';
import styled from '@emotion/styled';

import { theme } from '../themes/theme';

const StyledFooterHeaderText = styled(Text)`
  font-family: ${theme.fonts.spaceGrotesk};
  font-weight: bold;
  color: ${theme.colors.brand.black};
`;

const StyledLink = styled(Link)`
  font-family: ${theme.fonts.spaceGrotesk};
  color: ${theme.colors.brand.black};
`;

export const Footer = () => {
  return (
    <Flex
      w='100%'
      direction={{ base: 'column-reverse', md: 'row', lg: 'row' }}
      alignItems='flex-start'
      justifyContent='space-between'
      px={{ base: '2rem', lg: '5rem' }}
      py='4rem'
      mt='auto'
    >
      <Image
        src='/assets/logo.png'
        alt='logo'
        w={{ lg: '250px', md: '200px', base: '100px' }}
      />

      <SimpleGrid
        columns={{ base: 1, md: 3, lg: 3 }}
        spacing={{ base: '2rem', lg: '5rem' }}
        fontSize='1rem'
        color='azure'
      >
        <VStack alignItems='flex-start'>
          <StyledFooterHeaderText fontSize='1.2rem'>
            For Artists
          </StyledFooterHeaderText>
          <StyledLink href=''>Submit art</StyledLink>
          <StyledLink href=''>Read manifesto</StyledLink>
        </VStack>
        <VStack alignItems='flex-start'>
          <StyledFooterHeaderText fontSize='1.2rem'>
            For Supporters
          </StyledFooterHeaderText>
          <StyledLink href=''>Mint NFT</StyledLink>
          <StyledLink href=''>Explore artworks</StyledLink>
        </VStack>
        <VStack alignItems='flex-start'>
          <StyledFooterHeaderText fontSize='1.2rem'>
            For All
          </StyledFooterHeaderText>
          <StyledLink>
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className='fab fa-twitter'></i>
              </span>
              <Link
                href='https://twitter.com/Poignard6'
                target='_blank'
                rel='noopener noreferrer'
              >
                Twitter
              </Link>
            </HStack>
          </StyledLink>

          <StyledLink>
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className='fab fa-discord'></i>
              </span>
              <Link href='' target='_blank' rel='noopener noreferrer'>
                Discord
              </Link>
            </HStack>
          </StyledLink>

          <StyledLink>
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className='fas fa-newspaper'></i>
              </span>
              <Link
                href='https://medium.com/@poignard'
                target='_blank'
                rel='noopener noreferrer'
              >
                Newsletter
              </Link>
            </HStack>
          </StyledLink>
        </VStack>
      </SimpleGrid>
    </Flex>
  );
};
