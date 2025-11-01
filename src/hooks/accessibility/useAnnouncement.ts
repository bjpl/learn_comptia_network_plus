/**
 * useAnnouncement Hook
 * WCAG 4.1.3 Status Messages (Level AA)
 *
 * Manages ARIA live regions for screen reader announcements
 * of dynamic content changes.
 */

import { useState, useCallback } from 'react';

export type AnnouncementPriority = 'polite' | 'assertive';

export interface Announcement {
  message: string;
  priority: AnnouncementPriority;
}

export const useAnnouncement = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  const announce = useCallback((message: string, priority: AnnouncementPriority = 'polite') => {
    // Clear previous announcement first to ensure re-announcement
    setAnnouncement(null);

    // Set new announcement after a brief delay
    setTimeout(() => {
      setAnnouncement({ message, priority });
    }, 100);

    // Clear after announcement has been made
    setTimeout(() => {
      setAnnouncement(null);
    }, 3000);
  }, []);

  return { announcement, announce };
};
