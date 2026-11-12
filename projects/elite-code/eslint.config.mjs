import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Third-party component, kept as published so upstream fixes can be diffed in.
    // Its animation engine deliberately drives the DOM from refs inside requestAnimationFrame,
    // which the React Compiler lint rules reject, and it needs plain <img> elements because
    // the same picture doubles as a CSS mask.
    files: ["components/ui/sushi-conveyor-menu.tsx"],
    rules: {
      "react-hooks/refs": "off",
      "react-hooks/immutability": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/exhaustive-deps": "off",
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Node scripts that regenerate the artwork (CommonJS, run by hand).
    "scripts/**",
  ]),
]);

export default eslintConfig;
