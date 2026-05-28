import { Box, Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorImg from 'src/assets/images/backgrounds/errorimg.svg';

const getHomeRoute = () => {
  const userType = localStorage.getItem('userType');

  if (userType === 'admin') {
    try {
      const adminData = JSON.parse(localStorage.getItem('adminData') || '{}');
      if (adminData.role === 'production tech') {
        return '/admin/production';
      }
      return '/admin/dashboard';
    } catch (e) {
      return '/admin/dashboard';
    }
  } else if (userType === 'customer') {
    return '/order/history';
  }

  return '/';
};

const Error = () => (
  <Box
    display="flex"
    flexDirection="column"
    height="100vh"
    textAlign="center"
    justifyContent="center"
  >
    <Container maxWidth="md">
      <img src={ErrorImg} alt="404" />
      <Typography align="center" variant="h1" mb={4}>
        Opps!!!
      </Typography>
      <Typography align="center" variant="h4" mb={4}>
        This page you are looking for could not be found.
      </Typography>
      <Button
        color="primary"
        variant="contained"
        component={Link}
        to={getHomeRoute()}
        disableElevation
      >
        Go Back to Home
      </Button>
    </Container>
  </Box>
);

export default Error;
