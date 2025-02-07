/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/@shadcn/ui/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      borderRadius: {
        lg: 'var(--radius)',              // e.g., 0.5rem
        md: 'calc(var(--radius) - 2px)',   // slightly smaller
        sm: 'calc(var(--radius) - 4px)',   // even smaller
      },
      colors: {
        background: 'hsl(var(--background))',   // from global CSS, e.g., light mode: 210 20% 98%
        foreground: 'hsl(var(--foreground))',   // e.g., 210 15% 20%
        card: {
          DEFAULT: 'hsl(var(--card))',           // e.g., pure white (0 0% 100%)
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',        // e.g., vibrant blue (220 90% 56%)
          foreground: 'hsl(var(--primary-foreground))', // typically white (0 0% 100%)
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',      // e.g., soft gray-blue (210 16% 95%)
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',          // e.g., light soft gray (210 10% 90%)
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',         // e.g., fresh teal (170 50% 50%)
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',    // e.g., bold red (0 80% 60%)
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',              // light border color
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 2px 4px rgba(0, 0, 0, 0.1)',
        md: '0 4px 6px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
