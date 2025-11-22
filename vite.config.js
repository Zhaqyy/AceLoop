import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      scss: {
        // Automatically import variables and mixins in all SCSS files
        // Vite's additionalData receives (source, filename) as parameters
        additionalData: (content, filename) => {
          try {
            if (filename) {
              const srcPath = path.resolve(__dirname, './src');
              const stylesPath = path.join(srcPath, 'styles');
              const fileDir = path.dirname(filename);
              
              // Calculate relative path from current file to styles directory
              let relativePath = path.relative(fileDir, stylesPath).replace(/\\/g, '/');
              if (!relativePath.startsWith('.')) {
                relativePath = './' + relativePath;
              }
              
              return `@use "${relativePath}/_variables.scss" as *; @use "${relativePath}/_mixins.scss" as *; ${content}`;
            }
          } catch (error) {
            // Fall through to default
          }
          
          // Fallback: use a path that works from src root
          return `@use "./styles/_variables.scss" as *; @use "./styles/_mixins.scss" as *; ${content}`;
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@ui': path.resolve(__dirname, './src/components/ui'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@data': path.resolve(__dirname, './src/data'),
      '@context': path.resolve(__dirname, './src/context'),
    },
  },
})
