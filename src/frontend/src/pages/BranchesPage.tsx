import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Button,
  HStack,
  useDisclosure, // Modal yönetimi için
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import BranchFormModal from '../components/BranchFormModal'; // Form modal bileşeni

interface Branch {
  id: string;
  companyId: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email?: string;
  isMainBranch: boolean;
  active: boolean;
  // Diğer alanlar...
}

const BranchesPage: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.700');
  const pageBgColor = useColorModeValue('gray.50', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'whiteAlpha.900');

  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null); // Kullanıcıya ait companyId
  const { isOpen, onOpen, onClose } = useDisclosure(); // Modal durumu
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null); // Düzenlenecek şube

  // TODO: Bu companyId gerçek bir kullanıcı girişi veya seçimi ile dinamikleşmeli.
  // Şimdilik App.tsx'ten çekilen ilk şirketin ID'sini kullanabiliriz,
  // veya manuel bir test ID'si atayabiliriz.
  // İleride auth eklenince login sonrası kullanıcıdan alınacak.
  useEffect(() => {
    // App.tsx'ten gelen şirket ID'sini almayı simüle edelim
    window.api.getNestApiUrl().then(async (backendUrl) => {
      try {
        const response = await fetch(`${backendUrl}/company`);
        const companies = await response.json();
        if (companies && companies.length > 0) {
          setCompanyId(companies[0].id); // İlk bulunan şirketin ID'sini kullan
        } else {
          setError('Sistemde kayıtlı şirket bulunamadı. Lütfen önce bir şirket oluşturun.');
          setIsLoading(false);
        }
      } catch (err: any) {
        setError(`Şirket ID alınamadı: ${err.message}`);
        setIsLoading(false);
      }
    });
  }, []);


  const fetchBranches = useCallback(async () => {
    if (!companyId) return; // companyId yoksa çekme

    setIsLoading(true);
    setError(null);
    try {
      const backendUrl = await window.api.getNestApiUrl();
      const response = await fetch(`${backendUrl}/branches?companyId=${companyId}`);
      if (!response.ok) {
        throw new Error(`HTTP hatası! Durum: ${response.status}`);
      }
      const data = await response.json();
      setBranches(data);
    } catch (err: any) {
      setError(`Şubeler çekilirken hata oluştu: ${err.message}`);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [companyId]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const handleCreateBranch = () => {
    setSelectedBranch(null); // Yeni oluşturma modu
    onOpen();
  };

  const handleEditBranch = (branch: Branch) => {
    setSelectedBranch(branch); // Düzenleme modu
    onOpen();
  };

  const handleDeleteBranch = async (id: string) => {
    if (!window.confirm('Bu şubeyi silmek istediğinizden emin misiniz?')) {
      return;
    }
    setIsLoading(true); // Yükleme durumuna geç
    try {
      const backendUrl = await window.api.getNestApiUrl();
      const response = await fetch(`${backendUrl}/branches/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Silme hatası! Durum: ${response.status}`);
      }
      // Başarılı olursa listeyi yenile
      await fetchBranches();
    } catch (err: any) {
      setError(`Şube silinirken hata oluştu: ${err.message}`);
      console.error(err);
      setIsLoading(false); // Hata durumunda yüklemeyi kapat
    }
  };

  const handleFormSubmitSuccess = () => {
    onClose(); // Modalı kapat
    fetchBranches(); // Listeyi yenile
  };

  return (
    <VStack p={6} align="flex-start" bg={pageBgColor} minH="calc(100vh - 68px)">
      <Box
        p={5}
        shadow="md"
        borderWidth="1px"
        borderRadius="lg"
        bg={bgColor}
        color={textColor}
        width="100%"
      >
        <HStack justifyContent="space-between" mb={4}>
          <Heading size="lg">Şubeler Yönetimi</Heading>
          <Button leftIcon={<AddIcon />} colorScheme="atropos" onClick={handleCreateBranch}>
            Yeni Şube Ekle
          </Button>
        </HStack>

        {error && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            <AlertTitle mr={2}>Hata!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <VStack w="100%" py={10}>
            <Spinner size="xl" color="atropos.500" />
            <Text mt={4}>Şubeler yükleniyor...</Text>
          </VStack>
        ) : branches.length === 0 && !error ? (
          <Text py={10} textAlign="center" w="100%">
            Kayıtlı şube bulunamadı. Yeni bir şube eklemek için yukarıdaki "Yeni Şube Ekle" butonunu kullanın.
          </Text>
        ) : (
          <TableContainer width="100%">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Kod</Th>
                  <Th>Adı</Th>
                  <Th>Adres</Th>
                  <Th>Telefon</Th>
                  <Th>Aktif</Th>
                  <Th isNumeric>İşlemler</Th>
                </Tr>
              </Thead>
              <Tbody>
                {branches.map((branch) => (
                  <Tr key={branch.id}>
                    <Td>{branch.code}</Td>
                    <Td>{branch.name}</Td>
                    <Td>{branch.address}</Td>
                    <Td>{branch.phone}</Td>
                    <Td>{branch.active ? 'Evet' : 'Hayır'}</Td>
                    <Td isNumeric>
                      <HStack spacing={2} justifyContent="flex-end">
                        <Button
                          size="sm"
                          leftIcon={<EditIcon />}
                          onClick={() => handleEditBranch(branch)}
                          colorScheme="blue"
                        >
                          Düzenle
                        </Button>
                        <Button
                          size="sm"
                          leftIcon={<DeleteIcon />}
                          onClick={() => handleDeleteBranch(branch.id)}
                          colorScheme="red"
                        >
                          Sil
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <BranchFormModal
        isOpen={isOpen}
        onClose={onClose}
        branch={selectedBranch}
        companyId={companyId}
        onSuccess={handleFormSubmitSuccess}
      />
    </VStack>
  );
};

export default BranchesPage;
