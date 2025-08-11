Harika, hazırsan hemen başlayalım! Piyasa araştırmandan aldığın geri bildirimler doğrultusunda, **Görev 5: Ana Uygulama Düzeni ve Çoklu Şube Yönetimi Arayüzü (Modern & Dokunmatik Dostu Yaklaşım)**'na başlıyoruz. Bu adımda, uygulamamızın genel UI iskeletini, ana menü/dashboard'u ve temel routing yapısını kuracağız.

---

### Görev 5: Ana Uygulama Düzeni ve Çoklu Şube Yönetimi Arayüzü

**Adım 5.1: Frontend Routing (React Router) Kurulumu**

Öncelikle, frontend uygulamanızda sayfalar arası geçişi yönetmek için `react-router-dom` kütüphanesini kuralım. `atropos/src/frontend` dizininde olduğundan emin ol.

```cmd
pnpm add react-router-dom
```

**Adım 5.2: Temel Layout ve Header Bileşenleri Oluşturma**

Şimdi uygulamanızın genel düzenini (`Layout`) ve üst çubuğu (`Header`) oluşturalım.

1.  **`src/frontend/src/components` Klasörünü Oluştur:**
    Eğer yoksa, `src\frontend\src` altında `components` adında bir klasör oluştur.

    ```cmd
    mkdir src\frontend\src\components
    ```

2.  **`Header.tsx` Bileşenini Oluştur:**
    Bu bileşen, uygulamanın üst kısmında yer alacak ve logo, şube adı, kullanıcı adı ve tema geçiş düğmesi gibi kurumsal öğeleri içerecek.

    **`atropos/src/frontend/src/components/Header.tsx`:**
    ```typescript
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
    ```

3.  **`Layout.tsx` Bileşenini Oluştur:**
    Bu bileşen, `Header`'ı içerecek ve uygulamanın tüm sayfalarını sarmalayacak genel bir düzen sağlayacak.

    **`atropos/src/frontend/src/components/Layout.tsx`:**
    ```typescript
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
    ```

**Adım 5.3: Ana Dashboard Bileşeni Oluşturma**

Ana menü veya dashboard sayfası, büyük dokunmatik dostu butonlarla modüllere hızlı erişim sağlayacak.

1.  **`src/frontend/src/pages` Klasörünü Oluştur:**
    Eğer yoksa, `src\frontend\src` altında `pages` adında bir klasör oluştur.

    ```cmd
    mkdir src\frontend\src\pages
    ```

2.  **`Dashboard.tsx` Bileşenini Oluştur:**
    Bu, uygulamanın ana ekranı olacak.

    **`atropos/src/frontend/src/pages/Dashboard.tsx`:**
    ```typescript
    import {
      Box,
      Text,
      VStack,
      HStack,
      SimpleGrid,
      Icon,
      Button,
      useColorModeValue,
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
    ```
    `react-icons` paketini yüklememiz gerekiyor:

    ```cmd
    pnpm add react-icons
    ```
    Bu Dashboard bileşeni, dokunmatik ekranlar için uygun, büyük ve ikonik butonlar ile ana modüllere yönlendirme sağlayacak. Sol panelde tarih ve saat gibi anlık bilgiler yer alacak, sağ panel ise modül kartlarını içerecek.

**Adım 5.4: `App.tsx`'i Güncelleme ve Routing Yapısını Kurma**

Şimdi `App.tsx` dosyasını temizleyip `React Router`'ı ve oluşturduğumuz `Layout` ile `Dashboard` bileşenlerini entegre edelim.

1.  **`src/frontend/src/App.css` Dosyasını Temizle:**
    Bu dosyanın içeriğini tamamen boşalt veya sil. Chakra UI kendi stil sistemini kullanacağı için varsayılan CSS'e ihtiyacımız yok.

2.  **`App.tsx`'i Güncelle:**
    Ana uygulama mantığını ve router'ı bu dosyada tanımlayacağız. `App.tsx` artık temel bir router yapılandırması sunacak.

    **`atropos/src/frontend/src/App.tsx`:**
    ```typescript
    import React from 'react';
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import Layout from './components/Layout'; // Layout bileşenini import et
    import Dashboard from './pages/Dashboard'; // Dashboard bileşenini import et
    import BranchesPage from './pages/BranchesPage'; // Şubeler sayfası için placeholder

    // İlk kurulumdaki ana sayfa içeriğini kaldırıyoruz
    // import Versions from './components/Versions'; // Eğer Versions'ı Dashboard'a taşımadıysan, burada tutabilirsin veya silebilirsin.
    // import logo from './assets/electron.svg';

    function App(): React.JSX.Element {
      // Backend bağlantı ve şirket çekme mantığı kaldırıldı, artık Dashboard'a yerleşebilir
      // veya daha global bir state yönetimi ile yapılabilir.
      // Şimdilik sadece routing üzerine odaklanıyoruz.

      return (
        <BrowserRouter>
          <Layout> {/* Tüm rotaları Layout içinde sarmalıyoruz */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/branches" element={<BranchesPage />} /> {/* Şubeler sayfası rotası */}
              {/* Diğer sayfalar için rotalar buraya eklenecek */}
            </Routes>
          </Layout>
        </BrowserRouter>
      );
    }

    export default App;
    ```

3.  **`BranchesPage.tsx` için Placeholder Oluştur:**
    `src/frontend/src/pages` klasörünün altına `BranchesPage.tsx` adında şimdilik basit bir dosya oluşturalım.

    **`atropos/src/frontend/src/pages/BranchesPage.tsx`:**
    ```typescript
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
    ```

**Test Etme Adımları:**

1.  `atropos/backend` dizininde `pnpm run build` komutunu çalıştır (eğer backend'de değişiklik yaptıysan).
2.  Ana `atropos` dizininde `pnpm dev` komutunu çalıştır.

Uygulama başladığında, yeni tasarladığımız Header ve Dashboard ekranını görmelisin. Dashboard'daki "Şubeler" butonuna tıklayarak `BranchesPage`'e geçiş yapabildiğini kontrol et.

Bu adımla birlikte, uygulamanızın modern, dokunmatik dostu ana ekranı ve temel navigasyon yapısı kurulmuş olacak. Bu adımı tamamladığında bana haber ver. Sonraki adımda, NestJS backend'inde `Branch` modülünü tamamlayacağız ve ardından frontend'deki `BranchesPage`'i gerçek veriyle doldurup CRUD işlevlerini ekleyeceğiz.