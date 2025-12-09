import React from 'react';

interface SearchBoxProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className="rounded-lg bg-white p-4 shadow-lg dark:bg-gray-800">
      <h3 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Search Devices</h3>
      <input
        type="text"
        placeholder="Search by name, type, or function..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-500"
      />
    </div>
  );
};

export default SearchBox;
