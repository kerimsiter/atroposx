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
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';
// Frontend için tip tanımları - backend bağımlılıklarını kaldırdık
interface CreateBranchDto {
  companyId: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email?: string | undefined;
  latitude?: number;
  longitude?: number;
  serverIp?: string;
  serverPort?: number;
  isMainBranch?: boolean;
  openingTime?: string;
  closingTime?: string;
  workingDays?: number[];
  cashRegisterId?: string;
  posTerminalId?: string;
  active?: boolean;
}

interface UpdateBranchDto extends Partial<CreateBranchDto> {}

interface Branch {
  id: string;
  companyId: string;
  code: string;
  name: string;
  address: string;
  phone: string;
  email?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  serverIp?: string | null;
  serverPort?: number | null;
  isMainBranch: boolean;
  openingTime?: string | null;
  closingTime?: string | null;
  workingDays: number[];
  cashRegisterId?: string | null;
  posTerminalId?: string | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

interface BranchFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: Branch | null; // Düzenleme için mevcut şube verisi, yeni için null
  companyId: string | null; // Şirket ID'si zorunlu
  onSuccess: () => void; // Başarılı işlem sonrası callback
}

// Frontend için basit validasyon kuralları
const validationRules = {
  code: { required: 'Şube kodu zorunludur' },
  name: { required: 'Şube adı zorunludur' },
  address: { required: 'Adres zorunludur' },
  phone: { required: 'Telefon zorunludur' },
  email: { 
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Geçerli bir email adresi giriniz'
    }
  },
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
    mode: 'onChange',
  });

  useEffect(() => {
    if (branch) {
      // Branch nesnesindeki null değerleri undefined'a çevir
      const formData = {
        companyId: branch.companyId,
        code: branch.code,
        name: branch.name,
        address: branch.address,
        phone: branch.phone,
        email: branch.email ?? '',
        latitude: branch.latitude || undefined,
        longitude: branch.longitude || undefined,
        serverIp: branch.serverIp || '',
        serverPort: branch.serverPort || undefined,
        isMainBranch: branch.isMainBranch,
        openingTime: branch.openingTime || '',
        closingTime: branch.closingTime || '',
        workingDays: branch.workingDays,
        cashRegisterId: branch.cashRegisterId || '',
        posTerminalId: branch.posTerminalId || '',
        active: branch.active,
      };
      reset(formData);
    } else {
      reset({
        companyId,
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
        openingTime: '',
        closingTime: '',
        workingDays: [],
        cashRegisterId: '',
        posTerminalId: '',
        active: true,
      });
    }
  }, [branch, companyId, reset]);

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
                <Input {...register('code', validationRules.code)} placeholder="Örn: IST01" />
                <FormErrorMessage>{errors.code?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Şube Adı</FormLabel>
                <Input {...register('name', validationRules.name)} placeholder="Örn: İstanbul Ana Şube" />
                <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.address}>
                <FormLabel>Adres</FormLabel>
                <Textarea {...register('address', validationRules.address)} placeholder="Şube adresi" />
                <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.phone}>
                <FormLabel>Telefon</FormLabel>
                <Input {...register('phone', validationRules.phone)} placeholder="Örn: +905XXXXXXXXX" />
                <FormErrorMessage>{errors.phone?.message}</FormErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.email}>
                <FormLabel>Email</FormLabel>
                <Input type="email" {...register('email', validationRules.email)} placeholder="Örn: info@sube.com" />
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
