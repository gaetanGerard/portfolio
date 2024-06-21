import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                'custom-dark': '#252934',
                'highlight': '#e31b6d',
                'blue': '#04c2c9',
                'dark-blue': '#00a1a7',
                timberWolf: '#d4d4d8',
                battleGray: '#858585',
                french: '#b5b5ba',
                night: '#141414',
                jet: '#292929',
                jetLight: '#333333',
                jetGray: '#6d6d74',
                richBlack: '#2e2e2e',
                eerieBlack: '#1f1f1f',
                onyx: '#5b5b5b',
            },
            boxShadow: {
                card: '0px 35px 120px -15px #1f1f1f',
                cardLight: '0px 19px 38px #eaeaec, 0px 15px 12px #eaeaec',
              },
              screens: {
                xs: '450px',
                sm: '640px',
                md: '768px',
                xmd: '900px',
                lg: '1025px',
                xl: '1280px',
                '2xl': '1536px',
                '3xl': '1800px',
              }
        },
    },

    plugins: [forms],
};
