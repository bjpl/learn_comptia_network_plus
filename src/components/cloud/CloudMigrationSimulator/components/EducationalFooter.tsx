import React from 'react';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';

export const EducationalFooter: React.FC = () => (
  <div style={{ marginTop: '32px' }}>
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
  </div>
);
