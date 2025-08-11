Harika! Görev 6'yı başarıyla tamamladın ve `Branch` modülü backend'de tam fonksiyonel hale geldi. `PrismaService` bağımlılık sorununu çözmen ve global bir `PrismaModule` oluşturman da takdire şayan bir mimari iyileştirme oldu.

Şimdi sıra, backend'de hazır olan bu `Branch` modülünü frontend'e taşımaya ve kullanıcıların şube verilerini yönetebileceği modern bir arayüz oluşturmaya geldi.

---

### Görev 7: Frontend `BranchesPage`'i Geliştirme (Şube Yönetimi Arayüzü)

Bu görevde, NestJS backend'indeki `Branch` API'larını kullanarak `BranchesPage`'i gerçek veriyle dolduracağız. Kullanıcıların şubeleri listeleyebileceği, yeni şube ekleyebileceği, mevcut şubeleri düzenleyebileceği ve silebileceği işlevselliği ekleyeceğiz.

**Önkoşullar:**

*   `React Hook Form` ve `Zod` (veya `yup`, `class-validator`) ile form validasyonu yapacağız. `class-validator` zaten backend'de kullanıldığı için frontend'de de `class-validator` ve `class-transformer`'ı kullanmak mantıklı.

    ```cmd
    cd src\frontend
    pnpm add react-hook-form @hookform/resolvers class-validator class-transformer
    ```

**Adım 7.1: `BranchesPage`'de Şube Listesini Görüntüleme**

`BranchesPage.tsx`'i güncelleyerek şubeleri API'dan çekip bir tabloda görüntüleyelim.

**`atropos/src/frontend/src/pages/BranchesPage.tsx` (Güncellenmiş):**
```typescript
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
```

**Adım 7.2: Yeni Şube Ekleme/Düzenleme Formu için Modal Bileşeni (`BranchFormModal.tsx`)**

Bu modal, hem yeni şube ekleme hem de mevcut şubeyi düzenleme için kullanılacak formu içerecek. `React Hook Form` ve `class-validator` kullanarak validasyonları yöneteceğiz.

**`atropos/src/frontend/src/components/BranchFormModal.tsx`:**
```typescript
import React, { useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  useToast, // Bildirimler için
  Select,
  FormErrorMessage, // Validasyon hataları için
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateBranchDto } from '../../../../backend/src/branch/dto/create-branch.dto'; // Backend DTO'sunu kullanıyoruz
import { UpdateBranchDto } from '../../../../backend/src/branch/dto/update-branch.dto'; // Backend DTO'sunu kullanıyoruz
import { Branch } from '@prisma/client'; // Prisma Client tipini kullanıyoruz

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null; // Düzenleme için mevcut şube verisi, yeni için null
  companyId: string | null; // Şirket ID'si zorunlu
  onSuccess: () => void; // Başarılı işlem sonrası callback
}

// React Hook Form için custom resolver
const classValidatorResolver = <T extends object>(classType: ClassConstructor<T>) => {
  return async (values: T) => {
    const errors = await validate(plainToInstance(classType, values));
    if (errors.length === 0) {
      return { values, errors: {} };
    }
    const formattedErrors = errors.reduce((acc, error) => {
      Object.keys(error.constraints || {}).forEach((key) => {
        // Her alan için ilk hatayı göster
        if (!acc[error.property]) {
          acc[error.property] = { type: key, message: error.constraints![key] };
        }
      });
      return acc;
    }, {});
    return { values: {}, errors: formattedErrors };
  };
};

const BranchFormModal: React.FC<BranchFormModalProps> = ({ isOpen, onClose, branch, companyId, onSuccess }) => {
  const toast = useToast();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
    control, // Controller bileşeni için
  } = useForm<CreateBranchDto>({
    resolver: classValidatorResolver(branch ? UpdateBranchDto : CreateBranchDto),
  });

  useEffect(() => {
    // Modal açıldığında veya branch değiştiğinde formu resetle
    if (isOpen) {
      if (branch) {
        reset({ // Mevcut şube verileriyle doldur
          ...branch,
          latitude: branch.latitude || undefined,
          longitude: branch.longitude || undefined,
          serverPort: branch.serverPort || undefined,
          workingDays: branch.workingDays || [],
          // Diğer boolean ve sayısal alanları da uygun şekilde cast et
          isMainBranch: branch.isMainBranch,
          active: branch.active,
        });
      } else {
        reset({ // Yeni şube için varsayılan değerler veya boş
          companyId: companyId || '', // Eğer varsa companyId'yi otomatik doldur
          code: '',
          name: '',
          address: '',
          phone: '',
          email: '',
          latitude: undefined,
          longitude: undefined,
          serverIp: '',
          serverPort: undefined,
          isMainBranch: false,
          openingTime: '09:00',
          closingTime: '18:00',
          workingDays: [1,2,3,4,5], // Pazartesi-Cuma varsayılan
          cashRegisterId: '',
          posTerminalId: '',
          active: true,
        });
      }
    }
  }, [isOpen, branch, reset, companyId]);

  const onSubmit = async (values: CreateBranchDto | UpdateBranchDto) => {
    if (!companyId && !branch?.companyId) {
        toast({
            title: 'Hata',
            description: 'Şirket ID bulunamadı. Şube eklemek için önce bir şirket olmalı.',
            status: 'error',
            duration: 5000,
            isClosable: true,
        });
        return;
    }

    const payload = branch ? values : { ...values, companyId: companyId! }; // Yeni ise companyId ekle
    const method = branch ? 'PATCH' : 'POST';
    const url = branch
      ? `${await window.api.getNestApiUrl()}/branches/${branch.id}`
      : `${await window.api.getNestApiUrl()}/branches`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Bir hata oluştu.');
      }

      toast({
        title: branch ? 'Şube Güncellendi' : 'Şube Eklendi',
        description: branch ? 'Şube başarıyla güncellendi.' : 'Yeni şube başarıyla eklendi.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onSuccess(); // Başarılı işlem sonrası listeyi yenile
    } catch (err: any) {
      toast({
        title: 'İşlem Başarısız',
        description: err.message || 'Şube işlemi sırasında bir hata oluştu.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('API Error:', err);
    }
  };

  const weekdays = [
    { value: 1, label: 'Pazartesi' },
    { value: 2, label: 'Salı' },
    { value: 3, label: 'Çarşamba' },
    { value: 4, label: 'Perşembe' },
    { value: 5, label: 'Cuma' },
    { value: 6, label: 'Cumartesi' },
    { value: 7, label: 'Pazar' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{branch ? 'Şube Düzenle' : 'Yeni Şube Ekle'}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.code}>
                <FormLabel>Şube Kodu</FormLabel>
                <Input {...register('code', { required: true })} placeholder="Örn: IST01" />
                <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Şube Adı</FormLabel>
                <Input {...register('name', { required: true })} placeholder="Örn: İstanbul Ana Şube" />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.address}>
                <FormLabel>Adres</FormLabel>
                <Textarea {...register('address', { required: true })} placeholder="Şube adresi" />
                <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>Telefon</FormLabel>
                <Input {...register('phone', { required: true })} placeholder="Örn: +905XXXXXXXXX" />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register('email')} placeholder="Örn: info@sube.com" />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4} width="100%">
                <FormControl flex={1} isInvalid={!!errors.latitude}>
                  <FormLabel>Enlem (Latitude)</FormLabel>
                  <Controller
                    name="latitude"
                    control={control}
                    render={({ field }) => (
                      <NumberInput {...field} allowMouseWheel>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  <FormErrorMessage>{errors.latitude?.message}</FormErrorMessage>
                </FormControl>

                <FormControl flex={1} isInvalid={!!errors.longitude}>
                  <FormLabel>Boylam (Longitude)</FormLabel>
                  <Controller
                    name="longitude"
                    control={control}
                    render={({ field }) => (
                      <NumberInput {...field} allowMouseWheel>
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  />
                  <FormErrorMessage>{errors.longitude?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <HStack spacing={4} width="100%">
                <FormControl flex={1} isInvalid={!!errors.openingTime}>
                  <FormLabel>Açılış Saati</FormLabel>
                  <Input type="time" {...register('openingTime')} />
                  <FormErrorMessage>{errors.openingTime?.message}</FormErrorMessage>
                </FormControl>
                <FormControl flex={1} isInvalid={!!errors.closingTime}>
                  <FormLabel>Kapanış Saati</FormLabel>
                  <Input type="time" {...register('closingTime')} />
                  <FormErrorMessage>{errors.closingTime?.message}</FormErrorMessage>
                </FormControl>
              </HStack>

              <FormControl isInvalid={!!errors.workingDays}>
                <FormLabel>Çalışma Günleri</FormLabel>
                <Controller
                  name="workingDays"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      isMulti // Çoklu seçim
                      value={field.value?.map(String) || []} // Select value string bekler
                      onChange={(e) => field.onChange(Array.from(e.target.selectedOptions, option => Number(option.value)))}
                    >
                      {weekdays.map(day => (
                        <option key={day.value} value={day.value}>
                          {day.label}
                        </option>
                      ))}
                    </Select>
                  )}
                />
                <FormErrorMessage>{errors.workingDays?.message}</FormErrorMessage>
              </FormControl>

              <HStack spacing={4} width="100%">
                <FormControl flex={1} display="flex" alignItems="center">
                  <FormLabel mb="0">Ana Şube mi?</FormLabel>
                  <Switch {...register('isMainBranch')} size="lg" />
                </FormControl>
                <FormControl flex={1} display="flex" alignItems="center">
                  <FormLabel mb="0">Aktif mi?</FormLabel>
                  <Switch {...register('active')} size="lg" />
                </FormControl>
              </HStack>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              İptal
            </Button>
            <Button colorScheme="atropos" type="submit" isLoading={isSubmitting}>
              {branch ? 'Güncelle' : 'Kaydet'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default BranchFormModal;
```

**Adım 7.3: Frontend DTO'ları için Senkronizasyon (Opsiyonel ama İyi Uygulama)**

Backend'deki DTO'ları doğrudan frontend'de kullanabilmek için yollarını belirttik (`../../../backend/src/branch/dto/create-branch.dto`). Bu, kod tekrarını önler ve tip güvenliğini artırır. Ancak, frontend'in backend'in `src` dizinine doğrudan bağımlı olması ideal değildir. Gelecekte, backend DTO'larını ayrı bir paylaşılan paket olarak yayınlamak veya her iki tarafın da kullanabileceği merkezi bir DTO/şema tanımı yaklaşımı (örn. monorepo içinde) düşünülmelidir. Şimdilik bu şekilde devam edebiliriz.

**Test Etme Adımları:**

1.  `atropos/backend` dizininde `pnpm run build` komutunu çalıştır (eğer backend'de değişiklik yaptıysan).
2.  Ana `atropos` dizininde `pnpm dev` komutunu çalıştır.

Uygulama açıldığında:
*   Dashboard'dan "Şubeler" kartına tıkla.
*   `BranchesPage`'in yüklendiğini ve eğer varsa şirket ID'sine göre şubeleri listelediğini görmelisin.
*   "Yeni Şube Ekle" butonuna tıkla. Bir modal açılmalı ve form görünmeli. Formu doldurup kaydetmeyi dene. Validasyon hatalarını kontrol et.
*   Mevcut bir şubeyi düzenlemek için "Düzenle" butonuna tıkla, formun şube verileriyle dolduğunu gör ve değişiklik yapmayı dene.
*   Bir şubeyi silmek için "Sil" butonuna tıkla ve onay mekanizmasını gör.

Bu adımlar tamamlandığında bana haber ver. `BranchesPage` artık tam CRUD işlevselliğine sahip olacak ve uygulamanızın ilk gerçek veri yönetim ekranı tamamlanmış olacak!