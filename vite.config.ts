/// <reference lib="dom" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const resolvePath = (path: string) => new URL(path, import.meta.url).pathname

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@core/core-ui/styles': resolvePath('./src/core-ui/styles.ts'),
      '@core/core-ui': resolvePath('./src/core-ui/index.ts'),
      '@': resolvePath('./src'),
      '@components': resolvePath('./src/components'),
      '@features': resolvePath('./src/features'),
      '@hooks': resolvePath('./src/hooks'),
      '@services': resolvePath('./src/services'),
      '@stores': resolvePath('./src/stores'),
      '@styles': resolvePath('./src/styles'),
      '@types': resolvePath('./src/types'),
      '@utils': resolvePath('./src/utils'),
      '@config': resolvePath('./src/config'),
      '@routes': resolvePath('./src/routes'),
      'react': resolvePath('./node_modules/react'),
      'react-dom': resolvePath('./node_modules/react-dom')
    }
  }
})
