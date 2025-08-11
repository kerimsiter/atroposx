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
  Button,
} from '@chakra-ui/react';
import { SettingsIcon, SunIcon, MoonIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React from 'react';

const Header: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  // TODO: Dinamik şube ve kullanıcı bilgileri buraya gelecek
  const currentBranchName = "Ana Şube";
  const currentUserName = "Oğuzhan A.";
  const appName = "Atropos POS System"; // Uygulama adı

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
    >
      {/* Sol Kısım: Logo ve Uygulama Adı */}
      <HStack spacing={3}>
        <Box fontSize="2xl" fontWeight="bold">⚡</Box> {/* Basit logo */}
        <Text fontSize="xl" fontWeight="semibold">{appName}</Text>
      </HStack>

      <Spacer />

      {/* Sağ Kısım: Şube, Kullanıcı, Tema ve Ayarlar */}
      <HStack spacing={4}>
        {/* Şube Seçimi (Şimdilik Sabit) */}
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
            {currentBranchName}
          </MenuButton>
          <MenuList>
            {/* TODO: Dinamik şubeler buraya gelecek */}
            <MenuItem>Şube 1</MenuItem>
            <MenuItem>Şube 2</MenuItem>
          </MenuList>
        </Menu>

        {/* Kullanıcı Bilgisi (Şimdilik Sabit) */}
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />} size="sm">
            {currentUserName}
          </MenuButton>
          <MenuList>
            <MenuItem>Profil</MenuItem>
            <MenuItem>Çıkış Yap</MenuItem>
          </MenuList>
        </Menu>

        {/* Tema Geçiş Butonu */}
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="sm"
          isRound
        />

        {/* Ayarlar Butonu */}
        <IconButton
          aria-label="Settings"
          icon={<SettingsIcon />}
          size="sm"
          isRound
          onClick={() => {
            // TODO: Ayarlar sayfasına yönlendirme veya modal açma
            console.log('Ayarlar açılıyor...');
          }}
        />
      </HStack>
    </Flex>
  );
};

export default Header;
