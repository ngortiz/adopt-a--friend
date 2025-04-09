import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Esto permite usar `vi` globalmente, sin necesidad de importarlo
    environment: 'jsdom', // Esto es para simular el DOM en las pruebas
  },
});
