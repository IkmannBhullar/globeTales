import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          indigo: "#4F46E5",
          blue: "#3B82F6",
          emerald: "#10B981",
          amber: "#F59E0B",
          red: "#EF4444",
          slate: "#0F172A",
          cloud: "#F8FAFC"
        }
      },
      boxShadow: {
        panel: "0 10px 40px rgba(15, 23, 42, 0.08)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(79, 70, 229, 0.25), transparent 30%), radial-gradient(circle at top right, rgba(59, 130, 246, 0.18), transparent 35%)"
      }
    }
  },
  plugins: []
};

export default config;
