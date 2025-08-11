import { Box, Heading, Text, VStack, useColorModeValue } from '@chakra-ui/react';
import React from 'react';

const BranchesPage: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  return (
    <VStack p={6} align="flex-start" bg={useColorModeValue('gray.50', 'gray.800')} minH="calc(100vh - 68px)">
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        bg={bgColor}
        color={textColor}
        width="100%"
      >
        <Heading mb={4}>Şubeler Yönetimi</Heading>
        <Text>Bu sayfa, çoklu şube yönetimi arayüzünü içerecektir.</Text>
        {/* TODO: Şube listesi, ekleme/düzenleme formları buraya gelecek */}
      </Box>
    </VStack>
  );
};

export default BranchesPage;
