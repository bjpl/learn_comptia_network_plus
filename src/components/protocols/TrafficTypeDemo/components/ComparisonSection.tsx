/**
 * Traffic type comparison table component
 */

import React from 'react';

interface ComparisonSectionProps {
  showComparison: boolean;
  onToggleComparison: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({
  showComparison,
  onToggleComparison,
}) => {
  return (
    <div className="comparison-section">
      <button onClick={onToggleComparison} className="comparison-btn">
        {showComparison ? 'Hide' : 'Show'} Traffic Type Comparison
      </button>

      {showComparison && (
        <div className="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Traffic Type</th>
                <th>Source → Destination</th>
                <th>Path Style</th>
                <th>Primary Benefit</th>
                <th>Primary Drawback</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <strong>Unicast</strong>
                </td>
                <td>One → One</td>
                <td>Single direct path</td>
                <td>Efficient, private, targeted</td>
                <td>Doesn&apos;t scale for many recipients</td>
              </tr>
              <tr>
                <td>
                  <strong>Multicast</strong>
                </td>
                <td>One → Many (group)</td>
                <td>Multiple paths, one stream</td>
                <td>Bandwidth efficient for groups</td>
                <td>Requires group management, router support</td>
              </tr>
              <tr>
                <td>
                  <strong>Anycast</strong>
                </td>
                <td>One → Nearest</td>
                <td>Shortest path to closest</td>
                <td>Automatic failover, load balancing</td>
                <td>Less control over destination</td>
              </tr>
              <tr>
                <td>
                  <strong>Broadcast</strong>
                </td>
                <td>One → All</td>
                <td>All paths to all nodes</td>
                <td>Simple discovery mechanism</td>
                <td>Network congestion, doesn&apos;t cross routers</td>
              </tr>
            </tbody>
          </table>

          <div className="when-to-use">
            <h4>When to Use Each Type:</h4>
            <div className="use-grid">
              <div className="use-card">
                <h5>Unicast</h5>
                <p>
                  Use when you need direct, private communication between two specific devices.
                  Examples: SSH, HTTPS, email delivery.
                </p>
              </div>
              <div className="use-card">
                <h5>Multicast</h5>
                <p>
                  Use when sending identical data to multiple interested parties. Examples: IPTV,
                  stock tickers, software updates to multiple servers.
                </p>
              </div>
              <div className="use-card">
                <h5>Anycast</h5>
                <p>
                  Use when you want requests routed to nearest available service. Examples: DNS,
                  CDN, DDoS mitigation.
                </p>
              </div>
              <div className="use-card">
                <h5>Broadcast</h5>
                <p>
                  Use when you need to discover or announce to all local devices. Examples: DHCP
                  discovery, ARP requests, network announcements.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
