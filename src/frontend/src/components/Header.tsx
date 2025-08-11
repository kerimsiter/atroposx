import {
  Box,
  Flex,
  Text,
  IconButton,
  HStack,
  Spacer,
  useColorMode,
  useColorModeValue,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button, // MenuButton için kullanılıyor
} from '@chakra-ui/react';
import { SettingsIcon, SunIcon, MoonIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React from 'react';

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.700'); // Header arka planı beyaz veya koyu gri
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  const currentBranchName = "Ana Şube"; // TODO: Dinamik hale getirilecek
  const currentUserName = "Oğuzhan A."; // TODO: Dinamik hale getirilecek
  const appName = "Atropos POS System";

  return (
    <Flex
      as="header"
      width="100%"
      p={4}
      bg={bgColor}
      color={textColor}
      borderBottomWidth="1px"
      borderColor={useColorModeValue('gray.200', 'gray.600')}
      align="center"
      justify="space-between"
      boxShadow="sm" // Hafif bir gölge
    >
      {/* Sol Kısım: Logo ve Uygulama Adı */}
      <HStack spacing={2} ml={2}> {/* Hafifçe sola çek */}
        <Box fontSize="3xl" color="atropos.500" fontWeight="bold">⚡</Box> {/* Atropos rengi */}
        <Text fontSize="xl" fontWeight="bold" fontFamily="heading">{appName}</Text> {/* Daha belirgin font */}
      </HStack>

      <Spacer />

      {/* Sağ Kısım: Şube, Kullanıcı, Tema ve Ayarlar */}
      <HStack spacing={3} mr={2}> {/* Hafifçe sağa çek */}
        {/* Şube Seçimi */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost" // Daha sade
            size="sm"
            fontWeight="normal" // Daha ince font
          >
            {currentBranchName}
          </MenuButton>
          <MenuList bg={bgColor} borderColor={useColorModeValue('gray.200', 'gray.600')}>
            <MenuItem _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}>Şube 1</MenuItem>
            <MenuItem _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}>Şube 2</MenuItem>
          </MenuList>
        </Menu>

        {/* Kullanıcı Bilgisi */}
        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<ChevronDownIcon />}
            variant="ghost" // Daha sade
            size="sm"
            fontWeight="normal" // Daha ince font
          >
            {currentUserName}
          </MenuButton>
          <MenuList bg={bgColor} borderColor={useColorModeValue('gray.200', 'gray.600')}>
            <MenuItem _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}>Profil</MenuItem>
            <MenuItem _hover={{ bg: useColorModeValue('gray.100', 'gray.600') }}>Çıkış Yap</MenuItem>
          </MenuList>
        </Menu>

        {/* Tema Geçiş Butonu */}
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="sm"
          isRound
          variant="ghost" // Daha sade
        />

        {/* Ayarlar Butonu */}
        <IconButton
          aria-label="Settings"
          icon={<SettingsIcon />}
          size="sm"
          isRound
          variant="ghost" // Daha sade
          onClick={() => console.log('Ayarlar açılıyor...')}
        />
      </HStack>
    </Flex>
  );
};

export default Header;
