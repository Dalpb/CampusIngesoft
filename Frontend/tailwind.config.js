/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        clrNavbar : '#3545E7',
        clrNavSide: '#14238A',
        clrhoverButton:'#3C4FFF',
        clrDescripInput: '#64748B',
        clrTableRow: '#747474',
        clrTableHeader: '#767BF4',
        clrBorderInput: '#CBD5E1',
        brdNavItem: '#131F73',
        bgLoginOne: '#515EDC',
        bgLoginTwo: '#6219D8',
        bgMain: '#EFF5F8',
        clrTitle: '#060C37',
        clrTableHead: '#767BF4',
      },
      backgroundOpacity: ['active'],
    },
  },
  plugins: [],
}

