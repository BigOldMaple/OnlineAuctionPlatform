/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors if needed
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          "primary": "#2563eb",          // Blue
          "secondary": "#4f46e5",        // Indigo
          "accent": "#f59e0b",           // Amber
          "neutral": "#374151",          // Gray-700
          "base-100": "#f8fafc",         // Slate-50 (main background)
          "base-200": "#f1f5f9",         // Slate-100 (subtle background)
          "base-300": "#e2e8f0",         // Slate-200 (stronger background)
          "info": "#3b82f6",             // Blue-500
          "success": "#22c55e",          // Green-500
          "warning": "#f59e0b",          // Amber-500
          "error": "#ef4444",            // Red-500
          "base-100": "#ffffff",
          "base-200": "#f8fafc",
          "base-300": "#f1f5f9",
          "base-content": "#1e293b",

                    // Card specific colors
                    "card": "#ffffff",
                    "card-foreground": "#1e293b",
          
          // Modifying content colors for better contrast
          "--btn-text-case": "none",     // Prevent all-caps buttons
          "--rounded-btn": "0.5rem",     // Rounded corners
          "--animation-btn": "0.25s",    // Smooth animations
          "--animation-input": "0.2s",   // Smooth animations
          
          // Adjusting text colors
          "--bc": "215 28% 17%",         // Base content color (softer black)
          "--pc": "215 25% 27%",         // Primary content 
          "--sc": "215 25% 27%",         // Secondary content
          "--ac": "215 25% 27%",         // Accent content
          "--nc": "215 25% 27%",         // Neutral content
          "--inc": "215 25% 27%",        // Info content
          "--suc": "215 25% 27%",        // Success content
          "--wac": "215 25% 27%",        // Warning content
          "--erc": "215 25% 27%",        // Error content
        },
        dark: {
          "primary": "#3b82f6",          // Blue-500
          "secondary": "#6366f1",        // Indigo-500
          "accent": "#f59e0b",           // Amber-500
          "neutral": "#1f2937",          // Gray-800
          "base-100": "#0f172a",         // Slate-900 (main background)
          "base-200": "#1e293b",         // Slate-800 (subtle background)
          "base-300": "#334155",         // Slate-700 (stronger background)
          "info": "#3b82f6",             // Blue-500
          "success": "#22c55e",          // Green-500
          "warning": "#f59e0b",          // Amber-500
          "error": "#ef4444",            // Red-500
          
          "base-100": "#1e293b",
          "base-200": "#334155",
          "base-300": "#475569",
          "base-content": "#f8fafc",
          
          // Card specific colors
          "card": "#1e293b",
          "card-foreground": "#f8fafc",

          // Dark mode specific adjustments
          "--rounded-btn": "0.5rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-text-case": "none",

          // Dark mode text colors
          "--bc": "215 28% 94%",         // Base content color (softer white)
          "--pc": "215 25% 90%",         // Primary content 
          "--sc": "215 25% 90%",         // Secondary content
          "--ac": "215 25% 90%",         // Accent content
          "--nc": "215 25% 90%",         // Neutral content
          "--inc": "215 25% 90%",        // Info content
          "--suc": "215 25% 90%",        // Success content
          "--wac": "215 25% 90%",        // Warning content
          "--erc": "215 25% 90%",        // Error content
        }
      }
    ],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
};