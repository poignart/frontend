/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from 'react';
import {
  Flex,
  Switch,
  FormControl,
  FormLabel,
  Image as ChakraImage
} from '@chakra-ui/react';

import RadioBox from '../../shared/RadioBox';

import { InfiniteGrid } from './InfiniteGrid';

import { AppContext } from '../../context/AppContext';

import { theme } from '../../themes/theme';

export const AllVouchers = ({ mintedVouchers, unmintedVouchers }) => {
  const context = useContext(AppContext);

  const [contentType, setContentType] = useState('All');
  const [onlyMintable, setOnlyMintable] = useState(true);

  useEffect(() => {
    if (context.redeemEvent) {
      context.updateRedeemEvent(false);
    }
  }, []);

  return (
    <Flex
      direction='column'
      alignItems='center'
      justifyContent='center'
      px={{ base: '1rem', lg: '4rem' }}
      py={{ base: '1rem', lg: '2rem' }}
      mb='1rem'
    >
      {/* Wallet connect & is fetching vouchers */}
      {/* {!context.firstVouchersFetch && (
        <Flex direction='column' alignItems='center' my='auto'>
          <ChakraImage src='assets/loader.svg' alt='loading' w='200px' />
        </Flex>
      )} */}

      <Flex direction='column' w='100%' alignItems='center'>
        <Flex
          w='100%'
          direction={{ base: 'column', lg: 'row' }}
          alignItems={{ base: 'flex-start', lg: 'center' }}
          justifyContent='space-between'
          mb='2rem'
        >
          <FormControl
            display='flex'
            direction='row'
            fontFamily={theme.fonts.spaceMono}
            color={theme.colors.brand.darkCharcoal}
          >
            <FormLabel fontWeight='bold'>Show mintable only</FormLabel>
            <Switch
              defaultChecked={onlyMintable}
              onChange={() => setOnlyMintable((prevState) => !prevState)}
            />
          </FormControl>
          <RadioBox
            stack='horizontal'
            options={['All', 'Image', 'Video', 'Audio']}
            updateRadio={setContentType}
            name='content_type'
            defaultValue={contentType}
            value={contentType}
          />
        </Flex>

        {unmintedVouchers.length != 0 && onlyMintable && (
          <InfiniteGrid
            allVouchers={unmintedVouchers}
            onlyMintable={onlyMintable}
            contentType={contentType}
          />
        )}

        {mintedVouchers.length != 0 && !onlyMintable && (
          <InfiniteGrid
            allVouchers={mintedVouchers}
            onlyMintable={onlyMintable}
            contentType={contentType}
          />
        )}
      </Flex>
    </Flex>
  );
};
