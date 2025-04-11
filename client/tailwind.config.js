/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1DA1F2", // Thêm màu tùy chỉnh
        secondary: "#79ACFF",
      },
      spacing: {
        '128': '32rem', // Thêm giá trị spacing tùy chỉnh
      },
      borderRadius: {
        xl: '1.5rem', // Tùy chỉnh bo góc
      }
    },
  },
  plugins: [],
};