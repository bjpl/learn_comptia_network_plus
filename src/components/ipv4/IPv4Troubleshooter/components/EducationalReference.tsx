/**
 * Educational reference accordion component
 */
import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Typography,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export const EducationalReference: React.FC = () => (
  <Accordion>
    <AccordionSummary expandIcon={<ExpandMore />}>
      <Typography variant="h6">IPv4 Troubleshooting Guide</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Common IPv4 Issues:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="APIPA (169.254.x.x)"
                secondary="Indicates DHCP failure - check server and connectivity"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Private Address Routing"
                secondary="RFC 1918 addresses need NAT to access internet"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Multicast on Hosts"
                secondary="Class D (224-239) is for multicast, not host addressing"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Loopback Assignment"
                secondary="127.0.0.0/8 is local-only, cannot be used on interfaces"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Subnet Mask Mismatch"
                secondary="All devices on same subnet must use same mask"
              />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="subtitle2" gutterBottom>
            Troubleshooting Methodology:
          </Typography>
          <List dense>
            <ListItem>
              <ListItemText
                primary="1. Gather Information"
                secondary="Collect symptoms, error messages, and configurations"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="2. Identify the Problem"
                secondary="Use diagnostic tools to pinpoint the issue"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="3. Establish Theory"
                secondary="Form hypothesis about the root cause"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="4. Test Theory"
                secondary="Verify your theory with additional diagnostics"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="5. Implement Solution"
                secondary="Apply fix and verify it resolves the issue"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="6. Document"
                secondary="Record the problem, solution, and lessons learned"
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </AccordionDetails>
  </Accordion>
);
