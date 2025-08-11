import { Box, Flex } from '@chakra-ui/react';
import React from 'react';
import Header from './Header'; // Header bileşenini import et

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <Flex direction="column" minH="100vh">
      <Header /> {/* Üst çubuk */}
      <Box as="main" flex="1" p={0}> {/* Ana içerik alanı, p=0 ile padding'i kaldır */}
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;
