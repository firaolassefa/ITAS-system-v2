import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: false
  },
  build: {
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification
    minify: 'esbuild',
    // Split vendor chunks for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // MUI core (most used)
          'mui-core': ['@mui/material', '@emotion/react', '@emotion/styled'],
          // MUI icons (large - separate chunk)
          'mui-icons': ['@mui/icons-material'],
          // Axios
          'axios': ['axios'],
        },
      },
    },
    // Generate source maps only in dev
    sourcemap: false,
    // Target modern browsers for smaller output
    target: 'es2020',
  },
  // Optimize deps pre-bundling
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
