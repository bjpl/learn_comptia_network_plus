-- =============================================================================
-- Migration 004: Create Analytics and Progress Tracking Tables
-- =============================================================================
-- Description: Create achievement, analytics, and monitoring tables
-- Version: 1.0.0
-- Author: Database Architect
-- Created: 2025-10-29
-- Dependencies: 001_create_users.sql, 002_create_learning.sql
-- =============================================================================

-- =============================================================================
-- UP MIGRATION
-- =============================================================================

-- Achievements definition
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

-- User achievements tracking
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    progress_data JSONB,
    UNIQUE(user_id, achievement_id)
);

COMMENT ON TABLE user_achievements IS 'Achievements earned by users';

-- Learning streaks tracking
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

-- Study goals
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

-- User activity logs for auditing
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

-- Component analytics aggregation
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

-- System performance metrics
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

-- Create indexes
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement_id ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_earned_at ON user_achievements(earned_at);

CREATE INDEX idx_study_goals_user_id ON study_goals(user_id);
CREATE INDEX idx_study_goals_status ON study_goals(status);
CREATE INDEX idx_study_goals_target_date ON study_goals(target_date);

CREATE INDEX idx_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX idx_activity_logs_type ON user_activity_logs(activity_type);
CREATE INDEX idx_activity_logs_created_at ON user_activity_logs(created_at);
CREATE INDEX idx_activity_logs_resource ON user_activity_logs(resource_type, resource_id);

CREATE INDEX idx_component_analytics_component_id ON component_analytics(component_id);
CREATE INDEX idx_component_analytics_date ON component_analytics(date);

CREATE INDEX idx_performance_metrics_type ON performance_metrics(metric_type);
CREATE INDEX idx_performance_metrics_timestamp ON performance_metrics(timestamp);

-- Apply update triggers
CREATE TRIGGER update_achievements_updated_at BEFORE UPDATE ON achievements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_learning_streaks_updated_at BEFORE UPDATE ON learning_streaks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_study_goals_updated_at BEFORE UPDATE ON study_goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_component_analytics_updated_at BEFORE UPDATE ON component_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- DOWN MIGRATION
-- =============================================================================

-- To rollback this migration, run the following:
/*
DROP TRIGGER IF EXISTS update_component_analytics_updated_at ON component_analytics;
DROP TRIGGER IF EXISTS update_study_goals_updated_at ON study_goals;
DROP TRIGGER IF EXISTS update_learning_streaks_updated_at ON learning_streaks;
DROP TRIGGER IF EXISTS update_achievements_updated_at ON achievements;
DROP TABLE IF EXISTS performance_metrics CASCADE;
DROP TABLE IF EXISTS component_analytics CASCADE;
DROP TABLE IF EXISTS user_activity_logs CASCADE;
DROP TABLE IF EXISTS study_goals CASCADE;
DROP TABLE IF EXISTS learning_streaks CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
*/
