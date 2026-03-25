import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import { ThemeSettings } from './theme/Theme';
import ScrollToTop from './components/shared/ScrollToTop';
import Router from './routes/Router.js';
import { Toaster } from 'react-hot-toast';

function App() {
  const routing = useRoutes(Router);
  const theme = ThemeSettings();

  return (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <ScrollToTop>{routing}</ScrollToTop>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#4aed88',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ff6b6b',
                secondary: '#fff',
              },
            },
          }}
        />
    </ThemeProvider>
  );
}

export default App;
