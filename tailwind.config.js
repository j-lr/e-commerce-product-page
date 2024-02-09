/** @type {import('tailwindcss').Config} */
export const tailwindBreakpoints = {
  "tablet-xs": "500px",
  tablet: "900px",
  laptop: "1024px",
  "laptop-xl": "1440px",
  "laptop-2xl": "1800px",
};

export const content = ["./src/**/*.{html,js}", "./index.html"];
export const theme = {
  fontFamily: {
    kumbh: ["Kumbh Sans", "sans-serif"],
  },
  extend: {
    colors: {
      orange: "hsl(26, 100%, 55%)",
      "orange-100": "hsl(26, 100%, 55%, 1)",
      "pale-orange": "hsl(25, 100%, 94%)",

      "very-dark-blue": "hsl(220, 13%, 13%)",
      "dark-grayish-blue": "hsl(219, 9%, 45%)",
      "grayish-blue": "hsl(220, 14%, 75%)",
      "light-grayish-blue": "hsl(223, 64%, 98%)",
      white: "hsl(0, 0%, 100%)",
      black: "hsl(0, 0%, 0%)",
      "divider-color": "rgb(235, 235, 237)",
    },
  },

  screens: tailwindBreakpoints,
};
export const plugins = [];
