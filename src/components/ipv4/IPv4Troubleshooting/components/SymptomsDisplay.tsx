/**
 * Symptoms display component
 */

import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Grid,
} from '@mui/material';
import { Error } from '@mui/icons-material';

interface SymptomsDisplayProps {
  symptoms: string[];
  expectedBehavior: string;
  actualBehavior: string;
}

export const SymptomsDisplay: React.FC<SymptomsDisplayProps> = ({
  symptoms,
  expectedBehavior,
  actualBehavior,
}) => {
  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Observed Symptoms
        </Typography>
        <List dense>
          {symptoms.map((symptom, index) => (
            <ListItem key={index}>
              <Error color="error" sx={{ mr: 1 }} fontSize="small" />
              <ListItemText primary={symptom} />
            </ListItem>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="success.main" gutterBottom>
              Expected Behavior:
            </Typography>
            <Typography variant="body2" className="text-gray-800 dark:text-gray-200">
              {expectedBehavior}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="subtitle2" color="error.main" gutterBottom>
              Actual Behavior:
            </Typography>
            <Typography variant="body2" className="text-gray-800 dark:text-gray-200">
              {actualBehavior}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
