import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">About</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Interactive learning platform for CompTIA Network+ certification preparation with
              hands-on practice and assessments.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:text-gray-200"
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                  to="/osi/introduction"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:text-gray-200"
                >
                  Start Learning
                </Link>
              </li>
              <li>
                <Link
                  to="/assessment/practice"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:text-gray-200"
                >
                  Practice Exam
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.comptia.org/certifications/network"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:text-gray-200"
                >
                  CompTIA Official Site
                </a>
              </li>
              <li>
                <a
                  href="https://www.comptia.org/training/resources"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:text-gray-200"
                >
                  Study Materials
                </a>
              </li>
              <li>
                <a
                  href="https://www.comptia.org/testing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:text-gray-200"
                >
                  Exam Information
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:text-gray-200"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:text-gray-200"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-sm text-gray-600 transition-colors hover:text-blue-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-blue-400 dark:hover:text-gray-200"
                >
                  Accessibility
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8 dark:border-gray-700">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              © {currentYear} CompTIA Network+ Learning Platform. All rights reserved.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              CompTIA® and Network+™ are registered trademarks of CompTIA, Inc.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
