import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    host: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        forms: resolve(__dirname, 'forms.html'),
        nl_index: resolve(__dirname, 'nl/index.html'),
        nl_lezer: resolve(__dirname, 'nl/lezer.html'),
        nl_handleiding: resolve(__dirname, 'nl/handleiding.html'),
        nl_contact: resolve(__dirname, 'nl/contact.html'),
        nl_privacy: resolve(__dirname, 'nl/privacy.html'),
        nl_bedankt: resolve(__dirname, 'nl/bedankt.html'),
        en_index: resolve(__dirname, 'en/index.html'),
        en_reader: resolve(__dirname, 'en/reader.html'),
        en_handbook: resolve(__dirname, 'en/handbook.html'),
        en_contact: resolve(__dirname, 'en/contact.html'),
        en_privacy: resolve(__dirname, 'en/privacy.html'),
        en_thanks: resolve(__dirname, 'en/thanks.html')
      }
    }
  }
});
