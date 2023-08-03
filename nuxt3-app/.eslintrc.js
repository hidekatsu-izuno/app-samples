module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "@nuxtjs/eslint-config-typescript",
  ],
  rules: {
    quotes: ["error", "double", { avoidEscape: true }],
    "comma-dangle": ["error", "always-multiline"],
    "no-console": "off",
    "func-call-spacing": "off",
    "space-before-function-paren": ["error", { named: "never" }],
    "import/no-named-default": "off",
    "vue/require-default-prop": "off",
    "vue/singleline-html-element-content-newline": "off",
    "vue/multiline-html-element-content-newline": "off",
    "@typescript-eslint/func-call-spacing": "error",
    "@typescript-eslint/no-unused-vars": ["error", { args: "none" }],
  },
}
