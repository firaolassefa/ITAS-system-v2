import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: false
  },
  build: {
    chunkSizeWarningLimit: 1000,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Core React — always needed
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router-dom/')) {
            return 'react-vendor';
          }
          // MUI Icons — split by first letter to avoid one giant chunk
          if (id.includes('@mui/icons-material')) {
            const match = id.match(/@mui\/icons-material\/(.)/);
            if (match) return `mui-icons-${match[1].toLowerCase()}`;
            return 'mui-icons-misc';
          }
          // MUI core
          if (id.includes('@mui/material') || id.includes('@emotion/react') || id.includes('@emotion/styled')) {
            return 'mui-core';
          }
          // Axios
          if (id.includes('node_modules/axios/')) {
            return 'axios';
          }
        },
      },
    },
    sourcemap: false,
    target: 'es2020',
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      'axios',
    ],
  },
})
