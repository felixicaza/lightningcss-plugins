import type { Linter } from 'eslint'

import { defineConfig, globalIgnores } from 'eslint/config'

import globals from 'globals'
import eslintPluginJs from '@eslint/js'
import eslintPluginYml from 'eslint-plugin-yml'
import eslintPluginJsonc from 'eslint-plugin-jsonc'
import eslintPluginPackageJson from 'eslint-plugin-package-json'
import neostandard, { plugins as eslintPlugins, resolveIgnoresFromGitignore } from 'neostandard'

export default defineConfig([
  globalIgnores(resolveIgnoresFromGitignore()),
  { languageOptions: { globals: { ...globals.node } } },
  eslintPluginJs.configs.recommended,
  neostandard({
    noJsx: true,
    ts: true
  }),
  eslintPlugins.promise.configs['flat/recommended'],
  eslintPlugins['@stylistic'].configs['recommended-flat'],
  eslintPlugins.n.configs['flat/recommended'],
  eslintPluginJsonc.configs['flat/recommended-with-json'],
  eslintPluginPackageJson.configs.recommended,
  eslintPluginYml.configs['flat/recommended'],
  {
    rules: {
      '@stylistic/brace-style': ['error', '1tbs', { allowSingleLine: true }],
      '@stylistic/no-multi-spaces': ['error', { ignoreEOLComments: false }],
      '@stylistic/arrow-parens': ['error', 'always'],
      '@stylistic/quote-props': ['error', 'as-needed'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/operator-linebreak': [
        'error',
        'after',
        { overrides: { '?': 'before', ':': 'before' } }
      ],

      // Disabled due this rule not support workspaces
      // reference: https://github.com/eslint-community/eslint-plugin-n/issues/209
      'n/no-extraneous-import': ['off'],
      'n/no-missing-import': ['off'],

      'yml/indent': ['error', 3, { indicatorValueIndent: 2 }],
      'yml/quotes': ['error', { prefer: 'double' }]
    }
  }
]) as Linter.Config[]
