import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginNext from "@next/eslint-plugin-next";

import {FlatCompat} from '@eslint/eslintrc'

const eslintConfig = new FlatCompat({
  files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
  languageOptions: {globals: globals.browser},
  rules: {"@typescript-eslint/no-explicit-any": "off"},
  recommendedConfig: {
    ...pluginJs.configs.recommended,
    ...tseslint.configs.recommended,
    ...pluginReact.configs.flat.recommended,
    ...pluginNext.configs.recommended
  }
})

export default eslintConfig