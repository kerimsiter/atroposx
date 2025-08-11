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
import { FaShoppingCart, FaCashRegister, FaUtensils, FaBoxes, FaUsers, FaChartLine, FaStoreAlt, FaCog, FaLock, FaWifi, FaServer } from 'react-icons/fa'; // İkonlar için
import { HiOutlineDocumentText } from 'react-icons/hi'; // Başka bir ikon kütüphanesi
import { BiRestaurant } from 'react-icons/bi'; // Restoran ikonu
import { MdOutlineFastfood } from 'react-icons/md'; // Fast food ikonu

// Navigasyon kartları için veri
const menuItems = [
  { id: 'sales', name: 'SATIŞLAR', icon: FaShoppingCart, path: '/sales', colorKey: 'menuIcons.sales' },
  { id: 'cash-register', name: 'KASA', icon: FaCashRegister, path: '/cash-register', colorKey: 'menuIcons.cashRegister' },
  { id: 'products', name: 'ÜRÜNLER', icon: FaUtensils, path: '/products', colorKey: 'menuIcons.products' },
  { id: 'stocks', name: 'STOKLAR', icon: FaBoxes, path: '/stocks', colorKey: 'menuIcons.stocks' },
  { id: 'customers', name: 'CARİLER', icon: FaUsers, path: '/customers', colorKey: 'menuIcons.customers' },
  { id: 'reports', name: 'RAPORLAR', icon: FaChartLine, path: '/reports', colorKey: 'menuIcons.reports' },
  { id: 'branches', name: 'ŞUBELER', icon: FaStoreAlt, path: '/branches', colorKey: 'menuIcons.branches' },
  { id: 'settings', name: 'AYARLAR', icon: FaCog, path: '/settings', colorKey: 'menuIcons.settings' },
];

const Dashboard: React.FC = () => {
  const cardBgColor = useColorModeValue('white', 'gray.700');
  const cardHoverBgColor = useColorModeValue('gray.50', 'gray.600');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');
  const subTextColor = useColorModeValue('gray.600', 'gray.400'); // Daha yumuşak alt metin rengi

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
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
      hour12: false,
    };
    return date.toLocaleTimeString('tr-TR', options);
  };

  const NotificationCard: React.FC<{ type: string; time: string; colorScheme: string }> = ({ type, time, colorScheme }) => (
    <Box
      p={3}
      bg={useColorModeValue(`${colorScheme}.50`, `${colorScheme}.800`)}
      borderRadius="md"
      width="100%"
      boxShadow="sm"
      _hover={{ boxShadow: 'md', transform: 'translateY(-1px)' }}
      transition="all 0.2s ease-in-out"
    >
      <Text fontSize="sm" fontWeight="medium" color={useColorModeValue(`${colorScheme}.800`, `${colorScheme}.100`)}>
        Yeni online sipariş! {type}
      </Text>
      <Text fontSize="xs" color={useColorModeValue(`${colorScheme}.600`, `${colorScheme}.300`)}>
        {time}
      </Text>
    </Box>
  );

  return (
    <Flex height="calc(100vh - 68px)" p={6} bg={useColorModeValue('gray.50', 'gray.800')}>
      {/* Sol Panel: Tarih, Saat, Bildirimler ve Durumlar */}
      <VStack
        width={{ base: '100%', md: '300px' }} // Sabit, daha şık genişlik
        minWidth="280px"
        p={6}
        spacing={8}
        align="flex-start"
        bg={useColorModeValue('white', 'gray.700')}
        borderRadius="xl" // Daha yumuşak köşeler
        shadow="xl" // Daha belirgin gölge
        mr={6}
        display={{ base: 'none', md: 'flex' }}
        flexShrink={0} // Küçülmeyi engelle
      >
        <VStack align="flex-start" spacing={1} width="100%">
          <Text fontSize="xl" fontWeight="medium" color={textColor}>
            {formatDate(currentDateTime)}
          </Text>
          <Text fontSize="5xl" fontWeight="extrabold" color={textColor} lineHeight="1.1">
            {formatTime(currentDateTime)}
          </Text>
        </VStack>

        {/* Bildirimler */}
        <VStack align="flex-start" spacing={3} width="100%">
          <Text fontSize="lg" fontWeight="semibold" color={textColor}>BİLDİRİMLER</Text>
          <NotificationCard type="Getir" time="15:27" colorScheme="blue" />
          <NotificationCard type="Trendyol" time="15:32" colorScheme="green" />
          <NotificationCard type="Yemek Sepeti" time="15:41" colorScheme="purple" />
          <Button variant="link" colorScheme="atropos" size="sm" mt={2} alignSelf="flex-end" fontWeight="normal">
            Tüm bildirimleri göster →
          </Button>
        </VStack>

        <Spacer /> {/* Durum çubuklarını aşağı it */}

        {/* Bağlantı Durumları */}
        <VStack align="flex-start" spacing={2} width="100%" color={subTextColor}>
          <HStack>
            <Icon as={FaWifi} color="green.500" />
            <Text fontSize="sm">İnternet: Bağlı</Text>
          </HStack>
          <HStack>
            <Icon as={FaServer} color="green.500" />
            <Text fontSize="sm">Sunucu: Bağlı</Text>
          </HStack>
        </VStack>

        {/* Müşteri Hizmetleri ve Ayarlar */}
        <HStack width="100%" justifyContent="space-between" pt={4} borderTopWidth="1px" borderColor={useColorModeValue('gray.100', 'gray.600')}>
          <Button variant="ghost" colorScheme="gray" leftIcon={<Icon as={HiOutlineDocumentText} />} size="sm" fontWeight="normal">
            Müşteri Hizmetleri
          </Button>
          <Button variant="ghost" colorScheme="gray" leftIcon={<Icon as={FaLock} />} size="sm" fontWeight="normal">
            Kilit
          </Button>
        </HStack>

        <Text fontSize="xs" color="gray.500" alignSelf="center" mt={2}>
          Atropos POS v1.0
        </Text>
      </VStack>

      {/* Sağ Panel: Ana Menü Kartları */}
      <SimpleGrid
        flex="1"
        columns={{ base: 2, sm: 2, md: 3, lg: 4 }} // Dokunmatik ekranlar için yeterli büyüklük
        spacing={6} // Kartlar arası boşluk
        p={6}
        borderRadius="xl"
        shadow="xl" // Sol panel ile uyumlu gölge
        bg={useColorModeValue('white', 'gray.700')}
        ml={{ base: 0, md: 6 }} // Mobil cihazlarda sol paneli gizlediğimiz için margin kaldırılır
      >
        {menuItems.map((item) => (
          <Box
            as={RouterLink}
            to={item.path}
            key={item.id}
            p={6}
            borderRadius="lg"
            shadow="sm"
            bg={cardBgColor}
            transition="all 0.2s ease-in-out"
            _hover={{
              transform: 'translateY(-3px)',
              shadow: 'md',
              bg: cardHoverBgColor,
            }}
            _active={{
              transform: 'scale(0.98)', // Basıldığında hafif küçülme
            }}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            textAlign="center"
            minHeight="160px" // Dokunmatik için uygun yükseklik
            cursor="pointer"
          >
            <Icon as={item.icon} boxSize={14} color={item.colorKey} mb={3} /> {/* Büyük ikon */}
            <Text fontSize="xl" fontWeight="bold" color={textColor}>{item.name}</Text> {/* Büyük ve kalın metin */}
          </Box>
        ))}
      </SimpleGrid>
    </Flex>
  );
};

export default Dashboard;
