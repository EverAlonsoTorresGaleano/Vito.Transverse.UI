import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Tooltip,
  Paper,
  InputAdornment,
} from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridActionsCellItem,
  GridRowParams,
  GridToolbar,
} from '@mui/x-data-grid';
import {
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  Add as AddIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { createAuthenticatedApiClient } from '../../api/client';
import type { CompanyDTO, MenuItemDTO } from '../../api/vito-transverse-identity-api';
import { env } from '../../config/env';
import { useDataGridLocalization } from '../../utils/DataGridLocalization';
import ConfirmDeletionDialog from '../../components/ConfirmDeletionDialog';
import { toast } from 'react-toastify';

const CompaniesListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<CompanyDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<CompanyDTO | null>(null);
  const [pageSize, setPageSize] = useState<number>(env.GRID_DEFAULT_PAGE_SIZE );
  const pageSizeOptions = env.GRID_PAGE_SIZES_LIST ;
  const [canDelete, setCanDelete] = useState<boolean>(true);
  const [canEdit, setCanEdit] = useState<boolean>(true);
  const [canView, setCanView] = useState<boolean>(true);
  const [canNew, setCanNew] = useState<boolean>(true);

  const localeText = useDataGridLocalization();

  const loadCompanies = useCallback(async () => {
    setLoading(true);
    try {
      const client = createAuthenticatedApiClient();
      const data = await client.getApiCompaniesV1All();
      setCompanies(data);
    } catch (error) {
      console.error('Error loading companies:', error);
      toast.error(t('Error_LoadingCompanies'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);


  useEffect(() => {
    const VerifyPagePermissionsAndDisableButtons = async () => {
      try {
        const client = createAuthenticatedApiClient();
        const menuGroups = await client.getApiUsersV1Menu();
        
        const currentPath = window.location.pathname;
        let foundMenuItem: MenuItemDTO | null = null;
        
        for (const group of menuGroups) {
          if (group.items) {
            const item = group.items.find((item) => item.path === currentPath || '/' + item.path === currentPath            );
            if (item) {
              foundMenuItem = item;
              break;
            }
          }
        }
        
        if (foundMenuItem !== null) { 
              setCanDelete(foundMenuItem.canDelete || false);
              setCanEdit(foundMenuItem.canEdit || false);
              setCanView(foundMenuItem.canView || false);
              setCanNew(foundMenuItem.canCreate || false);
        }
      } catch (error) {
        console.error('Error loading menu data:', error);
        toast.error(t('Error_LoadingMenu') || 'Error loading menu data');
        navigate('/dashboard');
      }
    };

    VerifyPagePermissionsAndDisableButtons();
  }, [t, navigate]);


  const handleDelete = async (company: CompanyDTO) => {
    try {
      const client = createAuthenticatedApiClient();
      await client.deleteApiCompaniesV1(company.id);
      toast.success(t('Success_CompanyDeleted'));
      loadCompanies();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error(t('Error_DeletingCompany'));
    } finally {
      setDeleteDialogOpen(false);
      setSelectedCompany(null);
    }
  };

  const handleDeleteClick = (company: CompanyDTO) => {
    setSelectedCompany(company);
    setDeleteDialogOpen(true);
  };

  const handleView = (_company: CompanyDTO) => {
    toast.info(t('Button_View_Tooltip'));
    // Navigate to view page - adjust path as needed
    //navigate(`/companies/${_company.id}/view`);
  };

  const handleEdit = (_company: CompanyDTO) => {
    toast.info(t('Button_Edit_Tooltip'));
    // Navigate to edit page - adjust path as needed
    //navigate(`/companies/${_company.id}/edit`);
  };

  const handleNew = () => {
    toast.info(t('Button_New_Tooltip'));
    // Navigate to new company page - adjust path as needed
    //navigate('/companies/new');
  };

  const handleClearSearch = () => {
    setSearchText('');
  };

  const filteredCompanies = companies.filter((company) => {
    if (!searchText) return true;
    const searchLower = searchText.toLowerCase();
    const nameTranslated = company.nameTranslationKey ? t(company.nameTranslationKey).toLowerCase() : company.nameTranslationValue?.toLowerCase() || '';
    const descriptionTranslated = company.descriptionTranslationKey ? t(company.descriptionTranslationKey).toLowerCase() : company.descriptionTranslationValue?.toLowerCase() || '';
    return (
      nameTranslated.includes(searchLower) ||
      company.subdomain?.toLowerCase().includes(searchLower) ||
      company.email?.toLowerCase().includes(searchLower) ||
      descriptionTranslated.includes(searchLower)
    );
  });

  const columns: GridColDef<CompanyDTO>[] = [
    {
      field: 'id',
      headerName: t('Label_Id') || 'Id',
      width: 100,
      sortable: true,
      resizable: true,
    },
    {
      field: 'nameTranslationKey',
      headerName: t('Label_Name'),
      flex: 1,
      minWidth: 150,
      sortable: true,
      resizable: true,
      valueGetter: (_, row) => {
        const translationKey = row.nameTranslationKey;
        return translationKey ? t(translationKey) : row.nameTranslationValue || '';
      },
      renderCell: (params) => {
        const translationKey = params.row.nameTranslationKey;
        return translationKey ? t(translationKey) : params.row.nameTranslationValue || '';
      },
    },
    {
      field: 'subdomain',
      headerName: t('Label_Subdomain'),
      flex: 1,
      minWidth: 120,
      sortable: true,
      resizable: true,
    },
    {
      field: 'email',
      headerName: t('Label_Email'),
      flex: 1,
      minWidth: 200,
      sortable: true,
      resizable: true,
    },
    {
      field: 'descriptionTranslationKey',
      headerName: t('Label_Description'),
      flex: 1,
      minWidth: 200,
      sortable: true,
      resizable: true,
      valueGetter: (_, row) => {
        const translationKey = row.descriptionTranslationKey;
        return translationKey ? t(translationKey) : row.descriptionTranslationValue || '';
      },
      renderCell: (params) => {
        const translationKey = params.row.descriptionTranslationKey;
        return translationKey ? t(translationKey) : params.row.descriptionTranslationValue || '';
      },
    },
    {
      field: 'isActive',
      headerName: t('Label_IsActive'),
      width: 120,
      sortable: true,
      resizable: true,
      type: 'boolean',
    },
    {
      field: 'isSystemCompany',
      headerName: t('Label_IsSystemCompany'),
      width: 150,
      sortable: true,
      resizable: true,
      type: 'boolean',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: t('Label_Actions'),
      width: 150,
      resizable: true,
      getActions: (params: GridRowParams<CompanyDTO>) => [
        <Tooltip
          key="view"
          title={canView ? t('Button_View_Tooltip') : t('Button_View_Tooltip_NoPermissions')}
        >
          <span>
            <GridActionsCellItem
              icon={canView ? <VisibilityIcon color="primary" /> : <BlockIcon color="disabled" />}
              label={canView ? t('Button_View_Tooltip') : t('Button_View_Tooltip_NoPermissions')}
              onClick={() => handleView(params.row)}
              showInMenu={false}
              disabled={!canView}
            />
          </span>
        </Tooltip>,
        <Tooltip
          key="edit"
          title={canEdit ? t('Button_Edit_Tooltip') : t('Button_Edit_Tooltip_NoPermissions')}
        >
          <span>
            <GridActionsCellItem
              icon={canEdit ? <EditIcon color="action" /> : <BlockIcon color="disabled" />}
              label={canEdit ? t('Button_Edit_Tooltip') : t('Button_Edit_Tooltip_NoPermissions')}
              onClick={() => handleEdit(params.row)}
              showInMenu={false}
              disabled={!canEdit}
            />
          </span>
        </Tooltip>,
        <Tooltip
          key="delete"
          title={canDelete ? t('Button_Delete_Tooltip') : t('Button_Delete_Tooltip_NoPermissions')}
        >
          <span>
            <GridActionsCellItem
              icon={canDelete ? <DeleteIcon color="error" /> : <BlockIcon color="disabled" />}
              label={canDelete ? t('Button_Delete_Tooltip') : t('Button_Delete_Tooltip_NoPermissions')}
              onClick={() => handleDeleteClick(params.row)}
              showInMenu={false}
              disabled={!canDelete}
            />
          </span>
        </Tooltip>,
      ],
    },
  ];

  return (
    <Box >
        
      {/* Title and Subtitle Container */}
      <Box sx={{ mb: 3, mt: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: '#1e3a5f', fontWeight: 600 }}
        >
          {t('CompaniesListPage_Title')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          {t('CompaniesListPage_Subtitle')}
        </Typography>
      </Box>

      {/* Search and Action Buttons Container */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <TextField
          placeholder={t('Label_SearchPlaceholder')}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          size="small"
          sx={{ 
            flexGrow: 1, 
            minWidth: 300,
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#ffffff',
              '&:hover': {
                backgroundColor: '#ffffff',
              },
              '&.Mui-focused': {
                backgroundColor: '#ffffff',
              },
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
            endAdornment: searchText && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {searchText && (
            <Tooltip title={t('Button_ClearSearch_Tooltip')}>
              <Button
                variant="outlined"
                onClick={handleClearSearch}
                startIcon={<ClearIcon />}
              >
                {t('Button_ClearSearch')}
              </Button>
            </Tooltip>
          )}
          <Tooltip title={canNew ? t('Button_New_Tooltip') : t('Button_New_Tooltip_NoPermissions')}>
            <span>
              <Button
                variant="contained"
                onClick={handleNew}
                disabled={!canNew}
                startIcon={canNew ? <AddIcon /> : <BlockIcon />}
                sx={{ backgroundColor: '#04aa6d', '&:hover': { backgroundColor: '#038a5a' } }}
              >
                {t('Button_New')}
              </Button>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {/* Data Grid Container */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' ,height: 'calc(100vh - 300px)', width: '100%' }}>
        <DataGrid
          rows={filteredCompanies}
          columns={columns}
          loading={loading}
          pageSizeOptions={pageSizeOptions}
          pagination
          paginationModel={{ page: 0, pageSize }}
          onPaginationModelChange={(model) => setPageSize(model.pageSize)}
          disableRowSelectionOnClick
          disableColumnMenu={false}
          initialState={{
            sorting: {
              sortModel: [{ field: 'nameTranslationKey', sort: 'asc' }],
            },
          }}
          onColumnResize={undefined}
          sx={{
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f5f5f5',
              '& .MuiDataGrid-columnHeaderTitle': {
                fontWeight: 600,
                color: '#1e3a5f',
              },
            },
            '& .MuiDataGrid-cell': {
              borderColor: 'rgba(0, 0, 0, 0.12)',
            },
            '& .MuiDataGrid-row:hover': {
              backgroundColor: 'rgba(30, 58, 95, 0.04)',
            },
            '& .MuiDataGrid-actionsCell': {
              '& .MuiIconButton-root': {
                padding: '8px',
              },
            },
          }}
          localeText={localeText}
          slots={{
            toolbar: GridToolbar,
          }}
          slotProps={{
            toolbar: {
              showQuickFilter: false,
            },
          }}
        />
      </Paper>
   
      {/* Delete Confirmation Dialog */}
      <ConfirmDeletionDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setSelectedCompany(null);
        }}
        onConfirm={() => selectedCompany && handleDelete(selectedCompany)}
        recordName={selectedCompany?.nameTranslationValue || ''}
      />
    </Box>
  );
};

export default CompaniesListPage;

