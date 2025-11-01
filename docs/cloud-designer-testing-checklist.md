# Cloud Architecture Designer - Testing Checklist

## Manual Testing Guide

### 1. Drag-and-Drop from Library ✓

- [ ] Hover over library item shows grab cursor
- [ ] Dragging shows grabbing cursor
- [ ] Canvas highlights with blue tint when dragging over it
- [ ] Grid becomes more visible during drag
- [ ] Component places at cursor position
- [ ] Component snaps to grid (if enabled)
- [ ] New component is automatically selected
- [ ] Drop animation is smooth

### 2. Component Movement ✓

- [ ] Click component to select (blue glow appears)
- [ ] Drag component to move it
- [ ] Component becomes semi-transparent during drag
- [ ] Component rotates slightly during drag
- [ ] Shadow increases during drag
- [ ] Movement snaps to grid (if enabled)
- [ ] Component stays within canvas bounds
- [ ] Smooth movement with no jank
- [ ] Release updates component position

### 3. Resize Handles ✓

- [ ] Select component shows 4 corner resize handles
- [ ] Handles are blue circles with white borders
- [ ] Hover on handle scales it up
- [ ] Cursor changes to appropriate resize direction
- [ ] Dragging handle resizes component
- [ ] Size indicator appears below component
- [ ] Minimum size is enforced (80x60)
- [ ] Resize dimensions snap to grid
- [ ] All 4 corners work correctly (NW, NE, SW, SE)

### 4. Connection Creation ✓

- [ ] Click connection button on component header
- [ ] Connection mode activates
- [ ] Dashed preview line follows cursor
- [ ] Hover over other components shows connection ports
- [ ] Connection ports pulse with animation
- [ ] Click target component creates connection
- [ ] Connection uses smooth bezier curve
- [ ] Press ESC cancels connection mode
- [ ] Connection label hidden by default
- [ ] Hover connection shows label
- [ ] Connection line thickens on hover

### 5. Canvas Controls ✓

- [ ] Zoom In button increases zoom
- [ ] Zoom Out button decreases zoom
- [ ] Zoom percentage updates correctly
- [ ] Ctrl+Mouse Wheel zooms
- [ ] Zoom to Fit frames all components
- [ ] Center View resets pan
- [ ] Undo button works (Ctrl+Z)
- [ ] Redo button works (Ctrl+Y)
- [ ] Undo/Redo buttons disable when no history
- [ ] Drag canvas background to pan
- [ ] Cursor changes to grabbing during pan

### 6. Quick Actions ✓

- [ ] Hover component shows action buttons
- [ ] Connection button (🔗) starts connection mode
- [ ] Duplicate button (⧉) creates copy
- [ ] Delete button (×) removes component
- [ ] Actions fade in smoothly on hover
- [ ] Action buttons have hover effects
- [ ] Delete button turns red on hover

### 7. Keyboard Shortcuts ✓

- [ ] Ctrl+Z triggers undo
- [ ] Ctrl+Y triggers redo
- [ ] Ctrl+Shift+Z triggers redo
- [ ] Delete key removes selected component
- [ ] Ctrl+D duplicates selected component
- [ ] Escape cancels connection mode

### 8. Visual Polish ✓

- [ ] Selected component has blue glow ring
- [ ] Hovered component has enhanced shadow
- [ ] Dragging component has elevated shadow
- [ ] Grid pattern is visible and dotted
- [ ] Rounded corners (12px) on components
- [ ] All transitions are smooth (0.15s)
- [ ] Component icons are properly sized (22px)
- [ ] Type badges are styled correctly

### 9. Connection Ports ✓

- [ ] Ports appear on hover
- [ ] Ports appear when in connection mode
- [ ] Ports at all 4 sides (top, right, bottom, left)
- [ ] Ports are green circles
- [ ] Ports pulse with animation
- [ ] Ports scale up on hover
- [ ] Ports show crosshair cursor

### 10. Interaction States ✓

- [ ] Default state shows subtle shadow
- [ ] Hover state enhances shadow and transforms
- [ ] Selected state shows glow ring
- [ ] Dragging state shows rotation and scale
- [ ] Resizing shows size dimensions
- [ ] Panning shows grabbing cursor

## Edge Cases to Test

### Component Placement

- [ ] Drop component at canvas edges
- [ ] Drop component at (0, 0)
- [ ] Drop multiple components quickly
- [ ] Drop component while zoomed in
- [ ] Drop component while zoomed out

### Component Movement

- [ ] Move component to canvas edges
- [ ] Move component beyond bounds (should constrain)
- [ ] Move component while zoomed
- [ ] Move component with very small grid size
- [ ] Move component with snap disabled

### Resizing

- [ ] Resize to minimum size
- [ ] Resize beyond canvas bounds
- [ ] Resize from each corner
- [ ] Resize while zoomed
- [ ] Rapid resize movements

### Connections

- [ ] Create connection to self (should fail)
- [ ] Create connection to invalid type
- [ ] Create multiple connections from one component
- [ ] Create connection while zoomed
- [ ] Cancel connection with ESC
- [ ] Cancel connection with right-click

### History

- [ ] Undo multiple times
- [ ] Redo multiple times
- [ ] Undo to beginning
- [ ] Redo to end
- [ ] Make change after undo (clears future)

### Performance

- [ ] Add 50+ components
- [ ] Create 50+ connections
- [ ] Zoom in/out rapidly
- [ ] Pan rapidly
- [ ] Drag multiple components quickly

## Browser Testing

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Edge (latest)
- [ ] Safari (latest)

## Screen Size Testing

- [ ] 1920x1080 (Full HD)
- [ ] 1366x768 (Common laptop)
- [ ] 2560x1440 (2K)
- [ ] 3840x2160 (4K)

## Accessibility

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Tooltips show on hover
- [ ] Color contrast sufficient
- [ ] No flashing/strobing animations

## Known Limitations

1. No multi-select with marquee (future enhancement)
2. No alignment guides (future enhancement)
3. No component grouping (future enhancement)
4. No mini-map (future enhancement)
5. Connection labels always centered (could be improved)
6. No touch/gesture support (desktop-only)

## Report Issues

If you find issues, please note:

- Browser and version
- Screen size and zoom level
- Steps to reproduce
- Expected vs actual behavior
- Console errors (if any)

---

**Developer Server**: http://localhost:5173
**Component Location**: `/src/components/cloud/CloudArchitectureDesigner.tsx`
**Last Updated**: 2025-11-01
