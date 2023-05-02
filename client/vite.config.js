import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Allow absolute imports for simplicity.
  resolve: {
    alias: [{ find: '@', replacement: '/src' }],
  },
  loader: { '.js': 'jsx' },

  // Proxy all api calls to the backend (assuming it's running)
  server: {
    proxy: {
      "/api": {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
