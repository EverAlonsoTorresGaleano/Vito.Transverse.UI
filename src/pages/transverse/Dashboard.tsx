import React from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Typography, Paper } from '@mui/material';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#1e3a5f', fontWeight: 600 }}>
          {t('Dashboard_Title')}
        </Typography>
        <Typography variant="body1" sx={{ color: '#666666' }}>
          {t('Dashboard_Welcome')}
        </Typography>
      </Paper>
    </Box>
  );
};

export default Dashboard;

