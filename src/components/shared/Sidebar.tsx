import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppStore } from '../../stores/appStore';
import { useProgressStore } from '../../stores/progressStore';

interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: string;
  category?: string;
}

const navigationItems: NavItem[] = [
  { id: 'home', label: 'Dashboard', path: '/', icon: '🏠' },

  // OSI Model
  { id: 'osi-intro', label: 'OSI Introduction', path: '/osi/introduction', icon: '📚', category: 'OSI Model' },
  { id: 'osi-practice', label: 'OSI Practice', path: '/osi/practice', icon: '🎯', category: 'OSI Model' },

  // Cloud
  { id: 'cloud-intro', label: 'Cloud Introduction', path: '/cloud/introduction', icon: '☁️', category: 'Cloud' },
  { id: 'cloud-practice', label: 'Cloud Practice', path: '/cloud/practice', icon: '🎮', category: 'Cloud' },

  // Protocols
  { id: 'protocols-intro', label: 'Protocols Introduction', path: '/protocols/introduction', icon: '🔌', category: 'Protocols' },
  { id: 'protocols-practice', label: 'Protocols Practice', path: '/protocols/practice', icon: '⚡', category: 'Protocols' },

  // Physical Media
  { id: 'media-intro', label: 'Media Introduction', path: '/media/introduction', icon: '🔗', category: 'Physical Media' },
  { id: 'media-practice', label: 'Media Practice', path: '/media/practice', icon: '🎲', category: 'Physical Media' },

  // Topologies
  { id: 'topologies-intro', label: 'Topologies Introduction', path: '/topologies/introduction', icon: '🕸️', category: 'Topologies' },
  { id: 'topologies-practice', label: 'Topologies Practice', path: '/topologies/practice', icon: '🎪', category: 'Topologies' },

  // IPv4
  { id: 'ipv4-intro', label: 'IPv4 Introduction', path: '/ipv4/introduction', icon: '🌐', category: 'IPv4' },
  { id: 'ipv4-subnetting', label: 'Subnetting Basics', path: '/ipv4/subnetting', icon: '🔢', category: 'IPv4' },
  { id: 'ipv4-advanced', label: 'Advanced Subnetting', path: '/ipv4/advanced', icon: '🧮', category: 'IPv4' },
  { id: 'ipv4-practice', label: 'IPv4 Practice', path: '/ipv4/practice', icon: '🎯', category: 'IPv4' },

  // Modern
  { id: 'modern-intro', label: 'Modern Topics Introduction', path: '/modern/introduction', icon: '🚀', category: 'Modern Topics' },
  { id: 'modern-practice', label: 'Modern Practice', path: '/modern/practice', icon: '🎨', category: 'Modern Topics' },

  // Assessment
  { id: 'assessment-intro', label: 'Assessment Introduction', path: '/assessment/introduction', icon: '📝', category: 'Assessment' },
  { id: 'assessment-practice', label: 'Practice Exam', path: '/assessment/practice', icon: '✅', category: 'Assessment' },
  { id: 'assessment-flashcards', label: 'Flashcards', path: '/assessment/flashcards', icon: '🗂️', category: 'Assessment' },
  { id: 'assessment-final', label: 'Final Exam', path: '/assessment/final', icon: '🏆', category: 'Assessment' },
  { id: 'assessment-results', label: 'Results Dashboard', path: '/assessment/results', icon: '📊', category: 'Assessment' },
];

export const Sidebar: React.FC = () => {
  const sidebarOpen = useAppStore((state) => state.sidebarOpen);
  const setSidebarOpen = useAppStore((state) => state.setSidebarOpen);
  const getComponentProgress = useProgressStore((state) => state.getComponentProgress);

  const groupedItems = navigationItems.reduce((acc, item) => {
    if (!item.category) {
      acc['General'] = acc['General'] || [];
      acc['General'].push(item);
    } else {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
    }
    return acc;
  }, {} as Record<string, NavItem[]>);

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          transform transition-transform duration-300 ease-in-out overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
        aria-label="Sidebar navigation"
      >
        <nav className="p-4 space-y-6">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category}>
              <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {category}
              </h3>
              <ul className="space-y-1">
                {items.map((item) => {
                  const progress = getComponentProgress(item.id);
                  const isCompleted = progress?.completed || false;

                  return (
                    <li key={item.id}>
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActive
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-medium'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`
                        }
                        onClick={() => {
                          if (window.innerWidth < 1024) {
                            setSidebarOpen(false);
                          }
                        }}
                      >
                        <span className="text-xl" role="img" aria-hidden="true">
                          {item.icon}
                        </span>
                        <span className="flex-1 text-sm">{item.label}</span>
                        {isCompleted && (
                          <svg
                            className="w-5 h-5 text-green-500"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            aria-label="Completed"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </NavLink>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};
