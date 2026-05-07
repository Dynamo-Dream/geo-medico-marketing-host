import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'https://geomedico.in',
      '/uploads': 'https://geomedico.in',
    },
  },
})
//34.93.234.135

