import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' // or just '@vitejs/plugin-react' depending on your setup

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})