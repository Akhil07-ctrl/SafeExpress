/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: "#3B82F6",
					dark: "#1D4ED8",
					light: "#93C5FD",
				},
			},
			animation: {
				fadeInUp: 'fadeInUp 0.3s ease-out',
			},
			keyframes: {
				fadeInUp: {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
			},
		}
	},
	plugins: [],
};
