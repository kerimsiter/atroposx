import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import BranchesPage from './pages/BranchesPage';
import {
  Box,
  Text,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
} from '@chakra-ui/react';

// Versions bileşeni artık App.tsx içinde
const Versions: React.FC = () => {
  const [versions, setVersions] = useState<{ [key: string]: string } | null>(null);
  const textColor = useColorModeValue('gray.600', 'gray.400');

  useEffect(() => {
    if (window.electron && window.electron.process && window.electron.ipcRenderer) {
      const getVersions = async () => {
        try {
          const chrome = await window.electron.ipcRenderer.invoke('get-chrome-version');
          const electron = await window.electron.ipcRenderer.invoke('get-electron-version');
          const node = await window.electron.ipcRenderer.invoke('get-node-version');
          setVersions({ chrome, electron, node });
        } catch (error) {
          console.error("Failed to get versions from main process:", error);
        }
      };
      getVersions();
    }
  }, []);

  return (
    <HStack spacing={4} fontSize="sm" color={textColor} mt={4}>
      {versions ? (
        <>
          <Text>Electron v{versions.electron}</Text>
          <Text>Chromium v{versions.chrome}</Text>
          <Text>Node v{versions.node}</Text>
        </>
      ) : (
        <Text>Sürümler yükleniyor...</Text>
      )}
    </HStack>
  );
};


function App(): React.JSX.Element {
  const [backendUrl, setBackendUrl] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]); // Sadece bağlantı testi için
  const [statusMessage, setStatusMessage] = useState('Backend API URL alınıyor...');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  useEffect(() => {
    window.api.getNestApiUrl().then((url) => {
      setBackendUrl(url);
      setStatusMessage(`NestJS API URL: ${url}`);
    }).catch((err) => {
      setStatusMessage(`API URL alınamadı: ${err.message}`);
      console.error(err);
      setIsLoading(false);
      setIsError(true);
    });
  }, []);

  useEffect(() => {
    if (backendUrl) {
      const fetchCompanies = async () => {
        try {
          const response = await fetch(`${backendUrl}/company`);
          if (!response.ok) {
            throw new Error(`HTTP hatası! Durum: ${response.status}`);
          }
          const data = await response.json();
          setCompanies(data);
          setStatusMessage('Backend bağlantısı başarılı! Şirketler yüklendi.');
          setIsLoading(false);
          setIsError(false);
        } catch (error: any) {
          setStatusMessage(`Backend bağlantı hatası: ${error.message}`);
          console.error('Şirketler çekilirken hata oluştu:', error);
          setIsLoading(false);
          setIsError(true);
        }
      };
      setTimeout(fetchCompanies, 2000);
    }
  }, [backendUrl]);


  // Eğer backend bağlantısı hala kontrol ediliyorsa veya hata varsa yükleme ekranını göster
  if (isLoading || isError) {
    return (
      <VStack p={8} spacing={6} align="center" justify="center" minH="100vh" bg={bgColor}>
        <Box fontSize="5xl" mb={4} color="atropos.500">⚡</Box>
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>Atropos POS System</Text>
        
        <Box
          p={5}
          shadow="md"
          borderWidth="1px"
          borderRadius="lg"
          bg={useColorModeValue('white', 'gray.700')}
          color={textColor}
          width={{ base: '90%', md: '600px' }}
        >
          <Text fontSize="xl" fontWeight="semibold" mb={3}>Backend Durumu</Text>
          {isLoading ? (
            <HStack justifyContent="center">
              <Spinner size="md" color="atropos.500" />
              <Text>{statusMessage}</Text>
            </HStack>
          ) : (
            <Alert status="error">
              <AlertIcon />
              <AlertTitle mr={2}>Bağlantı Hatası!</AlertTitle>
              <AlertDescription>{statusMessage}</AlertDescription>
            </Alert>
          )}

          {companies.length > 0 && ( // Şirketleri sadece bağlantı başarılıysa göster
            <Box mt={4}>
              <Text fontSize="lg" fontWeight="semibold">Veritabanındaki Şirketler:</Text>
              <VStack as="ul" align="flex-start" mt={2} spacing={1}>
                {companies.map((company) => (
                  <Text as="li" key={company.id}>
                    <Text as="span" fontWeight="bold">{company.name}</Text> (Vergi No: {company.taxNumber})
                  </Text>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
        <Versions /> {/* Sürüm bilgileri */}
      </VStack>
    );
  }

  // Bağlantı başarılıysa ana uygulamayı göster
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/branches" element={<BranchesPage />} />
          {/* Diğer sayfalar için rotalar buraya eklenecek */}
          {/* Hızlı Satış, Ürünler, Stoklar, Cariler, Raporlar, Ayarlar vb. */}
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
