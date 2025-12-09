import React from 'react';

export const HelpSection: React.FC = () => (
  <div className="rounded-lg bg-gray-50 p-4 text-sm dark:bg-gray-800">
    <p className="font-semibold text-gray-700 dark:text-gray-200">How to use:</p>
    <ul className="mt-2 list-inside list-disc space-y-1 text-gray-600 dark:text-gray-400">
      <li>Answer each question about your infrastructure needs</li>
      <li>Get personalized device recommendations with detailed specs</li>
      <li>Compare similar devices by cost, throughput, and features</li>
      <li>Review exam scenarios to test your knowledge</li>
    </ul>
  </div>
);
