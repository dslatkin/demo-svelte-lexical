import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
    content: ['./src/**/*.{html,js,svelte,ts}'],
    theme: {
        colors: {
            black: 'black',
            white: 'white',
            gray: {
                DEFAULT: '#A8A8A8',
                dark: '#434343',
                light: '#717171',
                lightish: '#B8B8B8',
                lighter: '#DFDFDF',
                lightest: '#EAECF0',
                'lightest-more': '#F4F4F4',
                'lightest-morest': '#FAFAFA',
            },
            blue: {
                DEFAULT: '#2774AE',
                darkest: '#003B5C',
                dark: '#005587',
                bright: '#196DB5',
                brighter: '#1084CB',
                brightest: '#059BE1',
                'brightest-more': '#D2E5F7',
                'brightest-morest': '#F4FBFF',
                quote: '#00558780',
            },
            gold: {
                DEFAULT: '#FFD100',
                darkest: '#FFB81C',
                hover: '#FFE500',
                'hover-lighter': '#FFF280',
                'hover-lightest': '#FFF9BF',
            },
        },
        fontFamily: {
            sans: [
                'Helvetica',
                'Roboto',
                'Arial',
                ...defaultTheme.fontFamily.sans,
            ],
            mono: [...defaultTheme.fontFamily.mono],
        },
        container: {
            center: true,
            padding: {
                /* Uses example values from Tailwind docs */
                DEFAULT: '1rem',
                sm: '2rem',
                lg: '4rem',
                xl: '5rem',
                '2xl': '6rem',
            },
        },
    },
};
