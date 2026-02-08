/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sentinel: {
                    bg: "#020408", // Very dark blue/black
                    panel: "#0a1016", // Panel background
                    cyan: "#00f0ff", // Primary accent
                    green: "#00ff9d", // Success/Safe
                    red: "#ff003c", // Danger/Alert
                    warning: "#fce83a", // Warning
                    text: "#e0f2fe", // Primary text
                    dim: "#64748b", // Dimmed text
                    border: "rgba(0, 240, 255, 0.2)",
                },
            },
            fontFamily: {
                mono: ['"Share Tech Mono"', "monospace"], // Primary Sentinel font
                sans: ['"Orbitron"', "sans-serif"], // Headers
            },
            boxShadow: {
                'glow-cyan': '0 0 10px rgba(0, 240, 255, 0.5)',
                'glow-red': '0 0 10px rgba(255, 0, 60, 0.5)',
            },
            backgroundImage: {
                'grid-pattern': "linear-gradient(to right, #0a1016 1px, transparent 1px), linear-gradient(to bottom, #0a1016 1px, transparent 1px)",
            },
        },
    },
    plugins: [],
}
