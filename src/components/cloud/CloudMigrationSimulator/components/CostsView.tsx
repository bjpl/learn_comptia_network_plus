import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import {
  Cloud as CloudIcon,
  Storage as StorageIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import { calculateSavingsPercent, getCostPercentage } from '../utils/calculationHelpers';
import type { CostModel } from '../../../../data/migration-data';

interface CostsViewProps {
  customCostModel: CostModel;
  onCostUpdate: (category: 'onPremise' | 'cloud', field: string, value: number) => void;
  onPremTotal: number;
  cloudTotal: number;
  savings: number;
}

export const CostsView: React.FC<CostsViewProps> = ({
  customCostModel,
  onCostUpdate,
  onPremTotal,
  cloudTotal,
  savings,
}) => {
  const savingsPercent = calculateSavingsPercent(savings, onPremTotal);

  return (
    <div className="migration-costs-view">
      <Typography variant="h5" gutterBottom>
        Cost Comparison: TCO Calculator
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Compare on-premises Total Cost of Ownership (TCO) vs. cloud costs over 3 years.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <StorageIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                On-Premises Costs
              </Typography>
              <div style={{ marginBottom: '16px' }}>
                {Object.entries(customCostModel.onPremise).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '16px' }}>
                    <TextField
                      fullWidth
                      size="small"
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      type="number"
                      value={value}
                      onChange={(e) => onCostUpdate('onPremise', key, Number(e.target.value))}
                      InputProps={{
                        startAdornment: <MoneyIcon fontSize="small" sx={{ mr: 1 }} />,
                      }}
                    />
                  </div>
                ))}
              </div>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="primary">
                Total: ${onPremTotal.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <CloudIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
                Cloud Costs
              </Typography>
              <div style={{ marginBottom: '16px' }}>
                {Object.entries(customCostModel.cloud).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '16px' }}>
                    <TextField
                      fullWidth
                      size="small"
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      type="number"
                      value={value}
                      onChange={(e) => onCostUpdate('cloud', key, Number(e.target.value))}
                      InputProps={{
                        startAdornment: <MoneyIcon fontSize="small" sx={{ mr: 1 }} />,
                      }}
                    />
                  </div>
                ))}
              </div>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6" color="success.main">
                Total: ${cloudTotal.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{ bgcolor: savings > 0 ? 'success.light' : 'error.light' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {savings > 0 ? 'Estimated Savings' : 'Additional Cost'}
              </Typography>
              <Typography variant="h3" color={savings > 0 ? 'success.dark' : 'error.dark'}>
                ${Math.abs(savings).toLocaleString()} ({Math.abs(savingsPercent)}%)
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {savings > 0
                  ? `Migrating to cloud could save ${savingsPercent}% over 3 years`
                  : `Cloud migration would cost ${Math.abs(savingsPercent)}% more over 3 years`}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Cost Breakdown Comparison
              </Typography>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{ flex: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    On-Premises
                  </Typography>
                  {Object.entries(customCostModel.onPremise).map(([key, value]) => {
                    const percent = getCostPercentage(value, onPremTotal);
                    return (
                      <div key={key} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">{key}</Typography>
                          <Typography variant="caption">{percent.toFixed(1)}%</Typography>
                        </div>
                        <LinearProgress variant="determinate" value={percent} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ flex: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Cloud
                  </Typography>
                  {Object.entries(customCostModel.cloud).map(([key, value]) => {
                    const percent = getCostPercentage(value, cloudTotal);
                    return (
                      <div key={key} style={{ marginBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="caption">{key}</Typography>
                          <Typography variant="caption">{percent.toFixed(1)}%</Typography>
                        </div>
                        <LinearProgress variant="determinate" value={percent} color="success" />
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};
