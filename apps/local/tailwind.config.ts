import type { Config } from "tailwindcss";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    // Exclude generated views
    "!./views/**/*",
    "!./snapshots/**/*",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
