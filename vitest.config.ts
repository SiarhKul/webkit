import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    exclude: ['node_modules/', '**/*.config.ts', '**/*.d.ts'],
    projects: [
      {
        test: {
          name: { label: 'unit', color: 'green' },
          include: ['**/*.unit.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        },
      },
      {
        test: {
          name: { label: 'e2e', color: 'yellow' },
          include: ['**/*.e2e.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
          setupFiles: ['./src/integrations/testcontainer-setup.ts'],
        },
      },
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
