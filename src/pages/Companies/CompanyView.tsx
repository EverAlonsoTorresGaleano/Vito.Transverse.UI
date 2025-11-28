import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
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
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { createAuthenticatedApiClient } from '../../api/client';
import type { CompanyDTO } from '../../api/vito-transverse-identity-api';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { getCultureId, getCultureName } from '../../utils/culture';

const CompanyView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState<CompanyDTO | null>(null);

  const { register } = useForm<CompanyDTO>({
    defaultValues: {} as CompanyDTO,
  });

  useEffect(() => {
    const loadCompany = async () => {
      if (!id) {
        toast.error(t('Error_InvalidRecordId'));
        navigate('/companies');
        return;
      }

      setLoading(true);
      try {
        const client = createAuthenticatedApiClient();
        const data = await client.getApiCompaniesV1(Number(id));
        setCompany(data);
      } catch (error) {
        console.error(t('Error_LoadingRecord'), error);
        toast.error(t('Error_LoadingRecord'));
        navigate('/companies');
      } finally {
        setLoading(false);
      }
    };

    loadCompany();
  }, [id, t, navigate]);

  const handleEdit = () => {
    if (id) {
      navigate(`/companies/${id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/companies');
  };

  if (loading) {
    return <Loading />;
  }

  if (!company) {
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
          {t('CompanyView_Title')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          {t('ViewRecord_Subtitle')}
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
        <Tooltip title={t('Button_Edit_Tooltip')}>
          <Button
            variant="contained"
            onClick={handleEdit}
            startIcon={<EditIcon />}
            sx={{
              backgroundColor: '#1e3a5f',
              '&:hover': {
                backgroundColor: '#152a47',
              },
            }}
          >
            {t('Button_Edit')}
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label={t('Label_Id')}
              value={company.id || ''}
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
            <TextField
              fullWidth
              label={t('Label_Subdomain')}
              value={company.subdomain || ''}
              disabled
              {...register('subdomain')}
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
              label={t('Label_Email')}
              value={company.email || ''}
              disabled
              {...register('email')}
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
              label={t('Label_DefaultCultureFk')}
              value={company.defaultCultureNameTranslationKey ? t(company.defaultCultureNameTranslationKey) : ''}
              disabled
              {...register('defaultCultureFk')}
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
              label={t('Label_CountryFk')}
              value={company.countryNameTranslationKey ? t(company.countryNameTranslationKey) : ''}
              disabled
              {...register('countryFk')}
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
              label={t('Label_NameTranslationValue', {cultureName: getCultureName()})}
              value={company.nameTranslationValue ? t(company.nameTranslationValue, {cultureName: getCultureName()}) : ''}
              disabled
              {...register('nameTranslationValue')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label={t('Label_DescriptionTranslationValue', {cultureName: getCultureName()})}
              value={company.descriptionTranslationValue ? t(company.descriptionTranslationValue, {cultureName: getCultureName()}) : ''}
              disabled
              {...register('descriptionTranslationValue')}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={company.isActive || false}
                  disabled
                  {...register('isActive')}
                />
              }
              label={t('Label_IsActive')}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={company.isSystemCompany || false}
                  disabled
                  {...register('isSystemCompany')}
                />
              }
              label={t('Label_IsSystemCompany')}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default CompanyView;

