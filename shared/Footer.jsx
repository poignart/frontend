import {
  Flex,
  Link as ChakraLink,
  Text,
  SimpleGrid,
  VStack,
  HStack,
  Image
} from '@chakra-ui/react';
import styled from '@emotion/styled';
import Link from 'next/link';

import { theme } from '../themes/theme';

const StyledFooterHeaderText = styled(Text)`
  font-family: ${theme.fonts.spaceGrotesk};
  font-weight: bold;
  color: ${theme.colors.brand.unchainBgGreen};
  font-size: 1.2rem;
`;

const StyledLink = styled(ChakraLink)`
  font-family: ${theme.fonts.spaceGrotesk};
  color: ${theme.colors.brand.white};
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
      bg={theme.colors.brand.unchainBgBlack}
    >
      <Link href='/' passHref>
        <Text
          fontFamily={theme.fonts.spaceGrotesk}
          fontWeight='bold'
          fontSize='25px'
          color={theme.colors.brand.white}
          cursor='pointer'
          mt={{ base: '2rem', lg: '0' }}
        >
          PoignART
        </Text>
      </Link>

      <SimpleGrid
        columns={{ base: 1, md: 3, lg: 3 }}
        spacing={{ base: '2rem', lg: '5rem' }}
        fontSize='1rem'
        color='azure'
      >
        <VStack alignItems='flex-start'>
          <StyledFooterHeaderText>For Artists</StyledFooterHeaderText>
          <Link href='/submit' passHref>
            <Text
              fontFamily={theme.fonts.spaceGrotesk}
              color={theme.colors.brand.white}
              cursor='pointer'
              _hover={{ textDecoration: 'underline' }}
            >
              Submit art
            </Text>
          </Link>
          <StyledLink
            href='https://docs.google.com/forms/d/e/1FAIpQLSff5aorK4Yjrfa4ws50byFxHxzQKt1Czv1F5iYE3IPxY7iaQQ/viewform'
            isExternal
          >
            Get whitelisted
          </StyledLink>
        </VStack>
        <VStack alignItems='flex-start'>
          <StyledFooterHeaderText>For Supporters</StyledFooterHeaderText>
          <StyledLink
            href='https://medium.com/@poignart/poignart-mission-statement-4e17b6300543'
            isExternal
          >
            Read manifesto
          </StyledLink>
          <Link href='/explore' passHref>
            <Text
              fontFamily={theme.fonts.spaceGrotesk}
              color={theme.colors.brand.white}
              cursor='pointer'
              _hover={{ textDecoration: 'underline' }}
            >
              Explore artworks
            </Text>
          </Link>
          <Link href='/#section-four' passHref>
            <Text
              fontFamily={theme.fonts.spaceGrotesk}
              color={theme.colors.brand.white}
              cursor='pointer'
              _hover={{ textDecoration: 'underline' }}
            >
              FAQs
            </Text>
          </Link>
        </VStack>
        <VStack alignItems='flex-start'>
          <StyledFooterHeaderText>For All</StyledFooterHeaderText>
          <StyledLink>
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className='fab fa-twitter'></i>
              </span>
              <ChakraLink href='https://twitter.com/PoignARTnft' isExternal>
                Twitter
              </ChakraLink>
            </HStack>
          </StyledLink>

          <StyledLink>
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className='fab fa-discord'></i>
              </span>
              <ChakraLink href='https://discord.gg/qjPvUCakn3' isExternal>
                Discord
              </ChakraLink>
            </HStack>
          </StyledLink>

          <StyledLink>
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className='fas fa-newspaper'></i>
              </span>
              <ChakraLink href='https://medium.com/@poignart' isExternal>
                Medium
              </ChakraLink>
            </HStack>
          </StyledLink>

          <StyledLink>
            <HStack>
              <span style={{ width: '15px', marginRight: '5px' }}>
                <i className='fa-brands fa-instagram-square'></i>
              </span>
              <ChakraLink
                href='https://www.instagram.com/poignartnft/'
                isExternal
              >
                Instagram
              </ChakraLink>
            </HStack>
          </StyledLink>
        </VStack>
      </SimpleGrid>
    </Flex>
  );
};
