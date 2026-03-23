import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { Box, List, useMediaQuery } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { toggleMobileSidebar } from 'src/store/customizer/CustomizerSlice';
import NavItem from './NavItem';
import NavCollapse from './NavCollapse';
import NavGroup from './NavGroup/NavGroup';
import { getMenuItems } from './MenuItems';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const pathWithoutLastPart = pathname.slice(0, pathname.lastIndexOf('/'));
  const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const customizer = useSelector((state) => state.customizer);
  const hideMenu = lgUp ? customizer.isCollapse && !customizer.isSidebarHover : '';
  const dispatch = useDispatch();
  const [menuItems, setMenuItems] = useState([]);

  // Update menu items when user type changes
  useEffect(() => {
    const updateMenuItems = () => {
      const items = getMenuItems();
      setMenuItems(items);
    };

    // Initial load
    updateMenuItems();

    // Listen for storage changes (in case user logs in/out in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'userType') {
        updateMenuItems();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menuItems.map((item, index) => {
          // {/********SubHeader**********/}
          if (item.subheader) {
            return <NavGroup item={item} hideMenu={hideMenu} key={item.subheader} />;

            // {/********If Sub Menu**********/}
          } else if (item.children) {
            return (
              <NavCollapse
                menu={item}
                level={1}
                pathWithoutLastPart={pathWithoutLastPart}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                key={item.id}
              />
            );

            // {/********If Sub No Menu**********/}
          } else {
            return (
              <NavItem
                item={item}
                level={1}
                pathDirect={pathDirect}
                hideMenu={hideMenu}
                key={item.id}
                onClick={() => {
                  if (!lgUp) {
                    dispatch(toggleMobileSidebar());
                  }
                }}
              />
            );
          }
        })}
      </List>
    </Box>
  );
};

export default SidebarItems;
