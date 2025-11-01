# Accessibility Fixes - Dark Mode Contrast Issues

## Issues Identified

Components with `text-gray-700/800/900` that need `dark:text-gray-200/300` for proper contrast on dark backgrounds.

## Solution Strategy

Add dark mode text colors globally to ensure WCAG AA contrast (4.5:1 minimum).

### Text Color Mapping

- `text-gray-700` → add `dark:text-gray-300`
- `text-gray-800` → add `dark:text-gray-200`
- `text-gray-900` → add `dark:text-gray-100`

## Files to Fix

Based on grep search, approximately 15-20 component files need updates.

## Global CSS Approach

Adding utility classes in index.css for automatic dark mode text adjustment.
