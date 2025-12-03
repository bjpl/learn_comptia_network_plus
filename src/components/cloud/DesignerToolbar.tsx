import React from 'react';
import {
  Undo,
  Redo,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Target,
  Grid3x3,
  CheckCircle,
  Download,
  Upload,
  Sidebar,
} from 'lucide-react';

interface DesignerToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomToFit: () => void;
  onCenterView: () => void;
  showGrid: boolean;
  onToggleGrid: () => void;
  onValidate: () => void;
  onExport: () => void;
  onImport: () => void;
  onToggleLibrary: () => void;
  showLibrary: boolean;
}

interface ToolbarButtonProps {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  title: string;
  icon: React.ReactNode;
  shortcut?: string;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
  onClick,
  disabled = false,
  active = false,
  title,
  icon,
  shortcut,
}) => {
  const tooltipText = shortcut ? `${title} (${shortcut})` : title;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={tooltipText}
      className={`
        relative p-2 rounded-md transition-colors
        ${
          disabled
            ? 'text-gray-400 cursor-not-allowed'
            : active
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
        }
        disabled:opacity-50 disabled:hover:bg-transparent
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
    >
      {icon}
    </button>
  );
};

const Divider: React.FC = () => (
  <div className="w-px h-8 bg-gray-300 mx-1" aria-hidden="true" />
);

const DesignerToolbar: React.FC<DesignerToolbarProps> = ({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomToFit,
  onCenterView,
  showGrid,
  onToggleGrid,
  onValidate,
  onExport,
  onImport,
  onToggleLibrary,
  showLibrary,
}) => {
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-300 shadow-sm"
      role="toolbar"
      aria-label="Designer toolbar"
    >
      <div className="flex items-center justify-between px-4 py-2">
        {/* Left side - Main controls */}
        <div className="flex items-center gap-1">
          {/* Undo/Redo group */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo"
              icon={<Undo className="w-5 h-5" />}
              shortcut="Ctrl+Z"
            />
            <ToolbarButton
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo"
              icon={<Redo className="w-5 h-5" />}
              shortcut="Ctrl+Y"
            />
          </div>

          <Divider />

          {/* Zoom controls group */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={onZoomOut}
              disabled={zoom <= 0.1}
              title="Zoom Out"
              icon={<ZoomOut className="w-5 h-5" />}
              shortcut="Ctrl+-"
            />
            <div
              className="px-3 py-1 min-w-[60px] text-center text-sm font-medium text-gray-700 bg-gray-50 rounded-md border border-gray-300"
              title="Current zoom level"
            >
              {zoomPercentage}%
            </div>
            <ToolbarButton
              onClick={onZoomIn}
              disabled={zoom >= 4}
              title="Zoom In"
              icon={<ZoomIn className="w-5 h-5" />}
              shortcut="Ctrl++"
            />
            <ToolbarButton
              onClick={onZoomToFit}
              title="Zoom to Fit"
              icon={<Maximize2 className="w-5 h-5" />}
              shortcut="Ctrl+0"
            />
          </div>

          <Divider />

          {/* View controls group */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={onCenterView}
              title="Center View"
              icon={<Target className="w-5 h-5" />}
              shortcut="Ctrl+."
            />
            <ToolbarButton
              onClick={onToggleGrid}
              active={showGrid}
              title="Toggle Grid"
              icon={<Grid3x3 className="w-5 h-5" />}
              shortcut="Ctrl+G"
            />
          </div>

          <Divider />

          {/* Validation group */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={onValidate}
              title="Validate Architecture"
              icon={<CheckCircle className="w-5 h-5" />}
              shortcut="Ctrl+K"
            />
          </div>
        </div>

        {/* Right side - Import/Export and Library */}
        <div className="flex items-center gap-1">
          {/* Import/Export group */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={onImport}
              title="Import Architecture"
              icon={<Upload className="w-5 h-5" />}
              shortcut="Ctrl+O"
            />
            <ToolbarButton
              onClick={onExport}
              title="Export Architecture"
              icon={<Download className="w-5 h-5" />}
              shortcut="Ctrl+S"
            />
          </div>

          <Divider />

          {/* Library toggle */}
          <div className="flex items-center gap-1">
            <ToolbarButton
              onClick={onToggleLibrary}
              active={showLibrary}
              title="Toggle Component Library"
              icon={<Sidebar className="w-5 h-5" />}
              shortcut="Ctrl+L"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignerToolbar;
