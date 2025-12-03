import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import type { CompanyDTO, ListItemDTO } from '../../api/vito-transverse-identity-api';
import { toast } from 'react-toastify';
import { getCultureName } from '../../utils/culture';
import { createFormSubmitHandler } from '../../utils/validations';

const CompanyCreate: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cultures, setCultures] = useState<ListItemDTO[]>([]);
  const [countries, setCountries] = useState<ListItemDTO[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompanyDTO>({
    defaultValues: {
      isActive: true,
      isSystemCompany: false,
    } as Partial<CompanyDTO>,
  });

  useEffect(() => {
    const loadDropdowns = async () => {
      try {
        const client = createAuthenticatedApiClient();
        const [culturesData, countriesData] = await Promise.all([
          client.getApiMasterV1CulturesActiveDropDown(),
          client.getApiMasterV1CountriesDropdown(),
        ]);
        setCultures(culturesData);
        setCountries(countriesData);
      } catch (error) {
        console.error('Error loading dropdowns:', error);
        toast.error(t('Error_LoadingDropdowns'));
      }
    };

    loadDropdowns();
  }, [t]);

  const onSubmit = async (data: CompanyDTO) => {
    setLoading(true);
    try {
      const client = createAuthenticatedApiClient();
      await client.postApiCompaniesV1(data);
      toast.success(t('Success_RecordCreated'));
      navigate('/companies');
    } catch (error: any) {
      console.error(t('Error_CreatingRecord'), error);
      
      // Show error summary with toast
      if (error?.response?.data) {
        const errorData = error.response.data;
        if (errorData.errors) {
          const errorMessages = Object.entries(errorData.errors)
            .map(([key, value]: [string, any]) => `${t('Label_' + key)}: ${Array.isArray(value) ? value.join(', ') : value}`)
            .join('\n');
          toast.error(`${t('Error_CreatingRecord')}\n${errorMessages}`);
        } else {
          toast.error(t('Error_CreatingRecord'));
        }
      } else {
        toast.error(t('Error_CreatingRecord'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = createFormSubmitHandler(handleSubmit, onSubmit, t);

  const handleBack = () => {
    navigate('/companies');
  };

  const getSelectedCountry = (countryId: string | undefined) => {
    return countries.find((c) => c.id === countryId);
  };


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
          {t('CompanyCreate_Title')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          {t('CreateRecord_Subtitle')}
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
                label={t('Label_Subdomain')}
                placeholder={t('Validation_Input_Placeholder', { field: t('Label_Subdomain') })}
                error={!!errors.subdomain}
                helperText={errors.subdomain?.message}
                {...register('subdomain', {
                  required: t('Validation_Input_Required'),
                })}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('Label_Email')}
                type="email"
                placeholder={t('Validation_Input_Placeholder', { field: t('Label_Email') })}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                  required: t('Validation_Input_Required'),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t('Validation_Email_Invalid'),
                  },
                })}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.defaultCultureFk}>
                <InputLabel>{t('Label_DefaultCultureFk')}</InputLabel>
                <Controller
                  name="defaultCultureFk"
                  control={control}
                  rules={{ required: t('Validation_DropDown_Required') }}
                  render={({ field }) => (
                    <Select
                      {...field}
                      label={t('Label_DefaultCultureFk')}
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
                      {cultures.map((culture) => (
                        <MenuItem key={culture.id} value={culture.id}>
                           <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={`${culture.id}`}
                                alt={culture.nameTranslationKey ? t(culture.nameTranslationKey) : culture.id}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Typography>
                              {culture.nameTranslationKey ? t(culture.nameTranslationKey) : culture.id}
                              </Typography>
                            </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.defaultCultureFk && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.defaultCultureFk.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.countryFk}>
                <InputLabel>{t('Label_CountryFk')}</InputLabel>
                <Controller
                  name="countryFk"
                  control={control}
                  rules={{ required: t('Validation_DropDown_Required') }}
                  render={({ field }) => (
                      <Select
                        {...field}
                        label={t('Label_CountryFk')}
                        renderValue={(value) => {
                          if (!value) return t('DropDown_SelectOption');
                          const country = getSelectedCountry(value);
                          if (!country) return value;
                          return (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={`${import.meta.env.VITE_API_BASE_URL}/api/Media/v1/Pictures/ByName/${country.id}.png`}
                                alt={country.nameTranslationKey ? t(country.nameTranslationKey) : country.id}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Typography>
                                {country.nameTranslationKey ? t(country.nameTranslationKey) : country.id}
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
                        {countries.map((country) => (
                          <MenuItem key={country.id} value={country.id}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={`${import.meta.env.VITE_API_BASE_URL}/api/Media/v1/Pictures/ByName/${country.id}.png`}
                                alt={country.nameTranslationKey ? t(country.nameTranslationKey) : country.id}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Typography>
                                {country.nameTranslationKey ? t(country.nameTranslationKey) : country.id}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                />
                {errors.countryFk && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.countryFk.message}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t('Label_NameTranslationValue',{cultureName: getCultureName()})}
                placeholder={t('Validation_Input_Placeholder', { field: t('Label_NameTranslationValue',{cultureName:getCultureName()}) })}
                error={!!errors.nameTranslationValue}
                helperText={errors.nameTranslationValue?.message}
                {...register('nameTranslationValue', {
                  required: t('Validation_Input_Required'),
                })}
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
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label={t('Label_DescriptionTranslationValue',{cultureName: getCultureName()})}
                placeholder={t('Validation_Input_Placeholder', { field: t('Label_DescriptionTranslationValue',{cultureName: getCultureName()}) })}
                error={!!errors.descriptionTranslationValue}
                helperText={errors.descriptionTranslationValue?.message}
                {...register('descriptionTranslationValue')}
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
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={true}
                    {...register('isActive')}
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
            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={false}
                    {...register('isSystemCompany')}
                    sx={{
                      color: '#1e3a5f',
                      '&.Mui-checked': {
                        color: '#1e3a5f',
                      },
                    }}
                  />
                }
                label={t('Label_IsSystemCompany')}
              />
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CompanyCreate;

