import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material';
import LogoImg from 'src/assets/images/logos/logo.png';

const Logo = () => {
  const customizer = useSelector((state) => state.customizer);

  const LinkStyled = styled(Link)(() => ({
    height: customizer.TopbarHeight,
    width: customizer.isCollapse ? '40px' : '180px',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
  }));

  return (
    <LinkStyled to="/">
      <img
        src={LogoImg}
        alt="PiXEL Tracks & Lights"
        height={customizer.TopbarHeight}
        style={{ objectFit: 'contain' }}
      />
    </LinkStyled>
  );
};

export default Logo;