import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import designSystem from "./eslint-rules/design-system.mjs";

const DS_RULES = {
  "ds/no-raw-color": "warn",
  "ds/no-one-off-value": "warn",
  "ds/no-raw-element": "warn",
  "ds/single-h1": "warn",
  "ds/font-family": "warn",
  "ds/no-off-scale": "warn",
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { ds: designSystem },
    rules: DS_RULES,
  },
  {
    // Token sources: raw values are allowed where tokens are defined.
    files: ["src/app/case-studies/_shared/tokens.ts", "src/lib/design-tokens.generated.ts"],
    rules: { "ds/no-raw-color": "off", "ds/no-one-off-value": "off" },
  },
  {
    // Canvas drawing reads colors as plain strings, not CSS variables (decided 2026-11-26).
    files: [
      "src/components/main/HeroSection/PixelSignalField.tsx",
      "src/components/main/HeroSection/gameOfLife.ts",
      "src/components/main/FooterSection/FooterSection.tsx",
    ],
    rules: { "ds/no-raw-color": "off" },
  },
  {
    // The case-study component source wraps <img>/<a>; that is where raw elements belong.
    files: ["src/app/case-studies/_shared/components.tsx"],
    rules: { "ds/no-raw-element": "off" },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
