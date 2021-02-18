const defaultTheme = require('tailwindcss/defaultTheme');
const colors = require('tailwindcss/colors');

module.exports = {
   //Only purges when NODE_ENV is set to production
   purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
   darkMode: false, // or 'media' or 'class'
   //Color Palette options here https://tailwindcss.com/docs/customizing-colors
   theme: {
      extend: {
         container: {
            center: true,
         },
         fontFamily: {
            sans: ['Lato', ...defaultTheme.fontFamily.sans], //Adding a font to the font-sans class that is defined in tailwindStyles.css
         },
         fontWeight: {
            thin: 100,
            light: 300,
            normal: 400,
            bold: 700,
            black: 900, //Only adding the available Lato font sizes
         },
         colors: {
            primary: colors.indigo,
            secondary: colors.yellow,
            neutral: colors.gray,
         },
      },
   },
   variants: {},
   plugins: [
      require('@tailwindcss/typography'), //Plugin for 'prose' class to style articles (or don't add it and style everything manually). npm install @tailwindcss/typography
      require('@tailwindcss/forms'), //Resets forms
   ],
};
