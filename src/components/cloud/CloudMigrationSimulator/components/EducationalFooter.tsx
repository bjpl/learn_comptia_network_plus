import React from 'react';
import { Box, Alert, Typography } from '@mui/material';

export const EducationalFooter: React.FC = () => (
  <Box mt={4}>
    <Alert severity="info">
      <Typography variant="subtitle2" gutterBottom>
        About Cloud Migration
      </Typography>
      <Typography variant="body2">
        The 6 R&apos;s framework provides a systematic approach to cloud migration. Each strategy
        has different complexity, cost, and timeline implications. Consider your application
        requirements, business goals, and organizational readiness when selecting a strategy. Most
        organizations use a combination of strategies across their application portfolio.
      </Typography>
    </Alert>
  </Box>
);
