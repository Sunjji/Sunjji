import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      blur: {
        custom: "20px", // 블러 20px
      },
      boxShadow: {
        custom: "0 20px 20px rgba(161, 119, 98, 0.5)", // X 0, Y 20, 색상 #A17762, 50% 투명도
      },
      dropShadow: {
        custom: "0 20px 20px rgba(161, 119, 98, 0.5)", // X 0, Y 20, 색상 #A17762, 50% 투명도
      },
      colors: {
        beige: "#FFF8E8",
        point: "#FEFBF2",
        whitePoint: "#FFFEFA",
        BrownPoint: "#A17762",
        Brown: "#EFDDC4",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/aspect-ratio'),
  ],
}
export default config;
