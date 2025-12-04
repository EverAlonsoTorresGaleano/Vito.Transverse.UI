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
  InputAdornment,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  ContentCopy as ContentCopyIcon,
} from '@mui/icons-material';
import { createAuthenticatedApiClient } from '../../api/client';
import type { ApplicationDTO } from '../../api/vito-transverse-identity-api';
import { toast } from 'react-toastify';
import Loading from '../../components/Loading';
import { getCultureName } from '../../utils/culture';

const ApplicationView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<ApplicationDTO | null>(null);

  const { register } = useForm<ApplicationDTO>({
    defaultValues: {} as ApplicationDTO,
  });

  useEffect(() => {
    const loadApplication = async () => {
      if (!id) {
        toast.error(t('Error_InvalidRecordId'));
        navigate('/applications');
        return;
      }

      setLoading(true);
      try {
        const client = createAuthenticatedApiClient();
        const data = await client.getApiApplicationsV1(Number(id));
        setApplication(data);
      } catch (error) {
        console.error(t('Error_LoadingRecord'), error);
        toast.error(t('Error_LoadingRecord'));
        navigate('/applications');
      } finally {
        setLoading(false);
      }
    };

    loadApplication();
  }, [id, t, navigate]);

  const handleEdit = () => {
    if (id) {
      navigate(`/applications/${id}/edit`);
    }
  };

  const handleBack = () => {
    navigate('/applications');
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('Success_CopiedToClipboard') || 'Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error(t('Error_CopyToClipboard') || 'Failed to copy to clipboard');
    }
  };

  if (loading) {
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
          {t('ApplicationView_Title')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          {t('ApplicationView_Subtitle')}
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
            <TextField
              fullWidth
              label={t('Label_NameTranslationValue',{cultureName: getCultureName()})}
              value={application.nameTranslationValue ? t(application.nameTranslationValue) : ''}
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
              label={t('Label_DescriptionTranslationValue',{cultureName: getCultureName()})}
              value={application.descriptionTranslationValue ? t(application.descriptionTranslationValue) : ''}
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
            <TextField
              fullWidth
              label={t('Label_ApplicationClient')}
              value={application.applicationClient || ''}
              disabled
              {...register('applicationClient')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={t('Button_Copy_Tooltip') || 'Copy'}>
                      <IconButton
                        onClick={() => handleCopy(application.applicationClient || '')}
                        edge="end"
                        size="small"
                        sx={{ color: '#1e3a5f' }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
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
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={t('Button_Copy_Tooltip') || 'Copy'}>
                      <IconButton
                        onClick={() => handleCopy(application.applicationSecret || '')}
                        edge="end"
                        size="small"
                        sx={{ color: '#1e3a5f' }}
                      >
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
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
              label={t('Label_OwnerFk')}
              value={application.applicationOwnerNameTranslationKey ? t(application.applicationOwnerNameTranslationKey) : ''}
              disabled
              {...register('ownerFk')}
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
              label={t('Label_ApplicationLicenseTypeFk')}
              value={application.applicationLicenseTypeNameTranslationKey ? t(application.applicationLicenseTypeNameTranslationKey) : ''}
              disabled
              {...register('applicationLicenseTypeFk')}
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
                  checked={application.isActive || false}
                  disabled
                  {...register('isActive')}
                />
              }
              label={t('Label_IsActive')}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ApplicationView;

