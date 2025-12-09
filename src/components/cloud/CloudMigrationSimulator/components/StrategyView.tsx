import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  ExpandMore as ExpandMoreIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { migrationStrategies } from '../../../../data/migration-data';

interface StrategyViewProps {
  selectedStrategy: string;
  onStrategySelect: (strategyId: string) => void;
}

export const StrategyView: React.FC<StrategyViewProps> = ({
  selectedStrategy,
  onStrategySelect,
}) => (
  <Box className="migration-strategy-view">
    <Typography variant="h5" gutterBottom>
      Migration Strategies: The 6 R&apos;s
    </Typography>
    <Typography variant="body2" color="text.secondary" paragraph>
      Choose the right migration strategy based on your application requirements, timeline, and
      goals.
    </Typography>

    <Grid container spacing={3}>
      {migrationStrategies.map((strat) => (
        <Grid item xs={12} md={6} key={strat.id}>
          <Card
            className={`strategy-card ${selectedStrategy === strat.id ? 'selected' : ''}`}
            onClick={() => onStrategySelect(strat.id)}
            sx={{ cursor: 'pointer', height: '100%' }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Typography variant="h2" component="span">
                  {strat.icon}
                </Typography>
                <Box>
                  <Typography variant="h6">{strat.name}</Typography>
                  <Box display="flex" gap={1} mt={0.5}>
                    <Chip label={`Complexity: ${strat.complexity}`} size="small" />
                    <Chip label={`Cost: ${strat.costImpact}`} size="small" color="primary" />
                    <Chip label={strat.timeframe} size="small" color="secondary" />
                  </Box>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" paragraph>
                {strat.description}
              </Typography>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Use Cases</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <List dense>
                    {strat.useCases.map((useCase, idx) => (
                      <ListItem key={idx}>
                        <ListItemIcon>
                          <CheckCircleIcon fontSize="small" color="success" />
                        </ListItemIcon>
                        <ListItemText primary={useCase} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>

              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="subtitle2">Benefits & Challenges</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="subtitle2" color="success.main" gutterBottom>
                    Benefits:
                  </Typography>
                  <List dense>
                    {strat.benefits.map((benefit, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={benefit} />
                      </ListItem>
                    ))}
                  </List>
                  <Typography
                    variant="subtitle2"
                    color="warning.main"
                    gutterBottom
                    sx={{ mt: 1 }}
                  >
                    Challenges:
                  </Typography>
                  <List dense>
                    {strat.challenges.map((challenge, idx) => (
                      <ListItem key={idx}>
                        <ListItemText primary={challenge} />
                      </ListItem>
                    ))}
                  </List>
                </AccordionDetails>
              </Accordion>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Box>
);
