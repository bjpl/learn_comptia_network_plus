/**
 * ComponentLibraryPanel - Sidebar panel for draggable cloud components
 * CompTIA Network+ Learning Objective 1.2
 *
 * Features:
 * - Category-based component organization
 * - Drag-and-drop to canvas
 * - Collapsible sidebar
 * - Hover previews with descriptions
 * - Icon-based visual representation
 */

import React from 'react';
import { useCloudDesignerStore } from './stores/cloudDesignerStore';
import { componentLibrary } from './cloud-data';
import type { ComponentLibraryItem, ComponentType } from './cloud-types';

// ============================================================================
// TYPES
// ============================================================================

interface ComponentLibraryPanelProps {
  onDragStart: (e: React.DragEvent, item: ComponentLibraryItem) => void;
  onDragEnd: () => void;
}

// ============================================================================
// COMPONENT CATEGORIES
// ============================================================================

const categories: { type: ComponentType; label: string; icon: string }[] = [
  { type: 'deployment-zone', label: 'Deployment', icon: '🌐' },
  { type: 'service-layer', label: 'Services', icon: '⚙️' },
  { type: 'connectivity', label: 'Connectivity', icon: '🔗' },
  { type: 'vpc-element', label: 'VPC', icon: '📦' },
  { type: 'gateway', label: 'Gateways', icon: '🚪' },
  { type: 'nfv-component', label: 'NFV', icon: '🔀' },
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const ComponentLibraryPanel: React.FC<ComponentLibraryPanelProps> = ({
  onDragStart,
  onDragEnd,
}) => {
  // Store state
  const showLibrary = useCloudDesignerStore((state) => state.showLibrary);
  const activeCategory = useCloudDesignerStore((state) => state.activeCategory);
  const setActiveCategory = useCloudDesignerStore((state) => state.setActiveCategory);
  const setShowLibrary = useCloudDesignerStore((state) => state.setShowLibrary);
  const setIsDraggingFromLibrary = useCloudDesignerStore(
    (state) => state.setIsDraggingFromLibrary
  );

  // Filter components by active category
  const filteredComponents = componentLibrary.filter((item) => item.type === activeCategory);

  // Handlers
  const handleDragStart = (e: React.DragEvent, item: ComponentLibraryItem) => {
    setIsDraggingFromLibrary(true);
    onDragStart(e, item);
  };

  const handleDragEnd = () => {
    setIsDraggingFromLibrary(false);
    onDragEnd();
  };

  const toggleLibrary = () => {
    setShowLibrary(!showLibrary);
  };

  // Render collapsed state
  if (!showLibrary) {
    return (
      <div className="fixed left-0 top-20 z-30">
        <button
          onClick={toggleLibrary}
          className="flex items-center gap-2 rounded-r-lg bg-blue-600 px-3 py-2 text-white shadow-lg transition-all hover:bg-blue-700"
          title="Show Component Library"
        >
          <span className="text-lg">📚</span>
          <span className="text-sm font-medium">Components</span>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed left-0 top-20 z-30 flex h-[calc(100vh-5rem)] w-72 flex-col border-r border-gray-200 bg-white shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📚</span>
          <h2 className="text-lg font-bold text-gray-800">Components</h2>
        </div>
        <button
          onClick={toggleLibrary}
          className="rounded p-1 text-gray-600 transition-colors hover:bg-gray-200"
          title="Hide Library"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-3 gap-1 p-2">
          {categories.map((category) => (
            <button
              key={category.type}
              onClick={() => setActiveCategory(category.type)}
              className={`
                flex flex-col items-center gap-1 rounded-lg px-2 py-2 text-xs font-medium transition-all
                ${
                  activeCategory === category.type
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }
              `}
              title={category.label}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="truncate">{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {filteredComponents.length === 0 ? (
            <div className="rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 text-center">
              <p className="text-sm text-gray-500">No components in this category</p>
            </div>
          ) : (
            filteredComponents.map((item) => (
              <ComponentCard
                key={`${item.type}-${item.subtype}`}
                item={item}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              />
            ))
          )}
        </div>
      </div>

      {/* Footer Help */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
        <div className="flex items-start gap-2 text-xs text-gray-600">
          <span className="text-base">💡</span>
          <p>
            <strong>Tip:</strong> Drag components onto the canvas to build your cloud
            architecture
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT CARD
// ============================================================================

interface ComponentCardProps {
  item: ComponentLibraryItem;
  onDragStart: (e: React.DragEvent, item: ComponentLibraryItem) => void;
  onDragEnd: () => void;
}

const ComponentCard: React.FC<ComponentCardProps> = ({ item, onDragStart, onDragEnd }) => {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      className="group cursor-move rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-all hover:shadow-md hover:border-blue-400 hover:bg-blue-50"
      style={{ borderLeftColor: item.color, borderLeftWidth: '4px' }}
    >
      {/* Component Header */}
      <div className="mb-2 flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl" role="img" aria-label={item.name}>
            {item.icon}
          </span>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-blue-700">
              {item.name}
            </h3>
            <p className="text-xs text-gray-500">{item.subtype}</p>
          </div>
        </div>
        {/* Drag Handle */}
        <div className="flex h-6 w-6 items-center justify-center rounded bg-gray-100 text-gray-400 transition-colors group-hover:bg-blue-200 group-hover:text-blue-600">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 8h16M4 16h16"
            />
          </svg>
        </div>
      </div>

      {/* Component Description */}
      <p className="text-xs leading-relaxed text-gray-600">{item.description}</p>

      {/* Component Metadata */}
      <div className="mt-2 flex items-center gap-2 border-t border-gray-100 pt-2">
        <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600">
          {item.defaultWidth}×{item.defaultHeight}
        </span>
        {item.properties.length > 0 && (
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-600">
            {item.properties.length} properties
          </span>
        )}
      </div>
    </div>
  );
};

export default ComponentLibraryPanel;
