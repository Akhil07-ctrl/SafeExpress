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
			}
		}
	},
	plugins: [],
};
