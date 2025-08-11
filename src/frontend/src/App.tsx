import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  useColorMode, // Tema değiştirmek için hook
  useColorModeValue, // Tema bağlı değerler için hook
  Spinner, // Yükleme animasyonu için
  Alert, AlertIcon, AlertTitle, AlertDescription, // Durum mesajları için
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons'; // Tema geçiş ikonları için

function App(): React.JSX.Element {
  const [backendUrl, setBackendUrl] = useState<string | null>(null);
  const [companies, setCompanies] = useState<any[]>([]);
  const [statusMessage, setStatusMessage] = useState('Backend API URL alınıyor...');
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const { colorMode, toggleColorMode } = useColorMode(); // Tema geçiş hook'u
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900'); // Tema bazlı metin rengi

  // Electron IPC (main process ile iletişim)
  const handleIpcPing = (): void => window.electron.ipcRenderer.send('ping');

  useEffect(() => {
    // Main process'ten NestJS API URL'ini al
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
      // API bağlantısını test et ve şirketleri çek
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

      // Backend'in başlaması için kısa bir süre bekle, sonra bağlantıyı test et
      setTimeout(fetchCompanies, 2000);
    }
  }, [backendUrl]);

  return (
    <VStack p={8} spacing={6} align="center" justify="center" minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      <HStack position="absolute" top={4} right={4}>
        <Button onClick={toggleColorMode} size="sm">
          {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        </Button>
      </HStack>

      <Box fontSize="5xl" mb={4}>⚡</Box>
      <Text fontSize="2xl" fontWeight="bold">Atropos POS System</Text>
      
      <Text fontSize="lg" color={textColor}>
        Built with <Text as="span" color="blue.400">React</Text>,{' '}
        <Text as="span" color="cyan.400">TypeScript</Text>,{' '}
        <Text as="span" color="purple.400">NestJS</Text> &{' '}
        <Text as="span" color="green.400">PostgreSQL</Text>
      </Text>

      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        bg={useColorModeValue('white', 'gray.700')}
        color={textColor}
        width={{ base: '90%', md: '600px' }}
      >
        <Text fontSize="xl" fontWeight="semibold" mb={3}>Backend Status</Text>
        {isLoading ? (
          <HStack justifyContent="center">
            <Spinner size="md" />
            <Text>{statusMessage}</Text>
          </HStack>
        ) : isError ? (
          <Alert status="error">
            <AlertIcon />
            <AlertTitle mr={2}>Bağlantı Hatası!</AlertTitle>
            <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        ) : (
          <Alert status="success">
            <AlertIcon />
            <AlertTitle mr={2}>Bağlantı Başarılı!</AlertTitle>
            <AlertDescription>{statusMessage}</AlertDescription>
          </Alert>
        )}

        {companies.length > 0 && (
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

      <Text className="tip" fontSize="sm" color={textColor}>
        Backend loglarını ve daha fazlasını görmek için <code>F12</code> tuşuna basarak DevTools'u açın.
      </Text>
      
      <HStack spacing={4} mt={6}>
        <Button as="a" href="https://electron-vite.org/" target="_blank" rel="noreferrer" colorScheme="blue">
          Dokümantasyon
        </Button>
        <Button onClick={handleIpcPing} colorScheme="teal">
          IPC Gönder
        </Button>
      </HStack>
      
      <Box mt={8}>
        <Versions /> {/* Versions bileşeni hala ayrı bir dosya olduğunu varsayalım */}
      </Box>
    </VStack>
  );
}

// Versions bileşeninin dışarıdan import edildiğini varsayalım
// Eğer App.tsx içinde tanımlıysa, taşımana gerek yok.
function Versions() {
  const [versions, setVersions] = useState<{ [key: string]: string } | null>(null);

  useEffect(() => {
    if (window.electron && window.electron.ipcRenderer) {
      // Electron sürümlerini IPC üzerinden almak için
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
    <HStack spacing={4} fontSize="sm" color="gray.500">
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
}

export default App
