/**
 * Remediation decision tree utilities
 */

export const formatRemediationHeader = (port: number, service: string, risk: string): string[] => [
  '',
  `═══════ REMEDIATION DECISION TREE - PORT ${port} ═══════`,
  '',
  `Service: ${service} (${risk.toUpperCase()} risk)`,
  '',
  'What would you do? (Choose your approach)',
  '',
];

export const formatCriticalRiskRemediation = (recommendations: string[]): string[] => [
  '⚠️  CRITICAL RISK - Immediate action required!',
  '',
  'Recommended actions (in order of priority):',
  '  1. DISABLE service immediately if not required',
  '  2. ISOLATE from internet/untrusted networks',
  '  3. UPDATE to latest secure version',
  '  4. IMPLEMENT strong authentication',
  '  5. ENABLE encryption if available',
  '  6. MONITOR for suspicious activity',
  '',
  'Specific recommendations for this service:',
  ...recommendations.map((rec) => `  → ${rec}`),
  '',
];

export const formatHighRiskRemediation = (recommendations: string[]): string[] => [
  '⚠️  HIGH RISK - Action needed soon',
  '',
  'Recommended actions:',
  '  1. REVIEW necessity of service',
  '  2. RESTRICT access (firewall/VPN)',
  '  3. UPDATE to latest version',
  '  4. STRENGTHEN authentication',
  '  5. MONITOR access logs',
  '',
  'Specific recommendations:',
  ...recommendations.map((rec) => `  → ${rec}`),
  '',
];

export const formatMediumRiskRemediation = (recommendations: string[]): string[] => [
  '⚡ MEDIUM RISK - Should be addressed',
  '',
  'Recommended actions:',
  '  1. VERIFY security configuration',
  '  2. IMPLEMENT best practices',
  '  3. SCHEDULE regular updates',
  '  4. REVIEW access controls',
  '',
  'Specific recommendations:',
  ...recommendations.map((rec) => `  → ${rec}`),
  '',
];

export const formatLowRiskRemediation = (recommendations: string[]): string[] => [
  '✓ LOW RISK - Maintain security posture',
  '',
  'Recommended actions:',
  '  1. MAINTAIN current configuration',
  '  2. REGULAR security updates',
  '  3. PERIODIC security reviews',
  '',
  'Specific recommendations:',
  ...recommendations.map((rec) => `  → ${rec}`),
  '',
];

export const getRemediationByRisk = (risk: string, recommendations: string[]): string[] => {
  switch (risk) {
    case 'critical':
      return formatCriticalRiskRemediation(recommendations);
    case 'high':
      return formatHighRiskRemediation(recommendations);
    case 'medium':
      return formatMediumRiskRemediation(recommendations);
    default:
      return formatLowRiskRemediation(recommendations);
  }
};
