import React from 'react';

interface FiltersProps {
  filterDifficulty: string;
  filterCategory: string;
  categories: string[];
  onFilterChange: (type: 'difficulty' | 'category', value: string) => void;
}

export const Filters: React.FC<FiltersProps> = ({
  filterDifficulty,
  filterCategory,
  categories,
  onFilterChange,
}) => {
  return (
    <div
      className="filters"
      style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}
    >
      <div>
        <label
          htmlFor="difficulty-filter"
          className="text-gray-900 dark:text-gray-100"
          style={{ marginRight: '8px', fontWeight: 'bold' }}
        >
          Difficulty:
        </label>
        <select
          id="difficulty-filter"
          value={filterDifficulty}
          onChange={(e) => onFilterChange('difficulty', e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        >
          <option value="all">All</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="category-filter"
          className="text-gray-900 dark:text-gray-100"
          style={{ marginRight: '8px', fontWeight: 'bold' }}
        >
          Category:
        </label>
        <select
          id="category-filter"
          value={filterCategory}
          onChange={(e) => onFilterChange('category', e.target.value)}
          style={{
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
          }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'all' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
