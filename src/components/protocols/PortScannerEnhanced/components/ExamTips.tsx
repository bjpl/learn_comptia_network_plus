/**
 * CompTIA Network+ exam tips component
 */

import React from 'react';

export const ExamTips: React.FC = () => {
  return (
    <div className="exam-tips">
      <h3>📚 CompTIA Network+ Exam Tips</h3>
      <ul>
        <li>
          <strong>Security Implications:</strong> Open ports are potential attack vectors
        </li>
        <li>
          <strong>Common Services:</strong> Memorize standard ports (21=FTP, 22=SSH, 80=HTTP,
          443=HTTPS)
        </li>
        <li>
          <strong>Firewall vs ACL:</strong> Firewalls are stateful, ACLs are stateless
        </li>
        <li>
          <strong>Troubleshooting:</strong> Closed = service stopped, Filtered = firewall blocking
        </li>
        <li>
          <strong>Best Practices:</strong> Disable unnecessary services, use non-standard ports for
          security through obscurity
        </li>
      </ul>
    </div>
  );
};
