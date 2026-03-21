import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Box } from '@mui/material';
import LogoImg from 'src/assets/images/logos/logo.png';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',         
      }}
    >
      {/* Logo — left aligned, fixed height */}
      <Box
        component={Link}
        to="/admin/dashboard"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',   // left align
          height: customizer.TopbarHeight,
          px: customizer.isCollapse ? '8px' : '16px',
          textDecoration: 'none',
          overflow: 'hidden',
          my: 1
        }}
      >
        <img
          src={LogoImg}
          alt="PiXEL Tracks & Lights"
          style={{
         height: customizer.isCollapse ? '48px' : '64px',
            width: 'auto',
            objectFit: 'contain',
            display: 'block',
            transition: 'height 0.25s ease',
          }}
        />
      </Box>

      {/* Rainbow bar — full sidebar width */}
      <Box
        sx={{
          height: '5px',
          width: '100%',
          background:
            'linear-gradient(90deg, #e63946, #f4a261, #e9c46a, #2a9d8f, #457b9d, #6a4c93)',
          flexShrink: 0,
        }}
      />
    </Box>
  );
};

export default Logo;