import {
  Box,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  Icon,
  Button,
  useColorModeValue,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { FaShoppingCart, FaCashRegister, FaUtensils, FaBoxes, FaUsers, FaChartLine, FaStoreAlt, FaCog } from 'react-icons/fa'; // İkonlar için

// Navigasyon kartları için veri
const menuItems = [
  { id: 'sales', name: 'SATIŞLAR', icon: FaShoppingCart, path: '/sales', color: 'red.500' },
  { id: 'cash-register', name: 'KASA', icon: FaCashRegister, path: '/cash-register', color: 'blue.500' },
  { id: 'products', name: 'ÜRÜNLER', icon: FaUtensils, path: '/products', color: 'green.500' },
  { id: 'stocks', name: 'STOKLAR', icon: FaBoxes, path: '/stocks', color: 'orange.500' },
  { id: 'customers', name: 'CARİLER', icon: FaUsers, path: '/customers', color: 'purple.500' },
  { id: 'reports', name: 'RAPORLAR', icon: FaChartLine, path: '/reports', color: 'teal.500' },
  { id: 'branches', name: 'ŞUBELER', icon: FaStoreAlt, path: '/branches', color: 'brown.500' },
  { id: 'settings', name: 'AYARLAR', icon: FaCog, path: '/settings', color: 'gray.600' },
];

const Dashboard: React.FC = () => {
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardHoverBgColor = useColorModeValue('gray.50', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const timeColor = useColorModeValue('gray.700', 'whiteAlpha.800');

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Her saniye günceller
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    };
    return date.toLocaleDateString('tr-TR', options);
  };

  const formatTime = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24 saat formatı
    };
    return date.toLocaleTimeString('tr-TR', options);
  };


  return (
    <Flex height="calc(100vh - 68px)" p={6} pt={0} bg={useColorModeValue('gray.50', 'gray.800')}> {/* Header yüksekliğini düş */}
      {/* Sol Panel: Tarih ve Saat */}
      <VStack
        width={{ base: '100%', md: '25%' }}
        minWidth={{ md: '250px' }} // Sabit genişlik
        p={6}
        spacing={8}
        align="flex-start"
        justify="center"
        bg={useColorModeValue('white', 'gray.900')}
        borderRadius="lg"
        shadow="md"
        mr={6}
        display={{ base: 'none', md: 'flex' }} // Mobil ve küçük ekranlarda gizle
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          {formatDate(currentDateTime)}
        </Text>
        <Text fontSize="6xl" fontWeight="extrabold" color={timeColor}>
          {formatTime(currentDateTime)}
        </Text>

        {/* Bildirimler (Placeholder) */}
        <VStack align="flex-start" spacing={3} width="100%" mt={8}>
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>BİLDİRİMLER</Text>
            {/* TODO: Dinamik bildirimler buraya gelecek */}
            <Box p={3} bg={useColorModeValue('blue.50', 'blue.800')} borderRadius="md" width="100%">
                <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('blue.800', 'blue.100')}>Yeni online sipariş! Getir</Text>
                <Text fontSize="xs" color={useColorModeValue('blue.600', 'blue.300')}>15:27</Text>
            </Box>
             <Box p={3} bg={useColorModeValue('green.50', 'green.800')} borderRadius="md" width="100%">
                <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('green.800', 'green.100')}>Yeni online sipariş! Trendyol</Text>
                <Text fontSize="xs" color={useColorModeValue('green.600', 'green.300')}>15:32</Text>
            </Box>
            <Box p={3} bg={useColorModeValue('purple.50', 'purple.800')} borderRadius="md" width="100%">
                <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('purple.800', 'purple.100')}>Yeni online sipariş! Yemek Sepeti</Text>
                <Text fontSize="xs" color={useColorModeValue('purple.600', 'purple.300')}>15:41</Text>
            </Box>
            <Button variant="link" colorScheme="blue" size="sm" mt={2} alignSelf="flex-end">
                Tüm bildirimleri göster →
            </Button>
        </VStack>

        <Spacer />

        <Button variant="ghost" colorScheme="gray" leftIcon={<Icon as={FaCog} />} mt={8}>
          Müşteri Hizmetleri
        </Button>

        <Text fontSize="xs" color="gray.500" alignSelf="center">
            Menulux Pos 1.0 (örnek referans)
        </Text>

        <HStack width="100%" justifyContent="center" mt={4}>
          <Box p={2} bg={useColorModeValue('gray.200', 'gray.600')} borderRadius="md">
            <Icon as={FaCog} />
          </Box>
          <Text fontSize="md" fontWeight="bold">Ayarlar</Text>
        </HStack>
      </VStack>

      {/* Sağ Panel: Menü Butonları */}
      <SimpleGrid
        flex="1"
        columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
        spacing={6}
        p={6}
        borderRadius="lg"
        shadow="md"
        bg={useColorModeValue('white', 'gray.900')}
      >
        {menuItems.map((item) => (
          <Button
            as={RouterLink}
            to={item.path}
            key={item.id}
            height="150px"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            py={6}
            px={4}
            borderRadius="lg"
            shadow="md"
            bg={cardBgColor}
            _hover={{
              shadow: 'lg',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out',
              bg: cardHoverBgColor,
            }}
            transition="all 0.2s ease-in-out"
          >
            <Icon as={item.icon} boxSize={10} color={item.color} mb={2} />
            <Text fontSize="lg" fontWeight="semibold" color={textColor}>{item.name}</Text>
          </Button>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default Dashboard;
