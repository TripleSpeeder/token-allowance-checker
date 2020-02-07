module.exports = {
    parser: "@typescript-eslint/parser", // Specifies the ESLint parser
    plugins: ["@typescript-eslint"],
    extends: [
        "plugin:react/recommended", // Uses the recommended rules from @eslint-plugin-react
        "plugin:@typescript-eslint/recommended" // Uses the recommended rules from @typescript-eslint/eslint-plugin
    ],
    parserOptions: {
        ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
        sourceType: "module", // Allows for the use of imports
        ecmaFeatures: {
            jsx: true // Allows for the parsing of JSX
        }
    },
    rules: {
        // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
        // e.g. "@typescript-eslint/explicit-function-return-type": "off",
        "quotes": ["error", "single", { "allowTemplateLiterals": true }],
        // "semi": ["error", "never"],
        "semi": ["off"], // turn off in favor of typescript-specific semi rule
        "@typescript-eslint/semi": ["error", "never"],
        "eqeqeq": "error",
        "no-multi-spaces": "error",
        "quote-props": [ "error", "consistent" ]
    },
    settings: {
        react: {
            version: "detect" // Tells eslint-plugin-react to automatically detect the version of React to use
        }
    }
};