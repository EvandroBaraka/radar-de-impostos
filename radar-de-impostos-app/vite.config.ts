import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Please make sure that '@tanstack/router-plugin' is passed before '@vitejs/plugin-react'
    tanstackRouter({
      target: 'react',
      // Habilita a divisão automática de código para rotas, melhorando a performance de carregamento.
      autoCodeSplitting: true,
      generatedRouteTree: './src/router-tree-gen.ts',
      routesDirectory: './src/pages',
      // Uma string especial usada para identificar rotas de layout, geralmente para layouts aninhados.
      routeToken: 'layout',
    }),  
    react(), 
    basicSsl(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

