-- =============================================================================
-- Seed Data: Demo Users
-- =============================================================================
-- Description: Create demo user accounts for development and testing
-- Version: 1.0.0
-- Author: Database Architect
-- Created: 2025-10-29
-- Note: Passwords are 'password123' hashed with bcrypt
-- =============================================================================

-- Insert demo users
INSERT INTO users (email, username, password_hash, role, email_verified, account_status) VALUES
-- Admin account
('admin@network.test', 'admin', '$2a$10$rZj8XKkqL5YHj3EJGVnJxO4z6QKKJz0QH1.fQzEZLqXZaEXEZH.2G', 'admin', TRUE, 'active'),

-- Instructor account
('instructor@network.test', 'instructor_john', '$2a$10$rZj8XKkqL5YHj3EJGVnJxO4z6QKKJz0QH1.fQzEZLqXZaEXEZH.2G', 'instructor', TRUE, 'active'),

-- Student accounts
('student1@network.test', 'sarah_network', '$2a$10$rZj8XKkqL5YHj3EJGVnJxO4z6QKKJz0QH1.fQzEZLqXZaEXEZH.2G', 'student', TRUE, 'active'),
('student2@network.test', 'mike_netplus', '$2a$10$rZj8XKkqL5YHj3EJGVnJxO4z6QKKJz0QH1.fQzEZLqXZaEXEZH.2G', 'student', TRUE, 'active'),
('student3@network.test', 'jane_tech', '$2a$10$rZj8XKkqL5YHj3EJGVnJxO4z6QKKJz0QH1.fQzEZLqXZaEXEZH.2G', 'student', TRUE, 'active'),

-- Inactive student for testing
('inactive@network.test', 'inactive_user', '$2a$10$rZj8XKkqL5YHj3EJGVnJxO4z6QKKJz0QH1.fQzEZLqXZaEXEZH.2G', 'student', FALSE, 'active');

-- Insert user profiles
INSERT INTO user_profiles (user_id, first_name, last_name, display_name, bio, timezone, country)
SELECT
    u.id,
    CASE u.username
        WHEN 'admin' THEN 'Admin'
        WHEN 'instructor_john' THEN 'John'
        WHEN 'sarah_network' THEN 'Sarah'
        WHEN 'mike_netplus' THEN 'Mike'
        WHEN 'jane_tech' THEN 'Jane'
        WHEN 'inactive_user' THEN 'Inactive'
    END,
    CASE u.username
        WHEN 'admin' THEN 'User'
        WHEN 'instructor_john' THEN 'Smith'
        WHEN 'sarah_network' THEN 'Johnson'
        WHEN 'mike_netplus' THEN 'Wilson'
        WHEN 'jane_tech' THEN 'Davis'
        WHEN 'inactive_user' THEN 'User'
    END,
    CASE u.username
        WHEN 'admin' THEN 'Platform Administrator'
        WHEN 'instructor_john' THEN 'Instructor John'
        WHEN 'sarah_network' THEN 'Sarah J.'
        WHEN 'mike_netplus' THEN 'Mike W.'
        WHEN 'jane_tech' THEN 'Jane D.'
        WHEN 'inactive_user' THEN 'Inactive'
    END,
    CASE u.username
        WHEN 'admin' THEN 'Platform administrator with full access to all features and settings.'
        WHEN 'instructor_john' THEN 'Certified Network+ instructor with 10 years of experience in IT networking.'
        WHEN 'sarah_network' THEN 'Aspiring network engineer preparing for CompTIA Network+ certification.'
        WHEN 'mike_netplus' THEN 'IT professional studying for Network+ to advance career.'
        WHEN 'jane_tech' THEN 'Computer science student interested in network administration.'
        ELSE NULL
    END,
    'America/New_York',
    'US'
FROM users u;

-- Insert user settings (using defaults for most)
INSERT INTO user_settings (user_id, theme, daily_goal_minutes)
SELECT
    u.id,
    CASE u.username
        WHEN 'admin' THEN 'dark'
        WHEN 'instructor_john' THEN 'light'
        WHEN 'sarah_network' THEN 'system'
        WHEN 'mike_netplus' THEN 'dark'
        WHEN 'jane_tech' THEN 'light'
        WHEN 'inactive_user' THEN 'system'
    END,
    CASE u.username
        WHEN 'sarah_network' THEN 60
        WHEN 'mike_netplus' THEN 45
        WHEN 'jane_tech' THEN 30
        ELSE 30
    END
FROM users u;

-- Initialize learning streaks for active students
INSERT INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_start_date, total_active_days)
SELECT
    u.id,
    CASE u.username
        WHEN 'sarah_network' THEN 7
        WHEN 'mike_netplus' THEN 3
        WHEN 'jane_tech' THEN 1
        ELSE 0
    END,
    CASE u.username
        WHEN 'sarah_network' THEN 15
        WHEN 'mike_netplus' THEN 8
        WHEN 'jane_tech' THEN 1
        ELSE 0
    END,
    CASE u.username
        WHEN 'sarah_network' THEN CURRENT_DATE
        WHEN 'mike_netplus' THEN CURRENT_DATE
        WHEN 'jane_tech' THEN CURRENT_DATE
        ELSE NULL
    END,
    CASE u.username
        WHEN 'sarah_network' THEN CURRENT_DATE - 6
        WHEN 'mike_netplus' THEN CURRENT_DATE - 2
        WHEN 'jane_tech' THEN CURRENT_DATE
        ELSE NULL
    END,
    CASE u.username
        WHEN 'sarah_network' THEN 22
        WHEN 'mike_netplus' THEN 15
        WHEN 'jane_tech' THEN 1
        ELSE 0
    END
FROM users u
WHERE u.role = 'student';

-- Create sample study goals
INSERT INTO study_goals (user_id, goal_type, title, description, target_value, current_value, metric, start_date, target_date, status)
SELECT
    u.id,
    'exam_date',
    'Pass CompTIA Network+ Exam',
    'Complete all study materials and practice exams before exam date',
    100,
    CASE u.username
        WHEN 'sarah_network' THEN 45
        WHEN 'mike_netplus' THEN 20
        WHEN 'jane_tech' THEN 5
        ELSE 0
    END,
    'components',
    CURRENT_DATE - 30,
    CURRENT_DATE + 60,
    'active'
FROM users u
WHERE u.username IN ('sarah_network', 'mike_netplus', 'jane_tech');

-- Log initial activities
INSERT INTO user_activity_logs (user_id, activity_type, activity_description, ip_address)
SELECT
    u.id,
    'user_registered',
    'User account created',
    '127.0.0.1'
FROM users u;

COMMENT ON TABLE users IS 'Demo credentials: admin@network.test / instructor@network.test / student1@network.test - all use password: password123';
