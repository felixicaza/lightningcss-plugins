import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      'packages/pxtorem'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['lcov'],
      include: ['**/src/**/*.ts'],
      exclude: ['**/node_modules/**', '**/test/**', '**/dist/**']
    }
  }
})
