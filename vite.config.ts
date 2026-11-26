/// <reference lib="dom" />
import { defineConfig, loadEnv, type Alias } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const sentryAuthToken = process.env.SENTRY_AUTH_TOKEN
const sentryOrg = process.env.SENTRY_ORG ?? 'oacore'
const sentryProject = process.env.SENTRY_PROJECT ?? 'dashboard-pk'

const localCoreUiAliases = (coreUiPath: string | undefined): Alias[] => {
  if (!coreUiPath) return []

  const root = path.resolve(__dirname, coreUiPath)
  console.info(`[vite] @oacore/core-ui -> local source at ${root}`)

  return [
    { find: /^@oacore\/core-ui\/styles$/, replacement: path.join(root, 'src/index.css') },
    { find: /^@oacore\/core-ui$/, replacement: path.join(root, 'src/index.ts') },
  ]
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, __dirname, '')
  const coreUiPath = process.env.CORE_UI_PATH ?? env.CORE_UI_PATH

  return {
    plugins: [
      react(),
      ...(sentryAuthToken
        ? sentryVitePlugin({
          org: sentryOrg,
          project: sentryProject,
          authToken: sentryAuthToken,
        })
        : []),
    ],
    build: {
      sourcemap: true,
      emptyOutDir: true,
    },
    server: coreUiPath
      ? {
        // core-ui source lives outside this project
        fs: { allow: [__dirname, path.resolve(__dirname, coreUiPath)] },
      }
      : undefined,
    resolve: {
      alias: [
        ...localCoreUiAliases(coreUiPath),
        { find: '@', replacement: path.resolve(__dirname, './src') },
        { find: '@components', replacement: path.resolve(__dirname, './src/components') },
        { find: '@features', replacement: path.resolve(__dirname, './src/features') },
        { find: '@hooks', replacement: path.resolve(__dirname, './src/hooks') },
        { find: '@services', replacement: path.resolve(__dirname, './src/services') },
        { find: '@stores', replacement: path.resolve(__dirname, './src/stores') },
        { find: '@styles', replacement: path.resolve(__dirname, './src/styles') },
        { find: '@types', replacement: path.resolve(__dirname, './src/types') },
        { find: '@utils', replacement: path.resolve(__dirname, './src/utils') },
        { find: '@config', replacement: path.resolve(__dirname, './src/config') },
        { find: '@routes', replacement: path.resolve(__dirname, './src/routes') },
        { find: 'react', replacement: path.resolve(__dirname, './node_modules/react') },
        { find: 'react-dom', replacement: path.resolve(__dirname, './node_modules/react-dom') },
      ],
      // Local core-ui source must share this app's React and antd (one theme/context)
      dedupe: ['react', 'react-dom', 'antd', '@ant-design/icons'],
    },
  }
})
