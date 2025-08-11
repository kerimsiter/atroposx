import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// 2. Renk modu yapılandırmasını ekle
const config: ThemeConfig = {
  initialColorMode: 'system', // Uygulama ilk açıldığında sistemin renk modunu kullan
  useSystemColorMode: true, // Sistem renk modu değiştiğinde otomatik olarak değiş
};

// 3. Temayı genişlet
const theme = extendTheme({
  config,
  // Burada diğer özel renklerini, fontlarını, bileşen stillerini vb. ekleyebilirsin
  colors: {
    brand: {
      900: '#1a365d',
      800: '#153e75',
      700: '#2a69ac',
    },
    atropos: { // Kendi özel renk paletin
      50: '#E6FFFA',
      100: '#B2F5EA',
      200: '#81E6D9',
      300: '#4FD1C5',
      400: '#38B2AC',
      500: '#319795', // Ana rengin olabilir
      600: '#2C7A7B',
      700: '#285E61',
      800: '#234E52',
      900: '#1D4044',
    }
  },
  components: {
    // Örnek: Button'ın varsayılan stilini değiştirebilirsin
    Button: {
      baseStyle: {
        fontWeight: 'bold',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorMode === 'dark' ? 'atropos.300' : 'atropos.500',
          color: 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'atropos.200' : 'atropos.600',
          },
        }),
      },
    },
  },
  // Global stilleri tanımlayabilirsin
  styles: {
    global: (props: any) => ({
      body: {
        fontFamily: 'body',
        color: props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        lineHeight: 'base',
      },
      // Diğer global stiller...
    }),
  },
});

export default theme;
