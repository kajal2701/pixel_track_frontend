const baselightTheme = {
  direction: 'ltr',
  palette: {
    primary: {
      main: '#1B3A2D',      // Deep forest green — main brand color
      light: '#E8F5EE',     // Soft green tint — backgrounds, chips
      dark: '#142B21',      // Deeper green — hover states
    },
    secondary: {
      main: '#2D6A4F',      // Mid green — secondary actions
      light: '#D4EDE1',     // Light green tint
      dark: '#1B4332',      // Dark green
    },
    success: {
      main: '#2a9d8f',      // Teal ray from logo
      light: '#E0F5F2',
      dark: '#1f7a6e',
      contrastText: '#ffffff',
    },
    info: {
      main: '#457b9d',      // Blue ray from logo
      light: '#E3EEF5',
      dark: '#2c5f7a',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e63946',      // Red ray from logo
      light: '#FDECEA',
      dark: '#c1121f',
      contrastText: '#ffffff',
    },
    warning: {
      main: '#f4a261',      // Orange ray from logo
      light: '#FEF3E8',
      dark: '#e76f2a',
      contrastText: '#ffffff',
    },
    purple: {
      A50:  '#F0EBF8',
      A100: '#6a4c93',      // Purple ray from logo
      A200: '#4a3570',
    },
    grey: {
      100: '#F4F9F6',       // Lightest green-tinted gray
      200: '#E8F0EC',
      300: '#C8D8CF',
      400: '#7A9E8E',
      500: '#4A6B5A',
      600: '#2A3D33',       // Dark green-gray
    },
    text: {
      primary: '#1B3A2D',   // Brand dark green for all primary text
      secondary: '#4A6B5A', // Muted green for secondary text
    },
    action: {
      disabledBackground: 'rgba(27,58,45,0.12)',
      hoverOpacity: 0.02,
      hover: '#f4f9f6',     // Very light green tint on hover
    },
    divider: '#C8D8CF',     // Soft green-gray dividers
    background: {
      default: '#ffffff',
    },
  },
};



export {  baselightTheme };
