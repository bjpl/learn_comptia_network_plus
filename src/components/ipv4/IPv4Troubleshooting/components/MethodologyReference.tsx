/**
 * Troubleshooting methodology reference component
 */

import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Divider,
  Grid,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

export const MethodologyReference: React.FC = () => {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMore />}>
        <Typography variant="h6">Troubleshooting Methodology</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="subtitle2" gutterBottom>
          Systematic Troubleshooting Approach:
        </Typography>
        <ol>
          <li>
            <strong>Identify the Problem:</strong> Gather symptoms and user reports
          </li>
          <li>
            <strong>Establish Theory:</strong> Consider possible causes based on symptoms
          </li>
          <li>
            <strong>Test Theory:</strong> Use diagnostic tools to verify hypothesis
          </li>
          <li>
            <strong>Establish Action Plan:</strong> Determine steps to resolve issue
          </li>
          <li>
            <strong>Implement Solution:</strong> Apply fixes methodically
          </li>
          <li>
            <strong>Verify Functionality:</strong> Confirm problem is resolved
          </li>
          <li>
            <strong>Document:</strong> Record findings and resolution for future reference
          </li>
        </ol>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle2" gutterBottom>
          Essential Diagnostic Commands:
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" display="block" fontWeight="bold">
              Windows:
            </Typography>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>
                <code>ipconfig /all</code> - View IP configuration
              </li>
              <li>
                <code>ping [address]</code> - Test connectivity
              </li>
              <li>
                <code>tracert [address]</code> - Trace route path
              </li>
              <li>
                <code>arp -a</code> - View ARP cache
              </li>
              <li>
                <code>route print</code> - Display routing table
              </li>
            </ul>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="caption" display="block" fontWeight="bold">
              Linux:
            </Typography>
            <ul style={{ fontSize: '0.875rem' }}>
              <li>
                <code>ip addr show</code> - Show IP addresses
              </li>
              <li>
                <code>ping [address]</code> - Test connectivity
              </li>
              <li>
                <code>traceroute [address]</code> - Trace route
              </li>
              <li>
                <code>arp -n</code> - Show ARP table
              </li>
              <li>
                <code>ip route show</code> - Display routes
              </li>
            </ul>
          </Grid>
        </Grid>
      </AccordionDetails>
    </Accordion>
  );
};
