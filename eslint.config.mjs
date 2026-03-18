import { defineConfig } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import parser from "vue-eslint-parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";
import pluginVue from "eslint-plugin-vue";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default defineConfig([{
  extends: [
    ...compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
    ),
    pluginVue.configs["flat/recommended"]
  ],

  plugins: {
    "@typescript-eslint": typescriptEslint,
  },

  languageOptions: {
    globals: {
      ...globals.node,
    },

    parser: parser,
    ecmaVersion: 12,
    sourceType: "module",

    parserOptions: {
      parser: "@typescript-eslint/parser",
    },
  },

  rules: {
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/ban-ts-comment": "off",
    indent: ["error", 2],
    "linebreak-style": ["error", "unix"],
    "no-undef": "off",
    quotes: ["error", "double"],
    semi: ["error", "always"],
  },
}]);
