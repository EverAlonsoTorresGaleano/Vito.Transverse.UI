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
  Popover,
  Typography,
  Divider,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ExpandLess,
  ExpandMore,
  Business as BusinessIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  Security as SecurityIcon,
  Lock as LockIcon,
  Key as KeyIcon,
  Folder as FolderIcon,
  Description as DescriptionIcon,
  Article as ArticleIcon,
  List as ListIcon,
  ViewList as ViewListIcon,
  TableChart as TableChartIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  PieChart as PieChartIcon,
  Analytics as AnalyticsIcon,
  Notifications as NotificationsIcon,
  Mail as MailIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Home as HomeIcon,
  Menu as MenuIcon,
  Apps as AppsIcon,
  Category as CategoryIcon,
  Inventory as InventoryIcon,
  ShoppingCart as ShoppingCartIcon,
  Store as StoreIcon,
  AccountCircle as AccountCircleIcon,
  VerifiedUser as VerifiedUserIcon,
  Work as WorkIcon,
  BusinessCenter as BusinessCenterIcon,
  Apartment as ApartmentIcon,
  Domain as DomainIcon,
  Dataset as DatasetIcon,
  SupervisorAccount as SupervisorAccountIcon,
  GridView as GridViewIcon,
  Terminal as TerminalIcon,
  ManageAccounts as ManageAccountsIcon,
  Summarize as SummarizeIcon,
  EditLocationAlt as EditLocationAltIcon,
  TypeSpecimen as TypeSpecimenIcon,
  FontDownload as FontDownloadIcon,
  Translate as TranslateIcon,
  AlternateEmail as AlternateEmailIcon,
  Language as LanguageIcon,
  Policy as PolicyIcon,
  PrivacyTip as PrivacyTipIcon,
  PlusOne as PlusOneIcon,
} from '@mui/icons-material';
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
  const [popoverAnchor, setPopoverAnchor] = useState<{ element: HTMLElement; text: string } | null>(null);
  const popoverCloseTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const popoverOpenTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (popoverCloseTimeoutRef.current) {
        clearTimeout(popoverCloseTimeoutRef.current);
        popoverCloseTimeoutRef.current = null;
      }
      if (popoverOpenTimeoutRef.current) {
        clearTimeout(popoverOpenTimeoutRef.current);
        popoverOpenTimeoutRef.current = null;
      }
    };
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

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>, text: string) => {
    // Clear any pending close timeout
    if (popoverCloseTimeoutRef.current) {
      clearTimeout(popoverCloseTimeoutRef.current);
      popoverCloseTimeoutRef.current = null;
    }
    // Clear any pending open timeout
    if (popoverOpenTimeoutRef.current) {
      clearTimeout(popoverOpenTimeoutRef.current);
      popoverOpenTimeoutRef.current = null;
    }
    // Add a small delay before showing popover for better UX
    popoverOpenTimeoutRef.current = setTimeout(() => {
      setPopoverAnchor({ element: event.currentTarget, text });
      popoverOpenTimeoutRef.current = null;
    }, 100);
  };

  const handlePopoverClose = () => {
    // Clear any pending open timeout
    if (popoverOpenTimeoutRef.current) {
      clearTimeout(popoverOpenTimeoutRef.current);
      popoverOpenTimeoutRef.current = null;
    }
    // Add a small delay before closing to allow mouse to move to popover
    if (popoverCloseTimeoutRef.current) {
      clearTimeout(popoverCloseTimeoutRef.current);
    }
    popoverCloseTimeoutRef.current = setTimeout(() => {
      setPopoverAnchor(null);
      popoverCloseTimeoutRef.current = null;
    }, 200);
  };

  const handlePopoverMouseEnter = () => {
    // Clear any pending close timeout when mouse enters popover
    if (popoverCloseTimeoutRef.current) {
      clearTimeout(popoverCloseTimeoutRef.current);
      popoverCloseTimeoutRef.current = null;
    }
    // Clear any pending open timeout
    if (popoverOpenTimeoutRef.current) {
      clearTimeout(popoverOpenTimeoutRef.current);
      popoverOpenTimeoutRef.current = null;
    }
  };

  const handlePopoverMouseLeave = () => {
    // Close popover when mouse leaves it
    if (popoverCloseTimeoutRef.current) {
      clearTimeout(popoverCloseTimeoutRef.current);
      popoverCloseTimeoutRef.current = null;
    }
    setPopoverAnchor(null);
  };

  const getIcon = (iconName?: string): React.ReactElement | null => {
    if (!iconName) {
      return null;
    }

    // Normalize icon name: remove spaces, convert to PascalCase if needed
    const normalizedName = iconName
      .trim()
      .split(/[\s-_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    // Icon mapping: maps normalized icon names to Material-UI icon components
    const iconMap: Record<string, React.ComponentType<any>> = {
      Business: BusinessIcon,
      Dashboard: DashboardIcon,
      Settings: SettingsIcon,
      People: PeopleIcon,
      Person: PersonIcon,
      Group: GroupIcon,
      AdminPanelSettings: AdminPanelSettingsIcon,
      Security: SecurityIcon,
      Lock: LockIcon,
      Key: KeyIcon,
      Folder: FolderIcon,
      Description: DescriptionIcon,
      Article: ArticleIcon,
      List: ListIcon,
      ViewList: ViewListIcon,
      TableChart: TableChartIcon,
      Assessment: AssessmentIcon,
      BarChart: BarChartIcon,
      PieChart: PieChartIcon,
      Analytics: AnalyticsIcon,
      Notifications: NotificationsIcon,
      Mail: MailIcon,
      Email: EmailIcon,
      Message: MessageIcon,
      Home: HomeIcon,
      Menu: MenuIcon,
      Apps: AppsIcon,
      Category: CategoryIcon,
      Inventory: InventoryIcon,
      ShoppingCart: ShoppingCartIcon,
      Store: StoreIcon,
      AccountCircle: AccountCircleIcon,
      VerifiedUser: VerifiedUserIcon,
      Work: WorkIcon,
      BusinessCenter: BusinessCenterIcon,
      Apartment: ApartmentIcon,
      Domain: DomainIcon,
      Datagrid: DatasetIcon,
      SupervisorAccount: SupervisorAccountIcon,
      GridView: GridViewIcon,
      Terminal: TerminalIcon,
      ManageAccounts: ManageAccountsIcon,
      Summarize: SummarizeIcon,
      EditLocationAlt: EditLocationAltIcon,
      TypeSpecimen: TypeSpecimenIcon,
      FontDownload: FontDownloadIcon,
      Translate: TranslateIcon,
      AlternateEmail: AlternateEmailIcon,

    
      Policy: PolicyIcon,
      Language: LanguageIcon,
      PrivacyTip: PrivacyTipIcon,
      PlusOne: PlusOneIcon,
   

    };

    const IconComponent = iconMap[normalizedName] || iconMap[iconName];

    if (IconComponent) {
      return <IconComponent />;
    }

    // If no match found, return null to use the fallback Box
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
        <Tooltip title={open ? t('Menu_Button_Collapse_Tooltip') : t('Menu_Button_Expand_Tooltip')}>
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
              onMouseEnter={(e) => handlePopoverOpen(e, t('Companies Remove this item for testing purpouse'))}
              onMouseLeave={handlePopoverClose}
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
                  primary={t('Companies Remove this item for testing purpouse')}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              )}
            </ListItemButton>
          </ListItem>
          {/* Dynamic Menu Items */}
          <Divider />
          {menuGroups.map((group) => (
            <React.Fragment key={group.id}>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => group.id && handleGroupClick(group.id)}
                  onMouseEnter={(e) => {
                    const title = group.description ? t(group.description) : group.description || '';
                    if (title) handlePopoverOpen(e, title);
                  }}
                  onMouseLeave={handlePopoverClose}
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
                        <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center' }}>
                          {expandedGroups.has(group.id || '') ? <ExpandLess /> : <ExpandMore />}
                        </Box>
                      )}
                    </>
                  )}
                </ListItemButton>
                        <Divider />
              </ListItem>
              {open && group.items && (
                <Collapse in={expandedGroups.has(group.id || '')} timeout="auto" unmountOnExit>
                  <List disablePadding>
                    {group.items.map((item: MenuItemDTO) => (
                      <ListItem key={item.id} disablePadding>
                        <ListItemButton
                          selected={location.pathname === item.path}
                          onClick={() => handleItemClick(item.path)}
                          onMouseEnter={(e) => {
                            const title = item.description ? t(item.description) : item.description || '';
                            if (title) handlePopoverOpen(e, title);
                          }}
                          onMouseLeave={handlePopoverClose}
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
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
      <Popover
        open={popoverAnchor !== null}
        anchorEl={popoverAnchor?.element}
        onClose={() => setPopoverAnchor(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        disableRestoreFocus
        disableAutoFocus
        disableEnforceFocus
        disablePortal={false}
        hideBackdrop
        PaperProps={{
          onMouseEnter: handlePopoverMouseEnter,
          onMouseLeave: handlePopoverMouseLeave,
          sx: {
            pointerEvents: 'auto',
            mt: 1,
            ml: 1,
            boxShadow: 3,
          },
        }}
        sx={{
          pointerEvents: 'none',
          zIndex: 1300,
          '& .MuiPopover-paper': {
            pointerEvents: 'auto',
          },
        }}
      >
        <Typography sx={{ p: 1.5 }}>{popoverAnchor?.text}</Typography>
      </Popover>
    </Drawer>
  );
};

export default SideMenu;

