import { defineConfig } from 'eslint/config'
import tseslint from 'typescript-eslint' // Правильный импорт

export default defineConfig([
  ...tseslint.configs.recommendedTypeChecked,

  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'error', // Уже включено, но так можно настроить
    },
  },
])
