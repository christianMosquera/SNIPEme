// module.exports = {
//   root: true,
//   env: {
//     node: true,
//     es6: true,
//     jest: true,
//   },
//   extends: [
//     'eslint:recommended',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:react/recommended',
//     'plugin:react-native/all',
//     'prettier',
//   ],
//   settings: {
//     react: {
//       version: 'detect',
//     },
//   },
//   parser: '@typescript-eslint/parser',
//   parserOptions: {
//     ecmaVersion: 2021,
//     sourceType: 'module',
//     ecmaFeatures: {
//       jsx: true,
//     },
//   },
//   plugins: ['@typescript-eslint', 'react', 'react-native'],
//   rules: {
//     // Add specific ESLint rules here if needed
//   },
// };

module.exports = {
  root: true,
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-native/all',
    'prettier',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'react', 'react-native', 'react-hooks'], // Added 'react-hooks' here
  rules: {
    // Existing rules
    'react-hooks/rules-of-hooks': 'error', // Adds the rule to check the Rules of Hooks
    'react-hooks/exhaustive-deps': 'warn', // Adds the rule to check the dependencies of effects
  },
};
