import {
  Flex,
  Heading,
  Button,
  Text,
  Image as ChakraImage,
  SimpleGrid
} from '@chakra-ui/react';

import Link from 'next/link';

import styled from '@emotion/styled';
import { utils } from 'ethers';

import { uriToHttp } from '../../utils/helpers';
import { theme } from '../../themes/theme';

import {
  OPENSEA_BASE_URL,
  POIGNARD_CONTRACT_ADDRESS,
  POIGNART_BUCKET_BASE_URL
} from '../../config';

const StyledButton = styled(Button)`
  height: 50px;
  font-family: ${theme.fonts.spaceGrotesk};
  text-transform: uppercase;
  border: 2px solid ${theme.colors.brand.black};
  border-radius: 3px;
  color: ${theme.colors.brand.black};
  background: white;
  box-decoration-break: clone;
  padding-left: 24px;
  padding-right: 24px;
  margin-top: 1rem;
  &:hover {
    opacity: 0.6;
  }
`;

const StyledHeading = styled(Heading)`
  font-size: 25px;
  font-weight: bold;
  font-family: ${theme.fonts.spaceGrotesk};
  color: ${theme.colors.brand.black};
`;

const StyledDescription = styled(Text)`
  margin-top: 1.5rem;
  color: ${theme.colors.brand.black};
  font-family: ${theme.fonts.spaceGrotesk};
`;

const StyledCreator = styled(Text)`
  color: rgb(32, 129, 226);
  font-family: ${theme.fonts.spaceGrotesk};
  cursor: pointer;
  text-decoration: underline;
  margin-top: 0.5rem;
  &:hover {
    color: ${theme.colors.brand.chineseSilver};
  }
`;

const StyledMisc = styled(Text)`
  color: ${theme.colors.brand.spanishGrey};
  font-family: ${theme.fonts.spaceMono};
  margin-top: 0.5rem;
  font-size: 12px;
`;

export const Voucher = ({
  voucher,
  onlyMintable,
  isRedeemed,
  loading,
  loadingText,
  handleFetch,
  handleRedeem,
  setDialogStatus
}) => {
  return (
    <SimpleGrid
      w='100%'
      columns={{ base: 1, md: 1, lg: 2 }}
      gridGap={10}
      px={{ base: '1rem', lg: '4rem' }}
    >
      <Flex direction='column' position='relative'>
        {(voucher.contentType === 'image' ||
          voucher.contentType === 'audio') && (
          <ChakraImage
            src={uriToHttp(voucher.metadata.image)}
            crossOrigin='anonymous'
            alt='minted nft'
            fallbackSrc={`${POIGNART_BUCKET_BASE_URL}/${voucher.metadata.image.replace(
              'ipfs://',
              ''
            )}`}
            objectFit={voucher.contentType === 'audio' ? 'cover' : 'contain'}
          />
        )}

        {voucher.contentType === 'video' && (
          <video
            width='100%'
            height='auto'
            style={{ marginBottom: '2rem' }}
            controls
          >
            <source
              src={`${POIGNART_BUCKET_BASE_URL}/${voucher.metadata.animation_url.replace(
                'ipfs://',
                ''
              )}`}
              type='video/mp4'
            />
          </video>
        )}

        {voucher.contentType === 'audio' && (
          <audio
            height='auto'
            width='100%'
            style={{
              position: 'absolute',
              top: '50%',
              left: '0',
              right: '0',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
            controls
          >
            <source
              src={`${POIGNART_BUCKET_BASE_URL}/${voucher.metadata.animation_url.replace(
                'ipfs://',
                ''
              )}`}
            />
          </audio>
        )}
        <Flex mt='1rem'>
          <StyledButton
            width='30%'
            mr='1rem'
            disabled={loading}
            onClick={() => setDialogStatus(false)}
          >
            Back
          </StyledButton>
          {(!onlyMintable || isRedeemed) && (
            <StyledButton
              w='100%'
              onClick={() =>
                window.open(
                  `${OPENSEA_BASE_URL}/assets/${POIGNARD_CONTRACT_ADDRESS}/${voucher.tokenID}`,
                  '_blank'
                )
              }
            >
              View on opensea
            </StyledButton>
          )}
          {onlyMintable && !isRedeemed && (
            <StyledButton
              w='100%'
              isLoading={loading}
              loadingText={loadingText}
              onClick={() => {
                if (isRedeemed) {
                  handleFetch();
                  setDialogStatus(false);
                } else {
                  handleRedeem(voucher);
                }
              }}
            >
              {`Mint for ${utils.formatEther(voucher.minPrice)} ETH`}
            </StyledButton>
          )}
        </Flex>
      </Flex>
      <Flex direction='column'>
        <StyledHeading>{voucher.metadata.name.substring(0, 25)}</StyledHeading>
        <Flex direction='column'>
          <StyledDescription>
            {voucher.metadata.description.substring(0, 250)}
            {voucher.metadata.description.length > 250 && ' ..'}
          </StyledDescription>

          <Link href={`/artist/${voucher.createdBy.ethAddress}`} passHref>
            <StyledCreator>{`Created by ${voucher.createdBy.name}`}</StyledCreator>
          </Link>
          <Flex
            direction='row'
            alignItems='center'
            justifyContent='space-between'
          >
            {voucher.minted && (
              <StyledMisc>
                {`Sold for ${utils.formatEther(voucher.minPrice)} ETH`}{' '}
              </StyledMisc>
            )}
            <StyledMisc>{`${new Date(
              Number(voucher.createdAt)
            ).toDateString()}`}</StyledMisc>
          </Flex>
        </Flex>
      </Flex>
    </SimpleGrid>
  );
};
