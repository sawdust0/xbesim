import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        exo2: ['var(--font-exo2)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
