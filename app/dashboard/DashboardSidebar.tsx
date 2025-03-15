import React from 'react';
import { Box, Typography } from '@mui/material';

const DashboardSidebar: React.FC = () => {
  return (
    <Box sx={{ p: 2, borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <Typography variant="h6" color="white" sx={{ fontWeight: 'bold' }}>
        Trajectory Admin
      </Typography>
    </Box>
  );
};

export default DashboardSidebar; 