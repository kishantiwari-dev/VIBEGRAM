import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    watch: {
      // Ignore OneDrive-locked files and the backend folder
      ignored: ['**/backend/**', '**/*.txt', '**/node_modules/**'],
    },
  },
});
