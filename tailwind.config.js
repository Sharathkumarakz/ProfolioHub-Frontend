/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: ["./src/**/*.{html,ts,css,scss,sass,less,style}"],
  theme: {
    colors: {
      transparent: "transparent",
      "common-primary-font-color": "var(--common-primary-font-color)",
      "common-secondary-font-color": "var(--common-secondary-font-color)",
      "common-tertiary-bg-color": "var(--common-tertiary-bg-color)",
      "common-border-color": "var(--common-border-color)",
      "common-main-bg-color": "var(--common-main-bg-color)",
      "common-secondary-bg-color": "var(--common-secondary-bg-color)",
      "common-brand-color-1": "var(--common-brand-color-1)",
      "common-brand-color-2": "var(--common-brand-color-2)",
      "common-green-color": "var(--common-green-color)",
      "common-green-bg-color": "var(--common-green-bg-color)",
      "common-blue-color": "var(--common-blue-color)",
      "common-blue-bg-color": "var(--common-blue-bg-color)",
      "common-red-color": "var(--common-red-color)",
      "common-red-bg-color": "var(--common-red-bg-color)",
      "common-yellow-color": "var(--common-yellow-color)",
      "common-yellow-bg-color": "var(--common-yellow-bg-color)",
      white: "#FFFFFF"
    },
    extend: {
      fontFamily: {
        karla: ["var(--inter)"],
      },
      boxShadow: {
        "common-button-shadow": "0px 2px 6px 0px rgba(140, 140, 140, 0.25)" // example
      },
      gridTemplateColumns: {
        16: "repeat(16, minmax(0, 1fr))"
      }
    }
  },
  variants: {
    extend: {
      backgroundColor: ["responsive", "hover", "focus", "group-hover"], // Enable background color variants
      opacity: ["responsive", "hover", "focus", "group-hover"] // Enable opacity variants
    }
  },
  plugins: []
};
