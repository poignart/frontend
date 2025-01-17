/* eslint-disable react-hooks/exhaustive-deps */
import {
  Flex,
  Heading,
  Button,
  Text,
  Image as ChakraImage,
  SimpleGrid,
  Skeleton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea
} from '@chakra-ui/react';
import { useContext, useState } from 'react';
import Link from 'next/link';

import styled from '@emotion/styled';
import { utils, BigNumber } from 'ethers';
import useWarnings from '../hooks/useWarnings';

import { AppContext } from '../context/AppContext';
import { CopyIcon } from '../icons/CopyIcon';
import { TwitterIcon } from '../icons/TwitterIcon';
import { getTokenURI, redeem } from '../utils/web3';
import { redeemVoucher } from '../utils/requests';
import { uriToHttp } from '../utils/helpers';
import { theme } from '../themes/theme';

import {
  OPENSEA_BASE_URL,
  POIGNARD_CONTRACT_ADDRESS,
  POIGNART_BUCKET_BASE_URL,
  CHAIN_ID,
  CHAIN_NAME,
  devMode
} from '../config';

const StyledButton = styled(Button)`
  height: 50px;
  font-family: ${theme.fonts.spaceGrotesk};
  text-transform: uppercase;
  border: 2px solid ${theme.colors.brand.black};
  border-radius: 3px;
  box-decoration-break: clone;
  padding-left: 24px;
  padding-right: 24px;
  margin-top: 1rem;
`;

const StyledHeading = styled(Heading)`
  font-size: 25px;
  font-weight: bold;
  font-family: ${theme.fonts.spaceGrotesk};
  color: ${theme.colors.brand.black};
`;

const StyledDescription = styled(Text)`
  margin-top: 2rem;
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

const StyledCopy = styled(Text)`
  color: ${theme.colors.brand.black};
  font-family: ${theme.fonts.spaceGrotesk};
  margin-top: 0.5rem;
  font-size: 12px;
`;

export const Voucher = ({ voucher }) => {
  const context = useContext(AppContext);
  const { triggerToast } = useWarnings();
  const [isOpen, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const storeData = async (voucher) => {
    try {
      setLoadingText('Storing offchain data..');
      await redeemVoucher(
        {
          tokenID: voucher.tokenID
        },
        context.signature
      );
      context.updateRedeemEvent(true);
    } catch (err) {
      console.log(err);
      triggerToast('Failed to store data offchain.');
    }
  };

  const handleRedeem = async (voucher) => {
    if (Number(context.chainId) == CHAIN_ID) {
      setLoading(true);
      setLoadingText('Checking token..');
      let uri;
      try {
        uri = await getTokenURI(voucher.tokenID, context.ethersProvider);
      } catch (err) {
        console.log(err.message);
      }
      if (uri) {
        triggerToast('Token already minted. Updating records!');
        await storeData(voucher);
        setLoading(false);
        return;
      }
      setLoadingText('Awaiting transaction..');
      let tx;
      try {
        tx = await redeem(
          context.ethersProvider,
          context.signerAddress,
          {
            tokenId: voucher.tokenID,
            minPrice: BigNumber.from(voucher.minPrice),
            uri: voucher.tokenURI
          },
          voucher.signature,
          voucher.createdBy.merkleProof
        );
        setLoadingText('Transaction in progress..');
        if (tx) {
          const { status } = await tx.wait();
          if (status === 1) {
            await storeData(voucher);
            setOpen(true);
          } else {
            triggerToast('Transaction failed.');
          }
        }
      } catch (err) {
        triggerToast('Transaction failed.');
      }
      setLoading(false);
    } else {
      triggerToast(`Please switch to ${CHAIN_NAME[CHAIN_ID]} `);
    }
  };

  const copyToClipboard = (value) => {
    const tempInput = document.createElement('input');
    tempInput.value = value;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    triggerToast('Copied to clipboard!');
  };

  return (
    <Flex
      px={{ base: '1rem', lg: '4rem' }}
      py={{ base: '1rem', lg: '4rem' }}
      justifyContent='center'
      alignItems='center'
      minH='70vh'
    >
      {voucher && (
        <SimpleGrid
          columns={{ base: 1, md: 1, lg: 2 }}
          maxW='60rem'
          gridGap={10}
        >
          <Flex direction='column' position='relative'>
            {(voucher.contentType === 'image' ||
              voucher.contentType === 'audio') && (
              <ChakraImage
                src={uriToHttp(voucher.metadata.image)}
                crossOrigin='anonymous'
                alt='minted nft'
                fallback={<Skeleton h='250px' w='100%' />}
                objectFit={
                  voucher.contentType === 'audio' ? 'cover' : 'contain'
                }
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
              <Link href='/explore' passHref>
                <StyledButton width='30%' mr='1rem' disabled={loading}>
                  Explore
                </StyledButton>
              </Link>
              {(voucher.minted || context.redeemEvent) && (
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
              {!voucher.minted && !context.redeemEvent && (
                <StyledButton
                  w='100%'
                  color={theme.colors.brand.white}
                  bg={theme.colors.brand.black}
                  isLoading={loading}
                  loadingText={loadingText}
                  onClick={() => {
                    if (context.signature) {
                      handleRedeem(voucher);
                    } else {
                      triggerToast('Connect wallet to redeem.');
                    }
                  }}
                >
                  {`Mint for ${utils.formatEther(voucher.minPrice)} ETH`}
                </StyledButton>
              )}
            </Flex>
          </Flex>
          <Flex direction='column'>
            <StyledHeading>
              {voucher.metadata.name.substring(0, 25)}
            </StyledHeading>
            <StyledCopy
              onClick={() => copyToClipboard(window.location.href)}
              cursor='pointer'
              _hover={{
                color: theme.colors.brand.black
              }}
            >
              Copy voucher link <CopyIcon boxSize={4} />
            </StyledCopy>

            <Flex direction='column'>
              <StyledDescription>
                {voucher.metadata.description.substring(0, 250)}
                {voucher.metadata.description.length > 250 && ' ..'}
              </StyledDescription>

              <Link href={`/artist/${voucher.createdBy.ethAddress}`} passHref>
                <StyledCreator>{`Created by ${voucher.createdBy.name}`}</StyledCreator>
              </Link>
              <Flex direction='column'>
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
      )}

      {voucher && (
        <Modal isOpen={isOpen} onClose={() => setOpen(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontFamily={theme.fonts.spaceMono}>
              Thank you!
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text fontFamily={theme.fonts.spaceMono} mb='1rem'>
                Spread the word about your contribution!
              </Text>
              <Textarea fontFamily={theme.fonts.spaceMono} isReadOnly>
                {`I just minted art for ${utils.formatEther(
                  voucher.minPrice
                )} on @PoignARTnft 100% of proceeds are donated to Ukraine. 🇺🇦 #Unchain_Ukraine #StandWithUkraine ${
                  devMode
                    ? 'https://rinkeby.poign.art/voucher/' + voucher.tokenID
                    : 'https://poign.art/voucher/' + voucher.tokenID
                }`}
              </Textarea>
            </ModalBody>

            <ModalFooter>
              <Button
                w='100%'
                leftIcon={<TwitterIcon />}
                fontFamily={theme.fonts.spaceMono}
                colorScheme='twitter'
                variant='solid'
                textDecoration='none'
                onClick={() => {
                  var start_text = 'https://twitter.com/intent/tweet?text=';
                  var generated_tweet = encodeURIComponent(
                    `I just minted art for ${utils.formatEther(
                      voucher.minPrice
                    )} on @PoignARTnft 100% of proceeds are donated to Ukraine. 🇺🇦 #Unchain_Ukraine #StandWithUkraine`
                  );
                  var generated_url =
                    '&url=' +
                    encodeURIComponent(
                      devMode
                        ? 'https://rinkeby.poign.art.io/voucher/' +
                            voucher.tokenID
                        : 'https://poign.art.io/voucher/' + voucher.tokenID
                    );
                  window.open(
                    start_text + generated_tweet + generated_url,
                    '_blank'
                  );
                }}
              >
                Tweet
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Flex>
  );
};
