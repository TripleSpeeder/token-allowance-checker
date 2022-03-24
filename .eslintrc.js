module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:react/recommended',
    "plugin:@typescript-eslint/eslint-recommended",
    'prettier',
  ],
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  settings: {
    "react": {
      "version": "detect"
    }
  },
};
