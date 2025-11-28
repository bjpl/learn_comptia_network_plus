-- Migration: Add account lockout fields to users table
-- Date: 2025-11-27
-- Description: Add failed_login_attempts, locked_until, and last_failed_login fields

-- Add new columns to users table if they don't exist
ALTER TABLE users
ADD COLUMN IF NOT EXISTS failed_login_attempts INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS locked_until TIMESTAMP,
ADD COLUMN IF NOT EXISTS last_failed_login TIMESTAMP;

-- Initialize existing records with default values
UPDATE users
SET failed_login_attempts = 0
WHERE failed_login_attempts IS NULL;

-- Add index for performance on locked_until checks
CREATE INDEX IF NOT EXISTS idx_users_locked_until ON users(locked_until)
WHERE locked_until IS NOT NULL;

-- Add index for failed login tracking
CREATE INDEX IF NOT EXISTS idx_users_last_failed_login ON users(last_failed_login)
WHERE last_failed_login IS NOT NULL;
