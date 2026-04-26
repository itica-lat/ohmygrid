import type React from "react";
import type { BrandTokens, BorderRadiusScale, SpacingScale } from "../types";

export function borderRadiusValue(scale: BorderRadiusScale): string {
  switch (scale) {
    case "sharp":
      return "6px";
    case "soft":
      return "16px";
    case "pill":
      return "9999px";
  }
}

export function spacingValue(scale: SpacingScale): string {
  switch (scale) {
    case "compact":
      return "0.75";
    case "default":
      return "1";
    case "relaxed":
      return "1.5";
  }
}

export function brandToCssVars(brand: BrandTokens): React.CSSProperties {
  return {
    "--color-primary": brand.colorPrimary,
    "--color-secondary": brand.colorSecondary,
    "--color-accent": brand.colorAccent,
    "--color-bg": brand.colorBackground,
    "--color-surface": brand.colorSurface,
    "--color-text": brand.colorText,
    "--font-family": brand.fontFamily,
    "--font-base-size": `${brand.fontBaseSize}px`,
    "--font-ratio": String(brand.fontRatio),
    "--radius-scale": borderRadiusValue(brand.borderRadiusScale),
    "--spacing-scale": spacingValue(brand.spacingScale),
  } as React.CSSProperties;
}

export function brandToCssString(brand: BrandTokens): string {
  return [
    `  --color-primary: ${brand.colorPrimary};`,
    `  --color-secondary: ${brand.colorSecondary};`,
    `  --color-accent: ${brand.colorAccent};`,
    `  --color-bg: ${brand.colorBackground};`,
    `  --color-surface: ${brand.colorSurface};`,
    `  --color-text: ${brand.colorText};`,
    `  --font-family: ${brand.fontFamily};`,
    `  --font-base-size: ${brand.fontBaseSize}px;`,
    `  --font-ratio: ${brand.fontRatio};`,
    `  --radius-scale: ${borderRadiusValue(brand.borderRadiusScale)};`,
    `  --spacing-scale: ${spacingValue(brand.spacingScale)};`,
  ].join("\n");
}
