-- =============================================================================
-- Migration 005: Create Additional Indexes and Views
-- =============================================================================
-- Description: Create views, materialized views, and database functions
-- Version: 1.0.0
-- Author: Database Architect
-- Created: 2025-10-29
-- Dependencies: All previous migrations
-- =============================================================================

-- =============================================================================
-- UP MIGRATION
-- =============================================================================

-- =============================================================================
-- VIEWS FOR COMMON QUERIES
-- =============================================================================

-- User learning statistics view
CREATE OR REPLACE VIEW v_user_learning_stats AS
SELECT
    u.id AS user_id,
    u.username,
    u.email,
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
GROUP BY u.id, u.username, u.email, ls.current_streak, ls.longest_streak;

COMMENT ON VIEW v_user_learning_stats IS 'Aggregated learning statistics per user';

-- Component performance view
CREATE OR REPLACE VIEW v_component_performance AS
SELECT
    lc.id AS component_id,
    lc.title,
    lc.component_type,
    lc.domain,
    lc.subdomain,
    lc.difficulty_level,
    COUNT(DISTINCT up.user_id) AS unique_users,
    COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.user_id END) AS completion_count,
    COALESCE(AVG(up.progress_percentage), 0) AS avg_progress,
    COALESCE(AVG(up.time_spent_minutes), 0) AS avg_time_minutes,
    COALESCE(AVG(up.latest_score), 0) AS avg_score,
    lc.average_rating,
    lc.view_count
FROM learning_components lc
LEFT JOIN user_progress up ON lc.id = up.component_id
WHERE lc.deleted_at IS NULL AND lc.is_published = TRUE
GROUP BY lc.id, lc.title, lc.component_type, lc.domain, lc.subdomain,
         lc.difficulty_level, lc.average_rating, lc.view_count;

COMMENT ON VIEW v_component_performance IS 'Performance metrics for learning components';

-- Assessment performance view
CREATE OR REPLACE VIEW v_assessment_performance AS
SELECT
    a.id AS assessment_id,
    a.title,
    a.assessment_type,
    a.domain,
    a.difficulty_level,
    COUNT(DISTINCT aa.user_id) AS total_attempts_by_users,
    COUNT(*) AS total_attempts,
    AVG(aa.percentage) AS avg_score,
    COUNT(CASE WHEN aa.passed = TRUE THEN 1 END) AS pass_count,
    COUNT(CASE WHEN aa.passed = FALSE THEN 1 END) AS fail_count,
    AVG(aa.time_spent_minutes) AS avg_time_minutes,
    a.passing_score
FROM assessments a
LEFT JOIN assessment_attempts aa ON a.id = aa.assessment_id
WHERE a.deleted_at IS NULL AND a.is_published = TRUE
  AND aa.status = 'completed'
GROUP BY a.id, a.title, a.assessment_type, a.domain, a.difficulty_level, a.passing_score;

COMMENT ON VIEW v_assessment_performance IS 'Performance metrics for assessments';

-- User assessment history view
CREATE OR REPLACE VIEW v_user_assessment_history AS
SELECT
    u.id AS user_id,
    u.username,
    a.id AS assessment_id,
    a.title AS assessment_title,
    aa.attempt_number,
    aa.status,
    aa.score,
    aa.percentage,
    aa.passed,
    aa.time_spent_minutes,
    aa.started_at,
    aa.completed_at,
    aa.total_questions,
    aa.correct_answers,
    aa.incorrect_answers
FROM users u
INNER JOIN assessment_attempts aa ON u.id = aa.user_id
INNER JOIN assessments a ON aa.assessment_id = a.id
WHERE u.deleted_at IS NULL;

COMMENT ON VIEW v_user_assessment_history IS 'Complete user assessment attempt history';

-- Question performance view
CREATE OR REPLACE VIEW v_question_performance AS
SELECT
    qb.id AS question_id,
    qb.question_type,
    qb.domain,
    qb.subdomain,
    qb.difficulty_level,
    qb.usage_count,
    qb.correct_count,
    qb.incorrect_count,
    CASE
        WHEN (qb.correct_count + qb.incorrect_count) > 0
        THEN ROUND(100.0 * qb.correct_count / (qb.correct_count + qb.incorrect_count), 2)
        ELSE 0
    END AS success_rate,
    qb.average_time_seconds,
    qb.points
FROM question_bank qb
WHERE qb.deleted_at IS NULL AND qb.is_published = TRUE;

COMMENT ON VIEW v_question_performance IS 'Performance metrics for individual questions';

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
    COUNT(DISTINCT CASE WHEN ls.completion_achieved THEN ls.user_id END) AS users_with_completions,
    COUNT(CASE WHEN ls.completion_achieved THEN 1 END) AS total_completions
FROM learning_sessions ls
GROUP BY DATE(ls.session_start);

CREATE UNIQUE INDEX idx_mv_daily_user_activity ON mv_daily_user_activity(activity_date);

COMMENT ON MATERIALIZED VIEW mv_daily_user_activity IS 'Daily aggregated user activity metrics';

-- Weekly domain progress
CREATE MATERIALIZED VIEW mv_weekly_domain_progress AS
SELECT
    DATE_TRUNC('week', up.updated_at) AS week_start,
    lc.domain,
    COUNT(DISTINCT up.user_id) AS active_users,
    COUNT(DISTINCT up.component_id) AS components_in_progress,
    COUNT(CASE WHEN up.status = 'completed' THEN 1 END) AS completions,
    AVG(up.progress_percentage) AS avg_progress,
    SUM(up.time_spent_minutes) AS total_time_minutes
FROM user_progress up
INNER JOIN learning_components lc ON up.component_id = lc.id
GROUP BY DATE_TRUNC('week', up.updated_at), lc.domain;

CREATE INDEX idx_mv_weekly_domain_week ON mv_weekly_domain_progress(week_start);
CREATE INDEX idx_mv_weekly_domain_domain ON mv_weekly_domain_progress(domain);

COMMENT ON MATERIALIZED VIEW mv_weekly_domain_progress IS 'Weekly progress aggregated by domain';

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

COMMENT ON FUNCTION calculate_overall_progress(UUID) IS 'Calculate user overall progress percentage';

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

COMMENT ON FUNCTION update_learning_streak(UUID) IS 'Update user learning streak based on activity';

-- Function to check and award achievements
CREATE OR REPLACE FUNCTION check_and_award_achievement(p_user_id UUID, p_achievement_code VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    v_achievement_id UUID;
    v_already_earned BOOLEAN;
BEGIN
    -- Get achievement ID
    SELECT id INTO v_achievement_id
    FROM achievements
    WHERE code = p_achievement_code AND is_active = TRUE;

    IF v_achievement_id IS NULL THEN
        RETURN FALSE;
    END IF;

    -- Check if already earned
    SELECT EXISTS(
        SELECT 1 FROM user_achievements
        WHERE user_id = p_user_id AND achievement_id = v_achievement_id
    ) INTO v_already_earned;

    IF v_already_earned THEN
        RETURN FALSE;
    END IF;

    -- Award achievement
    INSERT INTO user_achievements (user_id, achievement_id)
    VALUES (p_user_id, v_achievement_id);

    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_and_award_achievement(UUID, VARCHAR) IS 'Award achievement to user if not already earned';

-- Function to get user dashboard summary
CREATE OR REPLACE FUNCTION get_user_dashboard_summary(p_user_id UUID)
RETURNS TABLE(
    total_components_started BIGINT,
    components_completed BIGINT,
    total_time_minutes NUMERIC,
    current_streak INTEGER,
    achievements_count BIGINT,
    avg_assessment_score DECIMAL(5,2),
    active_goals INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(DISTINCT up.component_id) AS total_components_started,
        COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.component_id END) AS components_completed,
        COALESCE(SUM(up.time_spent_minutes), 0) AS total_time_minutes,
        COALESCE(ls.current_streak, 0) AS current_streak,
        COUNT(DISTINCT ua.achievement_id) AS achievements_count,
        COALESCE(AVG(aa.percentage), 0) AS avg_assessment_score,
        (SELECT COUNT(*) FROM study_goals WHERE user_id = p_user_id AND status = 'active')::INTEGER AS active_goals
    FROM users u
    LEFT JOIN user_progress up ON u.id = up.user_id
    LEFT JOIN learning_streaks ls ON u.id = ls.user_id
    LEFT JOIN user_achievements ua ON u.id = ua.user_id
    LEFT JOIN assessment_attempts aa ON u.id = aa.user_id AND aa.status = 'completed'
    WHERE u.id = p_user_id
    GROUP BY u.id, ls.current_streak;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_user_dashboard_summary(UUID) IS 'Get comprehensive dashboard summary for user';

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_views()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_daily_user_activity;
    REFRESH MATERIALIZED VIEW CONCURRENTLY mv_weekly_domain_progress;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION refresh_analytics_views() IS 'Refresh all materialized views for analytics';

-- =============================================================================
-- DOWN MIGRATION
-- =============================================================================

-- To rollback this migration, run the following:
/*
DROP FUNCTION IF EXISTS refresh_analytics_views();
DROP FUNCTION IF EXISTS get_user_dashboard_summary(UUID);
DROP FUNCTION IF EXISTS check_and_award_achievement(UUID, VARCHAR);
DROP FUNCTION IF EXISTS update_learning_streak(UUID);
DROP FUNCTION IF EXISTS calculate_overall_progress(UUID);
DROP MATERIALIZED VIEW IF EXISTS mv_weekly_domain_progress;
DROP MATERIALIZED VIEW IF EXISTS mv_daily_user_activity;
DROP VIEW IF EXISTS v_question_performance;
DROP VIEW IF EXISTS v_user_assessment_history;
DROP VIEW IF EXISTS v_assessment_performance;
DROP VIEW IF EXISTS v_component_performance;
DROP VIEW IF EXISTS v_user_learning_stats;
*/
