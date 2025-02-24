import pluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import unocss from '@unocss/eslint-config/flat';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript';
import * as pluginImportX from 'eslint-plugin-import-x';
import pluginPerfectionist from 'eslint-plugin-perfectionist';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginUnicorn from 'eslint-plugin-unicorn';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import pluginVue from 'eslint-plugin-vue';
// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  unocss,
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,tsx,vue}'],
    plugins: {
      'unused-imports': pluginUnusedImports,
      import: pluginImportX,
      perfectionist: pluginPerfectionist,
      prettier: pluginPrettier,
      unicorn: pluginUnicorn,
    },
    rules: {
      // unicorn
      ...pluginUnicorn.configs.recommended.rules,
      'unicorn/better-regex': 'off',
      'unicorn/consistent-destructuring': 'off',
      'unicorn/consistent-function-scoping': 'off',
      'unicorn/expiring-todo-comments': 'off',
      'unicorn/filename-case': 'off',
      'unicorn/import-style': 'off',
      'unicorn/no-array-for-each': 'off',
      'unicorn/no-null': 'off',
      'unicorn/no-useless-undefined': 'off',
      'unicorn/prefer-at': 'off',
      'unicorn/prefer-dom-node-text-content': 'off',
      'unicorn/prefer-export-from': ['error', { ignoreUsedVariables: true }],
      'unicorn/prefer-global-this': 'off',
      'unicorn/prefer-top-level-await': 'off',
      'unicorn/prevent-abbreviations': 'off',

      // import
      'no-unused-vars': 'off', // or "@typescript-eslint/no-unused-vars": "off",
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',
      'import/no-mutable-exports': 'error',
      'import/no-named-default': 'error',
      'import/no-self-import': 'error',
      'import/no-unresolved': 'off',
      'import/no-webpack-loader-syntax': 'error',

      // perfectionist
      'perfectionist/sort-imports': ['error', { type: 'natural', order: 'asc' }],

      // prettier
      'prettier/prettier': 'error',
    },
  },
  {
    name: 'app/files-to-ignore',
    ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**', '**/types/**'],
  },

  pluginVue.configs['flat/essential'],
  vueTsConfigs.recommended,
  skipFormatting,
  {
    files: ['**/*.?([cm])[jt]s?(x)'],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        createDefaultProgram: false,
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: 'latest',
        extraFileExtensions: ['.vue'],
        jsxPragma: 'React',
        project: './tsconfig.*.json',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': pluginTs,
    },
    rules: {
      ...pluginTs.configs['eslint-recommended'].overrides?.[0].rules,
      ...pluginTs.configs.strict.rules,
      '@typescript-eslint/ban-ts-comment': [
        'error',
        {
          'ts-check': false,
          'ts-expect-error': 'allow-with-description',
          'ts-ignore': 'allow-with-description',
          'ts-nocheck': 'allow-with-description',
        },
      ],

      // '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
      '@typescript-eslint/consistent-type-definitions': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-function': [
        'error',
        {
          allow: ['arrowFunctions', 'functions', 'methods'],
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-use-before-define': 'off',
      '@typescript-eslint/no-var-requires': 'error',
      'unused-imports/no-unused-vars': 'off',
    },
  },
);
