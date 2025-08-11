import { extendTheme, type ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools'; // mode fonksiyonunu kullanmak için eklendi

const config: ThemeConfig = {
  initialColorMode: 'system',
  useSystemColorMode: true,
};

const theme = extendTheme({
  config,
  colors: {
    // Chakra UI'ın varsayılan renklerini kullanabiliriz
    // veya kendi kurumsal paletimizi daha minimalist tanımlayabiliriz.
    // Şimdilik varsayılan gri tonları ve teal/purple gibi vurguları kullanacağız.
    // Daha sonra markana özel renkleri buraya daha dikkatli yerleştirebiliriz.
    atropos: { // Özel Atropos vurgu renkleri
      50: '#E0F2F7', // Çok açık mavi-yeşil
      100: '#B2EBF2',
      200: '#80DEEA',
      300: '#4DD0E1',
      400: '#26C6DA',
      500: '#00BCD4', // Ana vurgu rengi (turkuaz benzeri)
      600: '#00ACC1',
      700: '#0097A7',
      800: '#00838F',
      900: '#006064', // Koyu turkuaz
    },
    // Menü ikon renkleri için bazı tanımlamalar yapalım
    menuIcons: {
      sales: '#E53E3E',       // Kırmızımsı
      cashRegister: '#3182CE',  // Mavimsi
      products: '#38A169',    // Yeşilsi
      stocks: '#D69E2E',      // Turuncumsu
      customers: '#805AD5',   // Morumsu
      reports: '#319795',     // Turkuaz (atropos ile aynı olabilir)
      branches: '#C05621',    // Kahverengimsi
      settings: '#4A5568',    // Krivazı gri
    }
  },
  fonts: {
    body: `'Inter', sans-serif`, // Daha modern bir font (Google Fonts'tan import etmemiz gerekebilir)
    heading: `'Inter', sans-serif`,
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold', // Daha az kalın
        borderRadius: 'md',
      },
      variants: {
        solid: (props: any) => ({
          bg: mode('atropos.500', 'atropos.400')(props), // Tema geçişine duyarlı
          color: 'white',
          _hover: {
            bg: mode('atropos.600', 'atropos.500')(props),
          },
        }),
        outline: (props: any) => ({
          borderColor: mode('gray.300', 'gray.600')(props),
          color: mode('gray.800', 'whiteAlpha.800')(props),
          _hover: {
            bg: mode('gray.100', 'gray.700')(props),
          },
        }),
      },
    },
    // Card benzeri kutular için genel stil
    Card: { // Özel bir bileşen olarak kullanacağız
      baseStyle: (props: any) => ({
        p: 6,
        borderRadius: 'lg',
        shadow: mode('sm', 'dark-lg')(props), // Daha zarif gölgeler
        bg: mode('white', 'gray.700')(props),
        transition: 'all 0.2s ease-in-out',
        _hover: {
          transform: 'translateY(-3px)',
          shadow: mode('md', 'dark-xl')(props),
        },
      }),
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        fontFamily: 'body',
        color: mode('gray.800', 'whiteAlpha.900')(props),
        bg: mode('gray.50', 'gray.800')(props), // Arka plan için daha açık gri veya koyu gri
        lineHeight: 'base',
      },
      // Kaydırma çubuğunu gizleyip stil vermek için (isteğe bağlı)
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: mode('gray.100', 'gray.700')(props),
      },
      '::-webkit-scrollbar-thumb': {
        background: mode('gray.300', 'gray.600')(props),
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: mode('gray.400', 'gray.500')(props),
      },
    }),
  },
});

export default theme;
