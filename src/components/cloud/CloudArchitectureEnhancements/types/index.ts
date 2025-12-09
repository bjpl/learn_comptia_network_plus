/**
 * Type definitions for Cloud Architecture Enhancements
 */

import type { ArchitectureDesign } from '../../cloud-types';
import type { Tooltip, ArchitectureTemplate } from '../../cloud-learning-utils';

export interface TooltipPopupProps {
  tooltip: Tooltip;
  position: { x: number; y: number };
}

export interface TemplatesPanelProps {
  onSelectTemplate: (template: ArchitectureTemplate) => void;
  onClose: () => void;
}

export interface CostPanelProps {
  design: ArchitectureDesign;
  onClose: () => void;
}

export interface SecurityPanelProps {
  design: ArchitectureDesign;
  onClose: () => void;
}

export interface TutorialGuideProps {
  currentStep: number;
  onNext: () => void;
  onPrev: () => void;
  onClose: () => void;
}

export interface HelpIconProps {
  subtype: string;
  onShowTooltip: (tooltip: Tooltip, event: React.MouseEvent) => void;
}

export type { Tooltip, ArchitectureTemplate, ArchitectureDesign };
