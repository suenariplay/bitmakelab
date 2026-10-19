import { defineConfig } from 'astro/config';

// Web estática: se compila a HTML y se sirve con nginx (ver Dockerfile).
export default defineConfig({
  output: 'static',
  compressHTML: true,
});
