/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./resources/**/*.blade.php",
        "./resources/**/*.jsx",
        "./resources/**/*.js",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#2c5842",
                "background-light": "#f6f7f7",
                "background-dark": "#161c19",
            },
            fontFamily: {
                display: ["Manrope", "sans-serif"]
            },
        },
    },
    plugins: [],
}