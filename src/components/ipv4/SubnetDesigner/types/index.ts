/**
 * Type definitions for SubnetDesigner component
 */

export interface BinaryConverterState {
  ipInput: string;
  maskInput: string;
}

export interface SubnetCheatData {
  cidr: string;
  mask: string;
  hosts: number;
  common: string;
}
