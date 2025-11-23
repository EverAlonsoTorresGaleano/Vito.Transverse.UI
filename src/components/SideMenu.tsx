import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Box,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { createApiClient } from '../api/client';
import type { MenuGroupDTO, MenuItemDTO } from '../api/vito-transverse-identity-api';

interface SideMenuProps {
  open: boolean;
  onToggle: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ open, onToggle }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuGroups, setMenuGroups] = useState<MenuGroupDTO[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const { createAuthenticatedApiClient } = await import('../api/client');
        const client = createAuthenticatedApiClient();
        const menu = await client.getApiUsersV1Menu();
        setMenuGroups(menu);
        setLoading(false);
      } catch (error) {
        console.error('Error loading menu:', error);
        setLoading(false);
      }
    };

    loadMenu();
  }, []);

  const handleGroupClick = (groupId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId);
    } else {
      newExpanded.add(groupId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleItemClick = (path?: string) => {
    if (path) {
      navigate(path);
    }
  };

  const getIcon = (iconName?: string) => {
    // You can map icon names to Material-UI icons here
    // For now, return null or a default icon
    return null;
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? 280 : 64,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? 280 : 64,
          boxSizing: 'border-box',
          transition: 'width 0.3s',
          overflowX: 'hidden',
          borderRight: '1px solid rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', p: 1, minHeight: 64 }}>
        <Tooltip title={t('Button_ToggleMenu_Tooltip')}>
          <IconButton onClick={onToggle}>
            {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Divider />
      {!loading && (
        <List>
          {/* Static Companies Menu Item */}
          <ListItem disablePadding>
            <ListItemButton
              selected={location.pathname === '/companies'}
              onClick={() => handleItemClick('/companies')}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
                backgroundColor: location.pathname === '/companies' ? 'rgba(30, 58, 95, 0.08)' : 'transparent',
                '&:hover': {
                  backgroundColor: 'rgba(30, 58, 95, 0.12)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                  color: '#1e3a5f',
                }}
              >
                <BusinessIcon />
              </ListItemIcon>
              {open && (
                <ListItemText
                  primary={t('Menu_Companies')}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              )}
            </ListItemButton>
          </ListItem>
          <Divider />
          {menuGroups.map((group) => (
            <React.Fragment key={group.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => group.id && handleGroupClick(group.id)}
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: '#1e3a5f',
                    }}
                  >
                    {getIcon(group.icon) || <Box sx={{ width: 24, height: 24 }} />}
                  </ListItemIcon>
                  {open && (
                    <>
                      <ListItemText
                        primary={group.title ? t(group.title) : group.title}
                        sx={{ opacity: open ? 1 : 0 }}
                      />
                      {group.items && group.items.length > 0 && (
                        expandedGroups.has(group.id || '') ? <ExpandLess /> : <ExpandMore />
                      )}
                    </>
                  )}
                </ListItemButton>
              </ListItem>
              {open && group.items && (
                <Collapse in={expandedGroups.has(group.id || '')} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {group.items.map((item: MenuItemDTO) => (
                      <ListItem key={item.id} disablePadding>
                        <ListItemButton
                          selected={location.pathname === item.path}
                          onClick={() => handleItemClick(item.path)}
                          sx={{
                            pl: 4,
                            minHeight: 48,
                            backgroundColor: location.pathname === item.path ? 'rgba(30, 58, 95, 0.08)' : 'transparent',
                            '&:hover': {
                              backgroundColor: 'rgba(30, 58, 95, 0.12)',
                            },
                          }}
                        >
                          <ListItemIcon
                            sx={{
                              minWidth: 0,
                              mr: 3,
                              justifyContent: 'center',
                              color: '#1e3a5f',
                            }}
                          >
                            {getIcon(item.icon) || <Box sx={{ width: 20, height: 20 }} />}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.title ? t(item.title) : item.title}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      )}
    </Drawer>
  );
};

export default SideMenu;

