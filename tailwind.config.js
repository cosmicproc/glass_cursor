/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'selector',
    content: ['./src/**/*.{html,js,ts,svelte}'],
    theme: {
        extend: {},
    },
    plugins: [require('@tailwindcss/typography')],
};
