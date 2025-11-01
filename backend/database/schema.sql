-- =============================================================================
-- CompTIA Network+ Learning Platform - PostgreSQL Database Schema
-- =============================================================================
-- Version: 1.0.0
-- Description: Complete database schema for the learning platform
-- Author: Database Architect
-- Created: 2025-10-29
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =============================================================================
-- CORE USER TABLES
-- =============================================================================

-- Users table: Core authentication and authorization
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'instructor', 'admin')),
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token TEXT,
    reset_token TEXT,
    reset_token_expires TIMESTAMPTZ,
    last_login TIMESTAMPTZ,
    login_count INTEGER DEFAULT 0,
    account_status VARCHAR(20) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated', 'deleted')),
    failed_login_attempts INTEGER DEFAULT 0,
    locked_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE users IS 'Core user authentication and authorization data';
COMMENT ON COLUMN users.role IS 'User role: student, instructor, or admin';
COMMENT ON COLUMN users.account_status IS 'Current account status for security and administration';
COMMENT ON COLUMN users.deleted_at IS 'Soft delete timestamp for data retention';

-- User profiles table: Personal information and preferences
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    display_name VARCHAR(100),
    bio TEXT,
    avatar_url TEXT,
    timezone VARCHAR(50) DEFAULT 'UTC',
    locale VARCHAR(10) DEFAULT 'en-US',
    date_of_birth DATE,
    phone VARCHAR(20),
    country VARCHAR(2),
    state_province VARCHAR(100),
    city VARCHAR(100),
    linkedin_url TEXT,
    github_url TEXT,
    website_url TEXT,
    occupation VARCHAR(100),
    organization VARCHAR(200),
    certifications TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_profiles IS 'Extended user profile information and personal details';
COMMENT ON COLUMN user_profiles.certifications IS 'Array of certification names/codes earned';

-- User settings table: Application preferences
CREATE TABLE user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    theme VARCHAR(20) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
    language VARCHAR(10) DEFAULT 'en',
    notifications_enabled BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT FALSE,
    study_reminders BOOLEAN DEFAULT TRUE,
    reminder_time TIME DEFAULT '09:00:00',
    reminder_days INTEGER[] DEFAULT ARRAY[1,2,3,4,5],
    accessibility_mode BOOLEAN DEFAULT FALSE,
    high_contrast BOOLEAN DEFAULT FALSE,
    font_size VARCHAR(10) DEFAULT 'medium' CHECK (font_size IN ('small', 'medium', 'large', 'xlarge')),
    reduce_motion BOOLEAN DEFAULT FALSE,
    auto_play_videos BOOLEAN DEFAULT TRUE,
    show_hints BOOLEAN DEFAULT TRUE,
    difficulty_level VARCHAR(20) DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    daily_goal_minutes INTEGER DEFAULT 30,
    privacy_settings JSONB DEFAULT '{"profile_visible": true, "progress_visible": false}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_settings IS 'User application preferences and configuration';
COMMENT ON COLUMN user_settings.reminder_days IS 'Array of weekday numbers (0=Sunday, 6=Saturday)';

-- =============================================================================
-- LEARNING CONTENT TABLES
-- =============================================================================

-- Learning components: Catalog of all learning materials
CREATE TABLE learning_components (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component_type VARCHAR(50) NOT NULL CHECK (component_type IN (
        'lesson', 'video', 'flashcard', 'quiz', 'lab', 'simulation',
        'assessment', 'reading', 'practice_exam', 'study_guide'
    )),
    domain VARCHAR(100) NOT NULL,
    subdomain VARCHAR(100),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    content JSONB,
    difficulty_level VARCHAR(20) DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    estimated_duration_minutes INTEGER,
    order_index INTEGER DEFAULT 0,
    prerequisites UUID[],
    objectives TEXT[],
    keywords TEXT[],
    comptia_objectives TEXT[],
    is_published BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    thumbnail_url TEXT,
    video_url TEXT,
    resource_urls JSONB,
    metadata JSONB,
    view_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    rating_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE learning_components IS 'Catalog of all learning materials and content';
COMMENT ON COLUMN learning_components.prerequisites IS 'Array of component IDs that should be completed first';
COMMENT ON COLUMN learning_components.comptia_objectives IS 'Array of CompTIA exam objective codes';

-- User progress: Per-component progress tracking
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES learning_components(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN (
        'not_started', 'in_progress', 'completed', 'mastered'
    )),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    time_spent_minutes INTEGER DEFAULT 0,
    last_position JSONB,
    attempts_count INTEGER DEFAULT 0,
    best_score DECIMAL(5,2),
    latest_score DECIMAL(5,2),
    completion_date TIMESTAMPTZ,
    mastery_date TIMESTAMPTZ,
    notes TEXT,
    is_bookmarked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, component_id)
);

COMMENT ON TABLE user_progress IS 'Individual user progress for each learning component';
COMMENT ON COLUMN user_progress.last_position IS 'JSON data for resuming (e.g., video timestamp, page number)';

-- Learning sessions: Time tracking and engagement
CREATE TABLE learning_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    component_id UUID REFERENCES learning_components(id) ON DELETE CASCADE,
    session_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    session_end TIMESTAMPTZ,
    duration_minutes INTEGER,
    interaction_count INTEGER DEFAULT 0,
    completion_achieved BOOLEAN DEFAULT FALSE,
    device_type VARCHAR(20) CHECK (device_type IN ('desktop', 'tablet', 'mobile')),
    browser VARCHAR(50),
    ip_address INET,
    session_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE learning_sessions IS 'Detailed session tracking for analytics and engagement metrics';
COMMENT ON COLUMN learning_sessions.session_data IS 'Additional session metadata and interactions';

-- Bookmarks: Saved positions in learning components
CREATE TABLE bookmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    component_id UUID NOT NULL REFERENCES learning_components(id) ON DELETE CASCADE,
    position JSONB NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, component_id)
);

COMMENT ON TABLE bookmarks IS 'User bookmarks for quick access to specific content positions';

-- =============================================================================
-- ASSESSMENT TABLES
-- =============================================================================

-- Assessments: Assessment definitions
CREATE TABLE assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_type VARCHAR(20) NOT NULL CHECK (assessment_type IN (
        'quiz', 'practice_exam', 'final_exam', 'checkpoint'
    )),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    domain VARCHAR(100),
    subdomain VARCHAR(100),
    difficulty_level VARCHAR(20) DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    time_limit_minutes INTEGER,
    passing_score INTEGER DEFAULT 70 CHECK (passing_score >= 0 AND passing_score <= 100),
    total_questions INTEGER NOT NULL,
    question_ids UUID[] NOT NULL,
    randomize_questions BOOLEAN DEFAULT TRUE,
    randomize_answers BOOLEAN DEFAULT TRUE,
    show_answers_after BOOLEAN DEFAULT FALSE,
    allow_review BOOLEAN DEFAULT TRUE,
    max_attempts INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    comptia_objectives TEXT[],
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    published_at TIMESTAMPTZ,
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE assessments IS 'Assessment definitions and configuration';
COMMENT ON COLUMN assessments.question_ids IS 'Array of question IDs from question_bank';

-- Question bank: Reusable questions
CREATE TABLE question_bank (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_type VARCHAR(20) NOT NULL CHECK (question_type IN (
        'multiple_choice', 'multiple_select', 'true_false',
        'fill_blank', 'matching', 'simulation'
    )),
    domain VARCHAR(100) NOT NULL,
    subdomain VARCHAR(100),
    difficulty_level VARCHAR(20) DEFAULT 'intermediate' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    question_text TEXT NOT NULL,
    question_data JSONB NOT NULL,
    correct_answer JSONB NOT NULL,
    explanation TEXT,
    hints TEXT[],
    points INTEGER DEFAULT 1,
    tags TEXT[],
    comptia_objectives TEXT[],
    usage_count INTEGER DEFAULT 0,
    correct_count INTEGER DEFAULT 0,
    incorrect_count INTEGER DEFAULT 0,
    average_time_seconds INTEGER,
    is_published BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

COMMENT ON TABLE question_bank IS 'Reusable question pool for all assessments';
COMMENT ON COLUMN question_bank.question_data IS 'Question-specific data (options, matching pairs, etc.)';

-- Assessment attempts: User attempts with scores
CREATE TABLE assessment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    attempt_number INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'in_progress' CHECK (status IN (
        'in_progress', 'completed', 'abandoned', 'timed_out'
    )),
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    time_spent_minutes INTEGER,
    score DECIMAL(5,2),
    percentage DECIMAL(5,2),
    passed BOOLEAN,
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER DEFAULT 0,
    incorrect_answers INTEGER DEFAULT 0,
    skipped_questions INTEGER DEFAULT 0,
    question_order UUID[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE assessment_attempts IS 'Individual user attempts at assessments';
COMMENT ON COLUMN assessment_attempts.question_order IS 'Actual order questions were presented';

-- Assessment answers: Detailed answer data
CREATE TABLE assessment_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    attempt_id UUID NOT NULL REFERENCES assessment_attempts(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES question_bank(id) ON DELETE CASCADE,
    user_answer JSONB,
    is_correct BOOLEAN,
    points_earned DECIMAL(5,2),
    time_spent_seconds INTEGER,
    flagged_for_review BOOLEAN DEFAULT FALSE,
    answer_order INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE assessment_answers IS 'Individual answers for each question in an attempt';

-- =============================================================================
-- PROGRESS TRACKING TABLES
-- =============================================================================

-- Achievements: Badges and milestones
CREATE TABLE achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    achievement_type VARCHAR(20) NOT NULL CHECK (achievement_type IN (
        'badge', 'milestone', 'streak', 'mastery', 'special'
    )),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url TEXT,
    criteria JSONB NOT NULL,
    points INTEGER DEFAULT 0,
    rarity VARCHAR(20) DEFAULT 'common' CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE achievements IS 'Definitions of all achievements, badges, and milestones';
COMMENT ON COLUMN achievements.criteria IS 'JSON criteria for earning the achievement';

-- User achievements: Earned achievements
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    progress_data JSONB,
    UNIQUE(user_id, achievement_id)
);

COMMENT ON TABLE user_achievements IS 'Achievements earned by users';

-- Learning streaks: Daily engagement tracking
CREATE TABLE learning_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    streak_start_date DATE,
    total_active_days INTEGER DEFAULT 0,
    streak_frozen_days INTEGER DEFAULT 0,
    streak_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE learning_streaks IS 'User learning streak tracking and history';
COMMENT ON COLUMN learning_streaks.streak_frozen_days IS 'Days remaining where streak is protected';

-- Study goals: User-defined goals
CREATE TABLE study_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    goal_type VARCHAR(20) NOT NULL CHECK (goal_type IN (
        'daily', 'weekly', 'monthly', 'exam_date', 'custom'
    )),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    target_value INTEGER NOT NULL,
    current_value INTEGER DEFAULT 0,
    metric VARCHAR(50) NOT NULL CHECK (metric IN (
        'minutes', 'components', 'assessments', 'score', 'streak'
    )),
    start_date DATE NOT NULL,
    target_date DATE,
    completed_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN (
        'active', 'completed', 'failed', 'abandoned'
    )),
    reminder_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE study_goals IS 'User-defined study goals and targets';

-- =============================================================================
-- ANALYTICS TABLES
-- =============================================================================

-- User activity logs: Audit trail
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL,
    activity_description TEXT,
    resource_type VARCHAR(50),
    resource_id UUID,
    metadata JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE user_activity_logs IS 'Comprehensive activity log for auditing and analytics';

-- Component analytics: Usage statistics
CREATE TABLE component_analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    component_id UUID NOT NULL REFERENCES learning_components(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    unique_users INTEGER DEFAULT 0,
    completions INTEGER DEFAULT 0,
    average_time_minutes DECIMAL(10,2),
    average_score DECIMAL(5,2),
    engagement_rate DECIMAL(5,2),
    bounce_rate DECIMAL(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(component_id, date)
);

COMMENT ON TABLE component_analytics IS 'Daily aggregated analytics per learning component';

-- Performance metrics: System health
CREATE TABLE performance_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_type VARCHAR(50) NOT NULL,
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,4) NOT NULL,
    unit VARCHAR(20),
    tags JSONB,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE performance_metrics IS 'System performance and health metrics';

-- =============================================================================
-- INDEXES FOR QUERY OPTIMIZATION
-- =============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_account_status ON users(account_status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- User progress indexes
CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_component_id ON user_progress(component_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);
CREATE INDEX idx_user_progress_updated_at ON user_progress(updated_at);

-- Learning components indexes
CREATE INDEX idx_learning_components_type ON learning_components(component_type);
CREATE INDEX idx_learning_components_domain ON learning_components(domain);
CREATE INDEX idx_learning_components_subdomain ON learning_components(subdomain);
CREATE INDEX idx_learning_components_published ON learning_components(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_learning_components_difficulty ON learning_components(difficulty_level);
CREATE INDEX idx_learning_components_slug ON learning_components(slug);

-- Learning sessions indexes
CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_learning_sessions_component_id ON learning_sessions(component_id);
CREATE INDEX idx_learning_sessions_start ON learning_sessions(session_start);
CREATE INDEX idx_learning_sessions_created_at ON learning_sessions(created_at);

-- Assessment attempts indexes
CREATE INDEX idx_assessment_attempts_user_id ON assessment_attempts(user_id);
CREATE INDEX idx_assessment_attempts_assessment_id ON assessment_attempts(assessment_id);
CREATE INDEX idx_assessment_attempts_status ON assessment_attempts(status);
CREATE INDEX idx_assessment_attempts_completed_at ON assessment_attempts(completed_at);

-- Assessment answers indexes
CREATE INDEX idx_assessment_answers_attempt_id ON assessment_answers(attempt_id);
CREATE INDEX idx_assessment_answers_question_id ON assessment_answers(question_id);
CREATE INDEX idx_assessment_answers_is_correct ON assessment_answers(is_correct);

-- Question bank indexes
CREATE INDEX idx_question_bank_type ON question_bank(question_type);
CREATE INDEX idx_question_bank_domain ON question_bank(domain);
CREATE INDEX idx_question_bank_subdomain ON question_bank(subdomain);
CREATE INDEX idx_question_bank_difficulty ON question_bank(difficulty_level);
CREATE INDEX idx_question_bank_published ON question_bank(is_published) WHERE is_published = TRUE;

-- User achievements indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_earned_at ON user_achievements(earned_at);

-- Study goals indexes
CREATE INDEX idx_study_goals_user_id ON study_goals(user_id);
CREATE INDEX idx_study_goals_status ON study_goals(status);
CREATE INDEX idx_study_goals_target_date ON study_goals(target_date);

-- User activity logs indexes
CREATE INDEX idx_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_type ON user_activity_logs(activity_type);
CREATE INDEX idx_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX idx_activity_logs_resource ON user_activity_logs(resource_type, resource_id);

-- Component analytics indexes
CREATE INDEX idx_component_analytics_component_id ON component_analytics(component_id);
CREATE INDEX idx_component_analytics_date ON component_analytics(date);

-- Performance metrics indexes
CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- =============================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply update trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_components_updated_at BEFORE UPDATE ON learning_components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookmarks_updated_at BEFORE UPDATE ON bookmarks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_question_bank_updated_at BEFORE UPDATE ON question_bank
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_attempts_updated_at BEFORE UPDATE ON assessment_attempts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_answers_updated_at BEFORE UPDATE ON assessment_answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_streaks_updated_at BEFORE UPDATE ON learning_streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_goals_updated_at BEFORE UPDATE ON study_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_component_analytics_updated_at BEFORE UPDATE ON component_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- User learning statistics view
CREATE OR REPLACE VIEW v_user_learning_stats AS
SELECT
    u.id AS user_id,
    u.username,
    COUNT(DISTINCT up.component_id) AS total_components_started,
    COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.component_id END) AS components_completed,
    COUNT(DISTINCT CASE WHEN up.status = 'mastered' THEN up.component_id END) AS components_mastered,
    COALESCE(SUM(up.time_spent_minutes), 0) AS total_time_minutes,
    COALESCE(AVG(up.progress_percentage), 0) AS avg_progress_percentage,
    ls.current_streak,
    ls.longest_streak,
    COUNT(DISTINCT ua.achievement_id) AS achievements_earned
FROM users u
LEFT JOIN user_progress up ON u.id = up.user_id
LEFT JOIN learning_streaks ls ON u.id = ls.user_id
LEFT JOIN user_achievements ua ON u.id = ua.user_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.username, ls.current_streak, ls.longest_streak;

COMMENT ON VIEW v_user_learning_stats IS 'Aggregated learning statistics per user';

-- Component performance view
CREATE OR REPLACE VIEW v_component_performance AS
SELECT
    lc.id AS component_id,
    lc.title,
    lc.component_type,
    lc.domain,
    lc.difficulty_level,
    COUNT(DISTINCT up.user_id) AS unique_users,
    COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.user_id END) AS completion_count,
    COALESCE(AVG(up.progress_percentage), 0) AS avg_progress,
    COALESCE(AVG(up.time_spent_minutes), 0) AS avg_time_minutes,
    COALESCE(AVG(up.latest_score), 0) AS avg_score,
    lc.average_rating
FROM learning_components lc
LEFT JOIN user_progress up ON lc.id = up.component_id
WHERE lc.deleted_at IS NULL AND lc.is_published = TRUE
GROUP BY lc.id, lc.title, lc.component_type, lc.domain, lc.difficulty_level, lc.average_rating;

COMMENT ON VIEW v_component_performance IS 'Performance metrics for learning components';

-- =============================================================================
-- MATERIALIZED VIEWS FOR ANALYTICS
-- =============================================================================

-- Daily user activity summary
CREATE MATERIALIZED VIEW mv_daily_user_activity AS
SELECT
    DATE(ls.session_start) AS activity_date,
    COUNT(DISTINCT ls.user_id) AS active_users,
    COUNT(*) AS total_sessions,
    COALESCE(SUM(ls.duration_minutes), 0) AS total_minutes,
    COALESCE(AVG(ls.duration_minutes), 0) AS avg_session_minutes,
    COUNT(DISTINCT CASE WHEN ls.completion_achieved THEN ls.user_id END) AS users_with_completions
FROM learning_sessions ls
GROUP BY DATE(ls.session_start);

CREATE UNIQUE INDEX idx_mv_daily_user_activity ON mv_daily_user_activity(activity_date);

COMMENT ON MATERIALIZED VIEW mv_daily_user_activity IS 'Daily aggregated user activity metrics';

-- =============================================================================
-- DATABASE FUNCTIONS
-- =============================================================================

-- Function to calculate user's overall progress
CREATE OR REPLACE FUNCTION calculate_overall_progress(p_user_id UUID)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    v_progress DECIMAL(5,2);
BEGIN
    SELECT COALESCE(AVG(progress_percentage), 0)
    INTO v_progress
    FROM user_progress
    WHERE user_id = p_user_id;

    RETURN v_progress;
END;
$$ LANGUAGE plpgsql;

-- Function to update learning streak
CREATE OR REPLACE FUNCTION update_learning_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
    v_last_activity DATE;
    v_current_streak INTEGER;
    v_today DATE := CURRENT_DATE;
BEGIN
    SELECT last_activity_date, current_streak
    INTO v_last_activity, v_current_streak
    FROM learning_streaks
    WHERE user_id = p_user_id;

    IF v_last_activity IS NULL THEN
        -- First activity
        INSERT INTO learning_streaks (user_id, current_streak, longest_streak, last_activity_date, streak_start_date, total_active_days)
        VALUES (p_user_id, 1, 1, v_today, v_today, 1);
    ELSIF v_last_activity = v_today THEN
        -- Already counted today
        RETURN;
    ELSIF v_last_activity = v_today - 1 THEN
        -- Consecutive day
        UPDATE learning_streaks
        SET current_streak = current_streak + 1,
            longest_streak = GREATEST(longest_streak, current_streak + 1),
            last_activity_date = v_today,
            total_active_days = total_active_days + 1
        WHERE user_id = p_user_id;
    ELSE
        -- Streak broken
        UPDATE learning_streaks
        SET current_streak = 1,
            last_activity_date = v_today,
            streak_start_date = v_today,
            total_active_days = total_active_days + 1
        WHERE user_id = p_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- GRANT PERMISSIONS
-- =============================================================================

-- Note: Adjust these based on your actual database roles
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- =============================================================================
-- END OF SCHEMA
-- =============================================================================
