import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        // Change back to 5173 for local Windows development
        port: 5173, 
        host: true, // Allows access via localhost and your network IP
        watch: {
          // Turn polling off for local Windows; it’s faster and more reliable
          usePolling: false, 
        },
      },
      plugins: [react()],
      define: {
        'process.env': {}, 
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || '')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './'),
        }
      }
    };
});