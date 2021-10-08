module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    mocha: true,
    node: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    eqeqeq: "warn",
    semi: ["error", "always"],
    "prefer-const": "error",
  },
};
