// eslint.config.js
import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import next from 'eslint-config-next'

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  ...next(),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      semi: ['error', 'never'],
    },
  },
]
