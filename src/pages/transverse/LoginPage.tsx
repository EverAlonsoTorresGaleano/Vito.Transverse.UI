import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Container,
  Tooltip,
  Avatar,
} from '@mui/material';
import { toast } from 'react-toastify';
import { createApiClient } from '../../api/client';
import { setToken } from '../../utils/auth';
import { setCulture, getCultureId } from '../../utils/culture';
import { env } from '../../config/env';
import { changeLanguage } from '../../i18n/config';
import type { ListItemDTO, TokenRequestDTO } from '../../api/vito-transverse-identity-api';
import { Login } from '@mui/icons-material';
import { createFormSubmitHandler } from '../../utils/validations';

interface LoginFormData {
  userName: string;
  password: string;
  companyId: string;
  cultureId: string;
}

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<ListItemDTO[]>([]);
  const [cultures, setCultures] = useState<ListItemDTO[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<LoginFormData>({
    defaultValues: {
      userName: '',
      password: '',
      companyId: '',
      cultureId: getCultureId(),
    },
    mode: 'onBlur',
    reValidateMode: 'onBlur',
  });

  const selectedCulture = watch('cultureId');

  useEffect(() => {
    const loadData = async () => {
      try {
        const client = createApiClient();
        const [companiesData, culturesData] = await Promise.all([
          client.getApiCompaniesV1DropdownWithGuid(),
          client.getApiMasterV1CulturesActiveDropDown(),
        ]);

        setCompanies(companiesData);
        setCultures(culturesData);
        setLoadingData(false);
      } catch (error) {
        console.error('Error loading data:', error);
        toast.error('Error loading form data');
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const loadTranslations = async () => {
      if (selectedCulture) {
        try {
          await changeLanguage(selectedCulture);
          setCulture(selectedCulture);
        } catch (error) {
          console.error('Error loading translations:', error);
        }
      }
    };

    loadTranslations();
  }, [selectedCulture]);

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      const client = createApiClient();
      
      const tokenRequest: TokenRequestDTO = {
        grant_type: 'ClientCredentials',
        application_id: env.APPLICATION_ID,
        application_secret: env.APPLICATION_SECRET,
        company_id: data.companyId,
        user_id: data.userName,
        user_secret: data.password,
      };

      const response = await client.postApiOauth2V1Token(tokenRequest);
      
      if (response.access_token) {
        setToken(response.access_token);
        setCulture(data.cultureId);
        toast.success(t('Security_LoginSuccess'));
        navigate('/dashboard');
      } else {
        toast.error(t('Login_Error'));
      }
    } catch (error: any) {
      console.error('Login error:', error);
      let errorMessage = t('Login_Error');
      if (error?.message) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = createFormSubmitHandler(
    handleSubmit,
    onSubmit,
    t,
    {
      getFieldLabel: (key: string, t: TFunction) => {
        const fieldLabelMap: Record<string, string> = {
          userName: t('Label_UserName'),
          password: t('Label_Password'),
          companyId: t('Label_Company'),
          cultureId: t('Label_Language'),
        };
        return fieldLabelMap[key] || t('Label_' + key[0].toUpperCase() + key.slice(1));
      },
    }
  );

  if (loadingData) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%)',
        padding: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 1, color: '#1e3a5f', fontWeight: 600 }}>
            {t('Login_Title')}
          </Typography>
          <Typography variant="subtitle1" align="center" sx={{ mb: 4, color: '#666666' }}>
            {t('Login_Subtitle')}
          </Typography>

          <form onSubmit={handleFormSubmit}>
            <Controller
              name="userName"
              control={control}
              rules={{
                required: t('Validation_Input_Required'),
                minLength: {
                  value: 3,
                  message: t('Validation_Input_MinLength', { min: 3 }),
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label={t('Label_UserName')}
                  placeholder={t('Validation_Input_Placeholder', { field: t('Label_UserName') })}
                  error={!!errors.userName}
                  helperText={errors.userName?.message}
                  margin="normal"
                  disabled={loading}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: t('Validation_Input_Required'),
                minLength: {
                  value: 3,
                  message: t('Validation_Input_MinLength', { min: 3 }),
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  type="password"
                  label={t('Label_Password')}
                  placeholder={t('Validation_Input_Placeholder', { field: t('Label_Password') })}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  margin="normal"
                  disabled={loading}
                />
              )}
            />

            <Controller
              name="companyId"
              control={control}
              rules={{ required: t('Validation_DropDown_Required') }}
              render={({ field }) => (
                <FormControl fullWidth margin="normal" error={!!errors.companyId}>
                  <InputLabel>{t('Label_Company')}</InputLabel>
                  <Select
                    {...field}
                    label={t('Label_Company')}
                    disabled={loading}
                  >
                    <MenuItem value="">
                      <em>{t('DropDown_SelectOption')}</em>
                    </MenuItem>
                    {companies.map((company) => (
                      <MenuItem key={company.id} value={company.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Avatar
                                src={`${company.id}`}
                                alt={company.nameTranslationKey ? t(company.nameTranslationKey) : company.id}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Typography>
                                {company.nameTranslationKey ? t(company.nameTranslationKey) : company.id}
                              </Typography>
                            </Box>
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.companyId && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                      {errors.companyId.message}
                    </Typography>
                  )}
                </FormControl>
              )}
            />

            <Controller
              name="cultureId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth margin="normal">
                  <InputLabel>{t('Label_Language')}</InputLabel>
                  <Select
                    {...field}
                    label={t('Label_Language')}
                    disabled={loading}
                  >
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
                </FormControl>
              )}
            />

            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
             <Tooltip title={t('Button_Login_Tooltip')} >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Login />}
                title={t('Button_Login_Tooltip')}
              >
                {loading ? t('Button_LoggingIn') : t('Button_Login')}
              </Button>
              </Tooltip>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default LoginPage;

