import React from 'react';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { ListItemIcon, ListItem, Collapse, styled, ListItemText, useTheme } from '@mui/material';
import NavItem from '../NavItem';
import { IconChevronDown, IconChevronUp } from '@tabler/icons';
import { useTranslation } from 'react-i18next';

const NavCollapse = ({ menu, level, pathWithoutLastPart, pathDirect, onClick, hideMenu }) => {
  const customizer = useSelector((state) => state.customizer);
  const Icon = menu.icon;
  const theme = useTheme();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  

  const menuIcon = level > 1
    ? <Icon stroke={1.5} size="1rem" />
    : <Icon stroke={1.5} size="1.3rem" />;

  // ── Check if any child route matches current pathname ──────
  const isAnyChildActive = menu.children?.some((item) => item.href === pathname);

  // ── isActive = open OR any child is the current route ─────
  // This is the single source of truth for highlighting
  const isActive = open || isAnyChildActive;

  React.useEffect(() => {
    // ✅ Don't reset to false first — check children directly
    const hasActiveChild = menu.children?.some((item) => item.href === pathname);
    if (hasActiveChild) {
      setOpen(true);
    }
    // Only close if no child is active AND we're not on a sub-path of this menu
    if (!hasActiveChild && !pathname.startsWith(menu.href + '/') && !pathname === menu.href) {
      setOpen(false);
    }
  }, [pathname, menu.children, menu.href]);

  const ListItemStyled = styled(ListItem)(() => ({
    marginBottom: '2px',
    padding: '8px 10px',
    paddingLeft: hideMenu ? '10px' : level > 2 ? `${level * 15}px` : '10px',
    whiteSpace: 'nowrap',
    borderRadius: `${customizer.borderRadius}px`,

    // ✅ Use isActive (not just `open`) so bg is always consistent
    backgroundColor: isActive && level < 2
      ? theme.palette.primary.main
      : 'transparent',

    color: isActive && level < 2
      ? 'white'
      : theme.palette.text.secondary,

   '&:hover': {
  backgroundColor: isActive && level < 2
    ? '#142B21'           // custom dark green on hover when active
    : 'rgba(27,58,45,0.08)', // very subtle green tint when not active
  color: isActive && level < 2
    ? 'white'
    : '#1B3A2D',
},

    // ✅ Remove `selected` prop style conflict — we control bg manually
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.main,
      color: 'white',
      '&:hover': {
        backgroundColor: theme.palette.primary.main,
        color: 'white',
      },
    },
  }));

  const submenus = menu.children?.map((item) => {
    if (item.children) {
      return (
        <NavCollapse
          key={item.id}
          menu={item}
          level={level + 1}
          pathWithoutLastPart={pathWithoutLastPart}
          pathDirect={pathDirect}
          hideMenu={hideMenu}
          onClick={onClick}
        />
      );
    }
    return (
      <NavItem
        key={item.id}
        item={item}
        level={level + 1}
        pathDirect={pathDirect}
        hideMenu={hideMenu}
        onClick={onClick}
      />
    );
  });

  return (
    <React.Fragment key={menu.id}>
      <ListItemStyled
        button
        component="li"
        onClick={() => setOpen((prev) => !prev)}
        // ✅ Pass isActive to selected so MUI selected style also matches
        selected={isActive}
      >
        <ListItemIcon sx={{ minWidth: '36px', p: '3px 0', color: 'inherit' }}>
          {menuIcon}
        </ListItemIcon>
        <ListItemText color="inherit">
          {hideMenu ? '' : <>{t(`${menu.title}`)}</>}
        </ListItemText>
        {!open ? <IconChevronDown size="1rem" /> : <IconChevronUp size="1rem" />}
      </ListItemStyled>

      <Collapse in={open} timeout="auto" unmountOnExit>
        {submenus}
      </Collapse>
    </React.Fragment>
  );
};

NavCollapse.propTypes = {
  menu:                PropTypes.object,
  level:               PropTypes.number,
  pathDirect:          PropTypes.any,
  pathWithoutLastPart: PropTypes.any,
  hideMenu:            PropTypes.any,
  onClick:             PropTypes.func,
};

export default NavCollapse;