import formsPlugin from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "secondary-container": "#86f2e4",
        "on-tertiary-fixed": "#351000",
        "on-surface-variant": "#464555",
        "on-secondary-fixed": "#00201d",
        "surface-container-high": "#e6e8ea",
        "on-primary": "#ffffff",
        "tertiary-fixed": "#ffdbcc",
        "surface-container-low": "#f2f4f6",
        "inverse-on-surface": "#eff1f3",
        "inverse-surface": "#2d3133",
        "on-primary-container": "#dad7ff",
        "surface": "#f7f9fb",
        "surface-container-highest": "#e0e3e5",
        "surface-dim": "#d8dadc",
        "secondary": "#006a61",
        "surface-container-lowest": "#ffffff",
        "primary-fixed-dim": "#c3c0ff",
        "primary": "#3525cd",
        "on-error-container": "#93000a",
        "on-primary-fixed-variant": "#3323cc",
        "tertiary": "#7e3000",
        "error-container": "#ffdad6",
        "surface-bright": "#f7f9fb",
        "on-error": "#ffffff",
        "on-secondary-container": "#006f66",
        "secondary-fixed": "#89f5e7",
        "on-primary-fixed": "#0f0069",
        "surface-container": "#eceef0",
        "primary-container": "#4f46e5",
        "on-secondary-fixed-variant": "#005049",
        "on-background": "#191c1e",
        "tertiary-container": "#a44100",
        "on-tertiary-container": "#ffd2be",
        "on-secondary": "#ffffff",
        "primary-fixed": "#e2dfff",
        "secondary-fixed-dim": "#6bd8cb",
        "background": "#f7f9fb",
        "on-tertiary-fixed-variant": "#7b2f00",
        "error": "#ba1a1a",
        "tertiary-fixed-dim": "#ffb695",
        "on-surface": "#191c1e",
        "on-tertiary": "#ffffff",
        "inverse-primary": "#c3c0ff",
        "surface-tint": "#4d44e3",
        "outline-variant": "#c7c4d8",
        "surface-variant": "#e0e3e5",
        "outline": "#777587"
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1.5rem",
        full: "9999px"
      },
      spacing: {
        lg: "24px",
        xxl: "48px",
        sm: "8px",
        gutter: "24px",
        xs: "4px",
        base: "4px",
        "container-max": "1280px",
        xl: "32px",
        md: "16px"
      },
      fontFamily: {
        "headline-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "label-md": ["Inter", "sans-serif"],
        "headline-xl": ["Inter", "sans-serif"],
        "code-sm": ["Inter", "sans-serif"],
        "headline-lg-mobile": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"]
      },
      fontSize: {
        "headline-md": ["18px", { lineHeight: "24px", fontWeight: "600" }],
        "body-lg": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "headline-lg": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "label-md": ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
        "headline-xl": ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "code-sm": ["12px", { lineHeight: "16px", fontWeight: "400" }],
        "headline-lg-mobile": ["20px", { lineHeight: "28px", fontWeight: "600" }],
        "body-md": ["14px", { lineHeight: "20px", fontWeight: "400" }]
      }
    }
  },
  plugins: [formsPlugin],
}
