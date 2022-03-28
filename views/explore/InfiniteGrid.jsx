/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from 'react';
import { SimpleGrid, Box, Text, Flex, Button } from '@chakra-ui/react';
import { utils } from 'ethers';
import Image from 'next/image';
import styled from '@emotion/styled';

import { theme } from '../../themes/theme';
import { uriToHttp } from '../../utils/helpers';
import { POIGNART_BUCKET_BASE_URL, VOUCHERS_PER_PAGE } from '../../config';

const StyledTokenId = styled(Text)`
  position: absolute;
  right: 0;
  bottom: 0;
  padding: 5px 10px;
  background-color: ${theme.colors.brand.yellow};
  font-family: ${theme.fonts.spaceMono};
`;

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

export const InfiniteGrid = ({
  allVouchers,
  onlyMintable,
  totalPages,
  setDialogData,
  setDialogStatus
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentVouchers, setCurrentVouchers] = useState([]);

  const paginate = () => {
    const indexOfLastVoucher = currentPage * VOUCHERS_PER_PAGE;
    const indexOfFirstVoucher = indexOfLastVoucher - VOUCHERS_PER_PAGE;
    const currentVouchers = allVouchers.slice(
      indexOfFirstVoucher,
      indexOfLastVoucher
    );

    setCurrentVouchers(currentVouchers);
  };

  useEffect(() => {
    paginate();
  }, [currentPage]);

  return (
    <Flex direction='column' alignItems='center'>
      <SimpleGrid
        columns={{ lg: 3, md: 2, base: 1 }}
        gridGap={{ base: 5, lg: 10 }}
        w='100%'
      >
        {currentVouchers.map((voucher, index) => {
          return (
            <Box
              key={index}
              position='relative'
              cursor='pointer'
              _hover={{
                opacity: 0.7
              }}
              onClick={() => {
                setDialogData(voucher);
                setDialogStatus(true);
              }}
              mb='2rem'
            >
              <Image
                crossOrigin='anonymous'
                src={`${POIGNART_BUCKET_BASE_URL}/${voucher.metadata.image.replace(
                  'ipfs://',
                  ''
                )}`}
                loader={() => uriToHttp(voucher.metadata.image)}
                alt='minted nft'
                width='300px'
                height='100%'
                objectFit='cover'
              />

              <Box
                key={index}
                position='absolute'
                bottom='0'
                left='0'
                bg={theme.colors.brand.yellow}
                p='7px'
                h='35px'
                w='35px'
              >
                {voucher.contentType === 'audio' && (
                  <span>
                    <i className='fa-solid fa-music'></i>
                  </span>
                )}
                {voucher.contentType === 'video' && (
                  <span>
                    <i className='fa-solid fa-video'></i>
                  </span>
                )}
                {voucher.contentType === 'image' && (
                  <span>
                    <i className='fa-solid fa-image'></i>
                  </span>
                )}
              </Box>

              <StyledTokenId>
                {onlyMintable
                  ? `${utils.formatEther(voucher.minPrice)} ETH`
                  : 'Sold'}
              </StyledTokenId>
            </Box>
          );
        })}
      </SimpleGrid>
      <Flex direction='row'>
        <StyledButton
          mr='1rem'
          disabled={currentPage - 1 == 0}
          onClick={() => setCurrentPage((currentPage) => currentPage - 1)}
        >
          Prev
        </StyledButton>
        <StyledButton
          disabled={currentPage + 1 > totalPages}
          onClick={() => setCurrentPage((currentPage) => currentPage + 1)}
        >
          Next
        </StyledButton>
      </Flex>
    </Flex>
  );
};
