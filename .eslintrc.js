module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    'plugin:react/recommended',
    // 'airbnb-typescript',
    // "plugin:prettier/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    'prettier/@typescript-eslint',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'jsx-quotes': ['error', 'prefer-single'],
    'react/jsx-indent': [2, 4],
    'react/jsx-indent-props': [2, 4],
    // "prettier/prettier": "error",
    // "@typescript-eslint/explicit-function-return-type": "off",
    // "@typescript-eslint/no-unused-vars": "off"
  },
};
