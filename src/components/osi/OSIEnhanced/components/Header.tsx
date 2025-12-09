/**
 * Header component for OSIEnhanced
 */

import React from 'react';

export const Header: React.FC = () => {
  return (
    <div className="rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
      <h1 className="mb-2 text-4xl font-bold">OSI Model Master Class</h1>
      <p className="text-lg text-blue-100">
        Complete CompTIA Network+ N10-008 OSI Model Coverage
      </p>
      <div className="mt-4 flex gap-2 text-sm">
        <span className="rounded-full bg-white/20 px-3 py-1">60+ Protocols</span>
        <span className="rounded-full bg-white/20 px-3 py-1">TCP Flags</span>
        <span className="rounded-full bg-white/20 px-3 py-1">Data Encapsulation</span>
        <span className="rounded-full bg-white/20 px-3 py-1">50 Scenarios</span>
      </div>
    </div>
  );
};
