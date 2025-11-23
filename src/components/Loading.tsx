import React from 'react';
import { Box, CircularProgress } from '@mui/material';

const Loading: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <CircularProgress sx={{ color: '#1e3a5f' }} />
    </Box>
  );
};

export default Loading;

