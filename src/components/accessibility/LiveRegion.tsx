/**
 * LiveRegion Component
 * WCAG 4.1.3 Status Messages (Level AA)
 *
 * Provides ARIA live region for screen reader announcements.
 */

import React from 'react';
import type { AnnouncementPriority } from '../../hooks/accessibility/useAnnouncement';

interface LiveRegionProps {
  message: string | null;
  priority?: AnnouncementPriority;
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  message,
  priority = 'polite',
  className = ''
}) => {
  if (!message) return null;

  return (
    <div
      role={priority === 'assertive' ? 'alert' : 'status'}
      aria-live={priority}
      aria-atomic="true"
      className={`sr-only ${className}`}
    >
      {message}
    </div>
  );
};
