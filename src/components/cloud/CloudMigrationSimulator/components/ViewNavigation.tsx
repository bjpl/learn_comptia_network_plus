import React from 'react';
import { Box, Button } from '@mui/material';
import {
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Timeline as TimelineIcon,
  AttachMoney as MoneyIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';
import type { ViewType } from '../types';

interface ViewNavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const ViewNavigation: React.FC<ViewNavigationProps> = ({ currentView, onViewChange }) => (
  <Box mb={3} display="flex" gap={1} flexWrap="wrap">
    <Button
      variant={currentView === 'overview' ? 'contained' : 'outlined'}
      onClick={() => onViewChange('overview')}
      startIcon={<AssessmentIcon />}
    >
      Overview
    </Button>
    <Button
      variant={currentView === 'strategy' ? 'contained' : 'outlined'}
      onClick={() => onViewChange('strategy')}
      startIcon={<SettingsIcon />}
    >
      Strategies
    </Button>
    <Button
      variant={currentView === 'phases' ? 'contained' : 'outlined'}
      onClick={() => onViewChange('phases')}
      startIcon={<TimelineIcon />}
    >
      Phases
    </Button>
    <Button
      variant={currentView === 'costs' ? 'contained' : 'outlined'}
      onClick={() => onViewChange('costs')}
      startIcon={<MoneyIcon />}
    >
      Costs
    </Button>
    <Button
      variant={currentView === 'risks' ? 'contained' : 'outlined'}
      onClick={() => onViewChange('risks')}
      startIcon={<WarningIcon />}
    >
      Risks
    </Button>
    <Button
      variant={currentView === 'timeline' ? 'contained' : 'outlined'}
      onClick={() => onViewChange('timeline')}
      startIcon={<TimelineIcon />}
    >
      Timeline
    </Button>
  </Box>
);
