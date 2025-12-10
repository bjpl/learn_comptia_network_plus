/**
 * Educational reference accordions component
 */

import React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import { ExpandMore, Info } from '@mui/icons-material';
import { BinaryConverter } from './BinaryConverter';
import { SubnetCheatSheet } from './SubnetCheatSheet';
import type { BinaryConverterState } from '../types';

interface EducationalAccordionsProps {
  binaryConverter: BinaryConverterState;
  setBinaryConverter: React.Dispatch<React.SetStateAction<BinaryConverterState>>;
}

export const EducationalAccordions: React.FC<EducationalAccordionsProps> = ({
  binaryConverter,
  setBinaryConverter,
}) => {
  return (
    <>
      {/* Binary Converter Tool */}
      <div style={{ marginTop: '24px' }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Info sx={{ mr: 1 }} />
            <Typography variant="h6">Binary Conversion Helper</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <BinaryConverter
              binaryConverter={binaryConverter}
              setBinaryConverter={setBinaryConverter}
            />
          </AccordionDetails>
        </Accordion>
      </div>

      {/* Subnet Cheat Sheet */}
      <div style={{ marginTop: '24px' }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Info sx={{ mr: 1 }} />
            <Typography variant="h6">Subnet Reference Cheat Sheet</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SubnetCheatSheet />
          </AccordionDetails>
        </Accordion>
      </div>

      {/* Educational Info */}
      <div style={{ marginTop: '24px' }}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Typography variant="h6">IPv4 Concepts Reference</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  RFC 1918 Private Addresses:
                </Typography>
                <ul>
                  <li>
                    <code>10.0.0.0/8</code> - Class A (16.7M addresses)
                  </li>
                  <li>
                    <code>172.16.0.0/12</code> - Class B (1M addresses)
                  </li>
                  <li>
                    <code>192.168.0.0/16</code> - Class C (65K addresses)
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12} md={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Special Address Ranges:
                </Typography>
                <ul>
                  <li>
                    <code>127.0.0.0/8</code> - Loopback
                  </li>
                  <li>
                    <code>169.254.0.0/16</code> - APIPA
                  </li>
                  <li>
                    <code>224.0.0.0/4</code> - Multicast (Class D)
                  </li>
                  <li>
                    <code>240.0.0.0/4</code> - Reserved (Class E)
                  </li>
                </ul>
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="subtitle2" gutterBottom>
                  VLSM Best Practices:
                </Typography>
                <ul>
                  <li>Always allocate largest subnets first</li>
                  <li>Account for network and broadcast addresses</li>
                  <li>Use /30 or /31 for point-to-point links</li>
                  <li>Plan for future growth (20-30% overhead)</li>
                  <li>Avoid subnet overlaps</li>
                  <li>Document all allocations</li>
                </ul>
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </div>
    </>
  );
};
