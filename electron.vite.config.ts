import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react'; // React için eklenti

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/main/index.ts'), // Electron Main process path
        },
      },
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/preload/index.ts'), // Electron Preload script path
        },
      },
    },
  },
  renderer: {
    root: 'src/frontend', // Frontend (React) projesinin kök dizini
    plugins: [react()], // React eklentisini kullan
    resolve: {
      alias: {
        '@renderer': resolve('src/frontend/src')
      }
    },
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/frontend/index.html'), // Frontend index.html yolu
        },
      },
    },
    server: {
      watch: {
        usePolling: true, // Vite hot reload sorunları için ekle
      },
    },
  },
});
