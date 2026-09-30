import { defineConfig } from 'vite';

// Let the map library load its helper "worker" files itself (Vite would break them).
export default defineConfig({
  optimizeDeps: { exclude: ['maplibre-gl'] },
});
