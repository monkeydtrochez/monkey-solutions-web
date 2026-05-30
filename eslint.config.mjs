import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import nextPlugin from "@next/eslint-plugin-next";

const eslintConfig = [
  // TypeScript rules (equivalent to next/typescript)
  ...tseslint.configs.recommended,

  // React hooks rules (flat config)
  reactHooks.configs.flat.recommended,

  // React rules (flat config) — recommended + jsx-runtime for React 17+ new JSX transform
  {
    ...reactPlugin.configs.flat.recommended,
    settings: { react: { version: "19" } },
  },
  reactPlugin.configs.flat["jsx-runtime"],

  // Next.js core-web-vitals rules
  {
    name: "next/core-web-vitals",
    plugins: {
      "@next/next": nextPlugin,
    },
    rules: {
      ...nextPlugin.configs["core-web-vitals"].rules,
    },
  },

  // Global ignores
  {
    ignores: [".next/**", "out/**", "build/**", "next-env.d.ts", "sanity/**"],
  },
];

export default eslintConfig;
