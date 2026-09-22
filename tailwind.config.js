/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.vue",
    "./Modules/**/resources/**/*.blade.php",
    "./Modules/**/resources/**/*.tsx",
    "./Modules/**/resources/**/*.ts",
    "./Modules/**/resources/**/*.jsx",
    "./Modules/**/resources/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#F4F8FB",
          100: "#DFEFFB",
          200: "#CFDFED",
          300: "#AEC9E0",
          400: "#89B1D2",
          500: "#528EBE",
          600: "#4E8ABC",
          700: "#3E75A3",
          800: "#326085",
          900: "#274B68",
          950: "#1C354A"
        },
        // brand: {
        //   50: "#EDF3F8",
        //   100: "#CBDDEB",
        //   200: "#AAC8DF",
        //   300: "#89B2D2",
        //   400: "#679DC5",
        //   500: "#538FBE",
        //   600: "#3A6F98",
        //   700: "#2D5676",
        //   800: "#203E55",
        //   900: "#142634",
        //   950: "#070E12"
        // },
        kemenperin: {
          blue: '#1e3a8a',
          navy: '#0f172a',
          gold: '#d97706',
          teal: '#0d9488',
        },
        surface: {
          50: "#EDF0F7",
          100: "#CED4E9",
          200: "#AEB8DB",
          300: "#8E9DCC",
          400: "#6F81BE",
          500: "#576DB4",
          600: "#415390",
          700: "#334171",
          800: "#242F51",
          900: "#161C31",
          950: "#080A12"
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Montserrat', 'sans-serif'],
      },
      borderRadius: {
        'card': '1rem',
        'input': '0.625rem',
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 0 0 1px rgba(0, 0, 0, 0.03), 0 2px 8px -2px rgba(0, 0, 0, 0.05)',
        'elevated': '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
      },
    },
  },
  plugins: [],
}
