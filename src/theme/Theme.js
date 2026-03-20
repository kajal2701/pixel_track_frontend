import _ from 'lodash';
import { createTheme } from '@mui/material/styles';
import components from './Components';
import typography from './Typography';
import { shadows } from './Shadows';
import { LightThemeColors } from './LightThemeColors';
import * as locales from '@mui/material/locale';
import { baselightTheme } from './DefaultColors';

export const BuildTheme = (config = {}) => {
  const themeOptions = LightThemeColors.find((theme) => theme.name === config.theme);
  const defaultTheme = baselightTheme;
  const defaultShadow = shadows;
  const themeSelect = themeOptions;

  const baseMode = {
    palette: {
      mode: 'light',
    },
    shape: {
      borderRadius: 12,
    },
    shadows: defaultShadow,
    typography: typography,
  };
  
  const theme = createTheme(
    _.merge({}, baseMode, defaultTheme, locales['enUS'], themeSelect, {
      direction: config.direction,
    }),
  );
  theme.components = components(theme);
  return theme;
};

const ThemeSettings = () => {
  const theme = BuildTheme({
    direction: 'ltr',
    theme: 'PIXEL_THEME', // Default light theme
  });

  return theme;
};

export { ThemeSettings };
