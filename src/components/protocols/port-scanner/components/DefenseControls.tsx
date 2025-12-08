/**
 * Defense controls component
 */

import React from 'react';
import type { DefenseConfig } from '../types';

interface DefenseControlsProps {
  defenseConfig: DefenseConfig;
  onDefenseConfigChange: (config: DefenseConfig) => void;
}

export const DefenseControls: React.FC<DefenseControlsProps> = ({
  defenseConfig,
  onDefenseConfigChange,
}) => {
  return (
    <div className="defense-config">
      <h3>Defense Mechanisms</h3>

      <div className="defense-toggles">
        <label className="defense-toggle">
          <input
            type="checkbox"
            checked={defenseConfig.firewallEnabled}
            onChange={(e) =>
              onDefenseConfigChange({
                ...defenseConfig,
                firewallEnabled: e.target.checked,
              })
            }
          />
          <span>🛡️ Firewall (Port Filtering)</span>
        </label>

        <label className="defense-toggle">
          <input
            type="checkbox"
            checked={defenseConfig.idsEnabled}
            onChange={(e) =>
              onDefenseConfigChange({
                ...defenseConfig,
                idsEnabled: e.target.checked,
              })
            }
          />
          <span>🚨 IDS/IPS (Intrusion Detection)</span>
        </label>

        <label className="defense-toggle">
          <input
            type="checkbox"
            checked={defenseConfig.rateLimitEnabled}
            onChange={(e) =>
              onDefenseConfigChange({
                ...defenseConfig,
                rateLimitEnabled: e.target.checked,
              })
            }
          />
          <span>⏱️ Rate Limiting</span>
        </label>

        <label className="defense-toggle">
          <input
            type="checkbox"
            checked={defenseConfig.portKnocking}
            onChange={(e) =>
              onDefenseConfigChange({
                ...defenseConfig,
                portKnocking: e.target.checked,
              })
            }
          />
          <span>🚪 Port Knocking</span>
        </label>
      </div>

      {defenseConfig.firewallEnabled && (
        <div className="firewall-rules">
          <h4>Firewall Rules:</h4>
          {defenseConfig.rules.map((rule) => (
            <div key={rule.id} className="firewall-rule">
              <label>
                <input
                  type="checkbox"
                  checked={rule.enabled}
                  onChange={(e) =>
                    onDefenseConfigChange({
                      ...defenseConfig,
                      rules: defenseConfig.rules.map((r) =>
                        r.id === rule.id ? { ...r, enabled: e.target.checked } : r
                      ),
                    })
                  }
                />
                Port {rule.port}
              </label>
              <select
                value={rule.action}
                onChange={(e) =>
                  onDefenseConfigChange({
                    ...defenseConfig,
                    rules: defenseConfig.rules.map((r) =>
                      r.id === rule.id
                        ? { ...r, action: e.target.value as 'allow' | 'block' | 'rate-limit' }
                        : r
                    ),
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
};
