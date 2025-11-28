import React, { useState, useEffect, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Select,
  MenuItem,
  FormControl,
  Tooltip,
} from '@mui/material';
import { Logout as LogoutIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import SideMenu from '../../components/SideMenu';
import { removeToken } from '../../utils/auth';
import { setCulture, getCultureId } from '../../utils/culture';
import { createAuthenticatedApiClient } from '../../api/client';
import { env } from '../../config/env';
import { changeLanguage } from '../../i18n/config';
import type { ListItemDTO } from '../../api/vito-transverse-identity-api';
import { appRoutes } from '../../config/routes.tsx';
const Layout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(true);
  const [cultures, setCultures] = useState<ListItemDTO[]>([]);
  const [selectedCulture, setSelectedCulture] = useState<string>(getCultureId());
  const autoLogoutTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const loadCultures = async () => {
      try {
        const client = createAuthenticatedApiClient();
        const culturesData = await client.getApiMasterV1CulturesActiveDropDown();
        setCultures(culturesData);
      } catch (error) {
        console.error('Error loading cultures:', error);
      }
    };

    loadCultures();
  }, []);

  // Verify page authorization
  useEffect(() => {
    const VerifyPageAuthorization = async () => {
      try {
        const client = createAuthenticatedApiClient();
        const menuGroups = await client.getApiUsersV1Menu();
        const matches =appRoutes.find((route) => route.path === location.pathname);
        const currentRoute = matches?.path;
        const currentMenuItem = menuGroups.find((group) => group.items?.find((item) => '/' + item.path === currentRoute));

        
        if (currentMenuItem === null) {
          toast.error(t('Security_AccessDenied', { path: currentMenuItem }));
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading menu data:', error);
        toast.error(t('Error_LoadingMenu') || 'Error loading menu data');
        navigate('/dashboard');
      }
    };

    VerifyPageAuthorization();
  }, [location.pathname, t, navigate]);

  useEffect(() => {
    const resetAutoLogout = () => {
      if (autoLogoutTimerRef.current) {
        clearTimeout(autoLogoutTimerRef.current);
      }

      const autoLogoutTime = env.AUTO_LOGOFF_TIME * 60 * 1000; // Convert minutes to milliseconds
      autoLogoutTimerRef.current = setTimeout(() => {
        handleLogout();
        toast.info(t('Security_AutoLogout'));
      }, autoLogoutTime);
    };

    const handleActivity = () => {
      resetAutoLogout();
    };

    resetAutoLogout();

    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keypress', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    return () => {
      if (autoLogoutTimerRef.current) {
        clearTimeout(autoLogoutTimerRef.current);
      }
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keypress', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [t]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const handleCultureChange = async (cultureId: string) => {
    try {
      await changeLanguage(cultureId);
      setCulture(cultureId);
      setSelectedCulture(cultureId);
      toast.success(t('Language_Changed'));
    } catch (error) {
      console.error('Error changing language:', error);
      toast.error(t('Language_Change_Error'));
    }
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <SideMenu open={menuOpen} onToggle={() => setMenuOpen(!menuOpen)} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: menuOpen ? 'calc(100% - 280px)' : 'calc(100% - 64px)',
          transition: 'width 0.3s',
          backgroundColor: '#f5f5f5',
        }}
      >
        <AppBar
          position="static"
          elevation={0}
          sx={{
            backgroundColor: '#ffffff',
            borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
            color: '#1e3a5f',
          }}
        >
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
              {t('App_Title')}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <FormControl size="small" sx={{ minWidth: 120 }}>
                <Select
                  value={selectedCulture}
                  onChange={(e) => handleCultureChange(e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#1e3a5f',
                    },
                  }}
                >
                  {cultures.map((culture) => (
                    <MenuItem key={culture.id} value={culture.id}>
                      {culture.nameTranslationKey ? t(culture.nameTranslationKey) : culture.id}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Tooltip title={t('Button_Logout_Tooltip')}>
                <IconButton
                  color="inherit"
                  onClick={handleLogout}
                  sx={{ color: '#1e3a5f' }}
                >
                  <LogoutIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;

