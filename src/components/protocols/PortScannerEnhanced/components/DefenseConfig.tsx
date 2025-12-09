/**
 * Defense configuration component
 */

import React from 'react';
import type { DefenseConfig as DefenseConfigType } from '../types';

interface DefenseConfigProps {
  config: DefenseConfigType;
  onConfigChange: (config: DefenseConfigType) => void;
}

export const DefenseConfig: React.FC<DefenseConfigProps> = ({ config, onConfigChange }) => {
  return (
    <div className="defense-config">
      <h3>Defense Mechanisms</h3>

      <div className="defense-toggles">
        <label className="defense-toggle">
          <input
            type="checkbox"
            checked={config.firewallEnabled}
            onChange={(e) =>
              onConfigChange({
                ...config,
                firewallEnabled: e.target.checked,
              })
            }
          />
          <span>🛡️ Firewall (Port Filtering)</span>
        </label>

        <label className="defense-toggle">
          <input
            type="checkbox"
            checked={config.idsEnabled}
            onChange={(e) =>
              onConfigChange({
                ...config,
                idsEnabled: e.target.checked,
              })
            }
          />
          <span>🚨 IDS/IPS (Intrusion Detection)</span>
        </label>

        <label className="defense-toggle">
          <input
            type="checkbox"
            checked={config.rateLimitEnabled}
            onChange={(e) =>
              onConfigChange({
                ...config,
                rateLimitEnabled: e.target.checked,
              })
            }
          />
          <span>⏱️ Rate Limiting</span>
        </label>

        <label className="defense-toggle">
          <input
            type="checkbox"
            checked={config.portKnocking}
            onChange={(e) =>
              onConfigChange({
                ...config,
                portKnocking: e.target.checked,
              })
            }
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
                  onChange={(e) =>
                    onConfigChange({
                      ...config,
                      rules: config.rules.map((r) =>
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
                  onConfigChange({
                    ...config,
                    rules: config.rules.map((r) =>
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
