import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import prettierPlugin from "eslint-plugin-prettier";
import nextPlugin from "@next/eslint-plugin-next";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript", "prettier"),
  {
    plugins: {
      prettier: prettierPlugin,
      next: nextPlugin,
      "simple-import-sort": simpleImportSortPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "react/react-in-jsx-scope": "off",
      "simple-import-sort/imports": "warn",
      "simple-import-sort/exports": "warn",
    },
  },
];

export default eslintConfig;
