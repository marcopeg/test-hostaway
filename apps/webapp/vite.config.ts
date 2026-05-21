import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const rootDir = fileURLToPath(new URL('.', import.meta.url))
const packageJson = JSON.parse(
  readFileSync(resolve(rootDir, 'package.json'), 'utf-8'),
) as {
  graphql?: {
    password?: string
    headers?: Record<string, string>
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      providers: resolve(rootDir, 'src/providers'),
      components: resolve(rootDir, 'src/components'),
      hooks: resolve(rootDir, 'src/hooks'),
      lib: resolve(rootDir, 'src/lib'),
    },
  },
  define: {
    __GRAPHQL_CONFIG__: JSON.stringify({
      password: packageJson.graphql?.password ?? 'hasura',
      headers: packageJson.graphql?.headers ?? {},
    }),
  },
  server: {
    proxy: {
      '/v1/graphql': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        ws: true,
      },
    },
  },
})
