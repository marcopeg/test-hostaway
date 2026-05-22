import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    include: ['api/**/*.test.ts'],
    pool: 'forks',
    fileParallelism: false,
    hookTimeout: 120000,
  },
})
