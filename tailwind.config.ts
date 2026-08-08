import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--dx-bg)",
        surface: "var(--dx-surface)",
        "surface-muted": "var(--dx-surface-muted)",
        sidebar: "var(--dx-sidebar)",
        border: "var(--dx-border)",
        "border-strong": "var(--dx-border-strong)",
        text: "var(--dx-text)",
        "text-muted": "var(--dx-text-muted)",
        "text-subtle": "var(--dx-text-subtle)",
        accent: "var(--dx-accent)",
        "accent-hover": "var(--dx-accent-hover)",
        "accent-fg": "var(--dx-accent-fg)",
        "accent-soft": "var(--dx-accent-soft)",
        "black-action": "var(--dx-black-action)",
        "black-action-hover": "var(--dx-black-action-hover)",
        "priority-high": "var(--dx-priority-high)",
        "priority-medium": "var(--dx-priority-medium)",
        "priority-low": "var(--dx-priority-low)",
        "priority-urgent": "var(--dx-priority-urgent)",
        danger: "var(--dx-danger)",
        "danger-soft": "var(--dx-danger-soft)",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "sans-serif",
        ],
      },
      fontSize: {
        xs: ["11px", "1.5"],
        sm: ["12px", "1.5"],
        base: ["13px", "1.5"],
        md: ["14px", "1.45"],
        lg: ["16px", "1.4"],
        xl: ["20px", "1.3"],
        "2xl": ["22px", "1.25"],
      },
      borderRadius: {
        sm: "6px",
        md: "8px",
        lg: "10px",
      },
      spacing: {
        4.5: "18px",
      },
      boxShadow: {
        popover:
          "0 4px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
        card: "0 1px 2px rgba(0,0,0,0.04)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(-2px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-scale": {
          from: { opacity: "0", transform: "scale(0.97)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.12s ease-out",
        "fade-in-scale": "fade-in-scale 0.12s ease-out",
        "slide-in-right": "slide-in-right 0.2s ease-out",
      },
      zIndex: {
        sticky: "30",
        dropdown: "40",
        "sidebar-backdrop": "45",
        sidebar: "50",
        modal: "60",
        "modal-raised": "70",
        popover: "80",
        toast: "90",
      },
    },
  },
  plugins: [],
};

export default config;
