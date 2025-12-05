/**
 * Defense Controls Component
 * Configure firewall, IDS, and other defense mechanisms
 */

import React from 'react';
import type { DefenseConfig, FirewallRule } from './types';

interface DefenseControlsProps {
  config: DefenseConfig;
  onChange: (config: DefenseConfig) => void;
}

export const DefenseControls: React.FC<DefenseControlsProps> = React.memo(
  ({ config, onChange }) => {
    const updateRule = (ruleId: string, updates: Partial<FirewallRule>) => {
      onChange({
        ...config,
        rules: config.rules.map((r) => (r.id === ruleId ? { ...r, ...updates } : r)),
      });
    };

    return (
      <div className="defense-config">
        <h3>Defense Mechanisms</h3>

        <div className="defense-toggles">
          <label className="defense-toggle">
            <input
              type="checkbox"
              checked={config.firewallEnabled}
              onChange={(e) => onChange({ ...config, firewallEnabled: e.target.checked })}
            />
            <span>🛡️ Firewall (Port Filtering)</span>
          </label>

          <label className="defense-toggle">
            <input
              type="checkbox"
              checked={config.idsEnabled}
              onChange={(e) => onChange({ ...config, idsEnabled: e.target.checked })}
            />
            <span>🚨 IDS/IPS (Intrusion Detection)</span>
          </label>

          <label className="defense-toggle">
            <input
              type="checkbox"
              checked={config.rateLimitEnabled}
              onChange={(e) => onChange({ ...config, rateLimitEnabled: e.target.checked })}
            />
            <span>⏱️ Rate Limiting</span>
          </label>

          <label className="defense-toggle">
            <input
              type="checkbox"
              checked={config.portKnocking}
              onChange={(e) => onChange({ ...config, portKnocking: e.target.checked })}
            />
            <span>🚪 Port Knocking</span>
          </label>
        </div>

        {config.firewallEnabled && (
          <div className="firewall-rules">
            <h4>Firewall Rules:</h4>
            {config.rules.map((rule) => (
              <div key={rule.id} className="firewall-rule">
                <label>
                  <input
                    type="checkbox"
                    checked={rule.enabled}
                    onChange={(e) => updateRule(rule.id, { enabled: e.target.checked })}
                  />
                  Port {rule.port}
                </label>
                <select
                  value={rule.action}
                  onChange={(e) =>
                    updateRule(rule.id, {
                      action: e.target.value as 'allow' | 'block' | 'rate-limit',
                    })
                  }
                  disabled={!rule.enabled}
                >
                  <option value="allow">Allow</option>
                  <option value="block">Block</option>
                  <option value="rate-limit">Rate Limit</option>
                </select>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

DefenseControls.displayName = 'DefenseControls';
