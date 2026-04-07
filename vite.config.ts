import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    {
      name: 'copy-static-config',
      writeBundle() {
        const source = path.join(__dirname, 'staticwebapp.config.json')
        const dest = path.join(__dirname, 'dist', 'staticwebapp.config.json')
        if (fs.existsSync(source)) {
          fs.copyFileSync(source, dest)
          console.log('✓ staticwebapp.config.json copied to dist/')
        }
      }
    }
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': '/src',
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5090',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.indexOf('node_modules') === -1) {
            return;
          }

          if (id.indexOf('react-router') !== -1) {
            return 'router';
          }

          if (id.indexOf('recharts') !== -1) {
            return 'charts';
          }

          if (id.indexOf('motion') !== -1) {
            return 'motion';
          }

          if (id.indexOf('leaflet') !== -1 || id.indexOf('react-leaflet') !== -1) {
            return 'maps';
          }

          return 'vendor';
        },
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
