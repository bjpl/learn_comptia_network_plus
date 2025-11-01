/**
 * Icon re-exports mapping MUI icons to Lucide React icons
 * This provides a compatibility layer for components migrated from MUI
 */

import {
  ChevronDown,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  RotateCw,
  Calculator,
  Download,
  Bug,
  Play,
  Lightbulb,
  Terminal,
  Wifi,
  Router as RouterIcon,
  Monitor,
  HardDrive,
  HelpCircle,
  Wrench,
  Cloud,
  type LucideProps
} from 'lucide-react';

// Export with MUI-compatible names
export const ExpandMore = ChevronDown;
export const CheckCircle = CheckCircle2;
export const Error = XCircle;
export const Warning = AlertTriangle;
export { Info };
export const Refresh = RotateCw;
export const Calculate = Calculator;
export const SaveAlt = Download;
export const BugReport = Bug;
export const PlayArrow = Play;
export { Lightbulb };
export { Terminal };
export const NetworkCheck = Wifi;
export const Router = RouterIcon;
export const Computer = Monitor;
export const Storage = HardDrive;
export const HelpOutline = HelpCircle;
export const Build = Wrench;
export const CloudQueue = Cloud;

// Export the type for props
export type { LucideProps as IconProps };
