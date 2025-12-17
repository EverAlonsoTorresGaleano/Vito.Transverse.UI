import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Button,
  Grid,
  Tooltip,
} from '@mui/material';
import { 
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
  // The correct icon for a "datagrid" concept is "Dataset", not "Datagrid"
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
  Policy as PolicyIcon,
  Language as LanguageIcon,
  PrivacyTip as PrivacyTipIcon,
  PlusOne as PlusOneIcon
} from '@mui/icons-material';
import { createAuthenticatedApiClient } from '../../api/client';
import type { MenuGroupDTO } from '../../api/vito-transverse-identity-api';
import Loading from '../../components/Loading';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [menuGroups, setMenuGroups] = useState<MenuGroupDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchMenuGroups = async () => {
      try {
        setLoading(true);
        setError(null);
        const client = createAuthenticatedApiClient();
        const groups = await client.getApiUsersV1Menu();
        // Filter only visible groups
        const visibleGroups = groups.filter((group) => group.isVisible !== false);
        setMenuGroups(visibleGroups);
      } catch (err) {
        console.error('Error fetching menu groups:', err);
        setError(t('Error_LoadingMenu') || 'Error loading menu data');
      } finally {
        setLoading(false);
      }
    };

    fetchMenuGroups();
  }, [t]);

  const handleNavigate = (group: MenuGroupDTO) => {
    // Navigate to the first item's path if available
    if (group.items && group.items.length > 0) {
      const firstItem = group.items.find((item) => item.isVisible === true && item.isApi !== undefined);
      if (firstItem && firstItem.path) {
        navigate(`/${firstItem.path}`);
      }
    }
  };

  const getNavigationPath = (group: MenuGroupDTO): string | null => {
    if (group.items && group.items.length > 0) {
      const firstItem = group.items.find((item) => item.isVisible === true && item.isApi !== undefined);
      if (firstItem && firstItem.path) {
        return `/${firstItem.path}`;
      }
    }
    return null;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" color="error">
            {error}
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1e3a5f', fontWeight: 600 }}>
          {t('Dashboard_Title')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          {t('Dashboard_Welcome')}
        </Typography>
      </Paper>

      {menuGroups.length === 0 ? (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="body1" sx={{ color: '#666666', textAlign: 'center' }}>
            {t('Dashboard_NoMenuGroups') || 'No menu groups available'}
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {menuGroups.map((group) => {
            if (group.title === "Module_Dashboard") {
              return null;
            }
            const navigationPath = getNavigationPath(group);
            return (
              <Grid item xs={12} sm={6} md={4} lg={3} key={group.id || group.title}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, textAlign: 'center', pt: 3 }}>
                    <Avatar
                      sx={{
                        width: 64,
                        height: 64,
                        mx: 'auto',
                        mb: 2,
                        bgcolor: '#1e3a5f',
                        fontSize: '2rem',
                      }}
                      src={getIcon(group.icon) ? undefined : undefined}
                    >
                      {getIcon(group.icon) }
                    </Avatar>
                    <Typography
                      variant="h6"
                      component="h2"
                      gutterBottom
                      sx={{ color: '#1e3a5f', fontWeight: 600, mb: 1 }}
                    >
                      {t(group.title || '')}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666666', minHeight: 40 }}>
                      {t(group.description || '')}
                    </Typography>
                  </CardContent>
                  {navigationPath && (
                    <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                      <Tooltip title={t('Button_GoToModule_Tooltip') || 'Go to module'}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleNavigate(group)}
                        sx={{ minWidth: 120 }}
                      >
                        {t('Button_GoToModule') || 'View'}
                      </Button>
                      </Tooltip>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Box>
  );
};

export default Dashboard;

