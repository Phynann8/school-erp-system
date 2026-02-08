/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#2563eb', // Royal Blue
                    dark: '#1e40af',
                    light: '#60a5fa',
                },
                secondary: {
                    DEFAULT: '#0ea5e9', // Sky Blue
                },
                accent: {
                    DEFAULT: '#f59e0b', // Amber/Orange
                },
                dark: '#1e293b', // Dark Slate
                light: '#f1f5f9', // Light Gray Background
                danger: '#ef4444',
                success: '#10b981',
            },
            fontFamily: {
                sans: ['Outfit', 'sans-serif'],
                serif: ['Merriweather', 'serif'],
            },
        },
    },
    plugins: [],
}
