import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Tooltip,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Avatar,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
} from '@mui/icons-material';
import { createAuthenticatedApiClient } from '../../api/client';
import type { ApplicationDTO, ListItemDTO } from '../../api/vito-transverse-identity-api';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { createFormSubmitHandler } from '../../utils/validations';
import { getCultureName } from '../../utils/culture';

const ApplicationEdit: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [users, setUsers] = useState<ListItemDTO[]>([]);
  const [licenseTypes, setLicenseTypes] = useState<ListItemDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [application, setApplication] = useState<ApplicationDTO | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ApplicationDTO>({
    defaultValues: {} as Partial<ApplicationDTO>,
  });

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        toast.error(t('Error_InvalidRecordId'));
        navigate('/applications');
        return;
      }

      setInitialLoading(true);
      try {
        const client = createAuthenticatedApiClient();
        const [applicationData, usersData, licenseTypesData] = await Promise.all([
          client.getApiApplicationsV1(Number(id)),
          client.getApiCompaniesV1Dropdown(),
          client.getApiApplicationsV1LicensetypesDropdown(),
        ]);
        setApplication(applicationData);
        setUsers(usersData);
        setLicenseTypes(licenseTypesData);
        reset(applicationData);
      } catch (error) {
        console.error(t('Error_LoadingRecord'), error);
        toast.error(t('Error_LoadingRecord'));
        navigate('/applications');
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id, t, navigate, reset]);

  const onSubmit = async (data: ApplicationDTO) => {
    setLoading(true);
    try {
      const client = createAuthenticatedApiClient();
      await client.putApiApplicationsV1(data);
      toast.success(t('Success_RecordUpdated'));
      navigate('/applications');
    } catch (error: any) {
      console.error(t('Error_UpdatingRecord'), error);
      
      // Show error summary with toast
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([key, value]: [string, any]) => `${t('Label_' + key)}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
          toast.error(`${t('Error_UpdatingRecord')}\n${errorMessages}`);
        } else {
          toast.error(t('Error_UpdatingRecord'));
        }
      } else {
        toast.error(t('Error_UpdatingRecord'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = createFormSubmitHandler(handleSubmit, onSubmit, t);

  const handleBack = () => {
    navigate('/applications');
  };

  const getSelectedUser = (userId: number | undefined) => {
    if (!userId) return undefined;
    return users.find((u) => u.id === userId.toString());
  };

  const getSelectedLicenseType = (licenseTypeId: number | undefined) => {
    if (!licenseTypeId) return undefined;
    return licenseTypes.find((lt) => lt.id === licenseTypeId.toString());
  };

  if (initialLoading) {
    return <Loading />;
  }

  if (!application) {
    return null;
  }

  return (
    <Box>
      {/* Title and Subtitle Container */}
      <Box sx={{ mb: 3, mt: 3 }}>
        <Typography
          variant="h4"
          component="h1"
          gutterBottom
          sx={{ color: '#1e3a5f', fontWeight: 600 }}
        >
          {t('ApplicationEdit_Title')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          {t('ApplicationEdit_Subtitle')}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'flex-end' }}>
        <Tooltip title={t('Button_Back_Tooltip')}>
          <Button
            variant="outlined"
            onClick={handleBack}
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: '#1e3a5f',
              color: '#1e3a5f',
              '&:hover': {
                borderColor: '#1e3a5f',
                backgroundColor: 'rgba(30, 58, 95, 0.04)',
              },
            }}
          >
            {t('Button_Back')}
          </Button>
        </Tooltip>
        <Tooltip title={t('Button_Save_Tooltip')}>
          <Button
            variant="contained"
            onClick={handleFormSubmit}
            startIcon={<SaveIcon />}
            disabled={loading}
            sx={{
              backgroundColor: '#1e3a5f',
              '&:hover': {
                backgroundColor: '#152a47',
              },
            }}
          >
            {t('Button_Save')}
          </Button>
        </Tooltip>
      </Box>

      {/* Form Container */}
      <Paper
        elevation={2}
        sx={{
          borderRadius: 2,
          p: 3,
          backgroundColor: '#ffffff',
        }}
      >
        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('Label_Id')}
                value={application.id || ''}
                disabled
                {...register('id')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#f5f5f5',
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="nameTranslationValue"
                control={control}
                rules={{ required: t('Validation_Input_Required') }}
                render={({ field }) => {
                  const displayValue = field.value ? t(field.value) : '';
                  return (
                    <TextField
                      fullWidth
                      label={t('Label_NameTranslationValue',{cultureName: getCultureName()})}
                      placeholder={t('Validation_Input_Placeholder', { field: t('Label_NameTranslationValue',{cultureName: getCultureName()}) })}
                      error={!!errors.nameTranslationValue}
                      helperText={errors.nameTranslationValue?.message}
                      value={displayValue}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      sx={{
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
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Controller
                name="descriptionTranslationValue"
                control={control}
                render={({ field }) => {
                  const displayValue = field.value ? t(field.value) : '';
                  return (
                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label={t('Label_DescriptionTranslationValue',{cultureName: getCultureName()})}
                      placeholder={t('Validation_Input_Placeholder', { field: t('Label_DescriptionTranslationValue',{cultureName: getCultureName()}) })}
                      error={!!errors.descriptionTranslationValue}
                      helperText={errors.descriptionTranslationValue?.message}
                      value={t(displayValue)}
                      onChange={(e) => {
                        field.onChange(e.target.value);
                      }}
                      sx={{
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
                    />
                  );
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('Label_ApplicationClient')}
              value={application.applicationClient || ''}
              disabled
              {...register('applicationClient')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('Label_ApplicationSecret')}
              value={application.applicationSecret || ''}
              disabled
              {...register('applicationSecret')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.ownerFk}>
                <InputLabel>{t('Label_OwnerFk')}</InputLabel>
                <Controller
                  name="ownerFk"
                  control={control}
                  rules={{ required: t('Validation_DropDown_Required') }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label={t('Label_OwnerFk')}
                      value={field.value ? field.value.toString() : ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      renderValue={(value) => {
                        if (!value) return t('DropDown_SelectOption');
                        const user = getSelectedUser(Number(value));
                        if (!user) return value;
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={user.id}
                              alt={user.nameTranslationKey ? t(user.nameTranslationKey) : user.id}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography>
                              {user.nameTranslationKey ? t(user.nameTranslationKey) : user.id}
                            </Typography>
                          </Box>
                        );
                      }}
                      sx={{
                        backgroundColor: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#ffffff',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                        },
                      }}
                    >
                      <MenuItem value="">{t('DropDown_SelectOption')}</MenuItem>
                      {users.map((user) => (
                        <MenuItem key={user.id} value={user.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={user.id}
                              alt={user.nameTranslationKey ? t(user.nameTranslationKey) : user.id}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography>
                              {user.nameTranslationKey ? t(user.nameTranslationKey) : user.id}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.ownerFk && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.ownerFk.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.applicationLicenseTypeFk}>
                <InputLabel>{t('Label_ApplicationLicenseTypeFk')}</InputLabel>
                <Controller
                  name="applicationLicenseTypeFk"
                  control={control}
                  rules={{ required: t('Validation_DropDown_Required') }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label={t('Label_ApplicationLicenseTypeFk')}
                      value={field.value ? field.value.toString() : ''}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      renderValue={(value) => {
                        if (!value) return t('DropDown_SelectOption');
                        const licenseType = getSelectedLicenseType(Number(value));
                        if (!licenseType) return value;
                        return (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={licenseType.id}
                              alt={licenseType.nameTranslationKey ? t(licenseType.nameTranslationKey) : licenseType.id}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography>
                              {licenseType.nameTranslationKey ? t(licenseType.nameTranslationKey) : licenseType.id}
                            </Typography>
                          </Box>
                        );
                      }}
                      sx={{
                        backgroundColor: '#ffffff',
                        '&:hover': {
                          backgroundColor: '#ffffff',
                        },
                        '&.Mui-focused': {
                          backgroundColor: '#ffffff',
                        },
                      }}
                    >
                      <MenuItem value="">{t('DropDown_SelectOption')}</MenuItem>
                      {licenseTypes.map((licenseType) => (
                        <MenuItem key={licenseType.id} value={licenseType.id}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar
                              src={licenseType.id}
                              alt={licenseType.nameTranslationKey ? t(licenseType.nameTranslationKey) : licenseType.id}
                              sx={{ width: 24, height: 24 }}
                            />
                            <Typography>
                              {licenseType.nameTranslationKey ? t(licenseType.nameTranslationKey) : licenseType.id}
                            </Typography>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.applicationLicenseTypeFk && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.applicationLicenseTypeFk.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register('isActive')}
                    checked={application.isActive || false}
                    sx={{
                      color: '#1e3a5f',
                      '&.Mui-checked': {
                        color: '#1e3a5f',
                      },
                    }}
                  />
                }
                label={t('Label_IsActive')}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default ApplicationEdit;

