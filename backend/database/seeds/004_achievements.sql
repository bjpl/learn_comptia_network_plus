-- =============================================================================
-- Seed Data: Achievements and Badges
-- =============================================================================
-- Description: Create achievement definitions for gamification
-- Version: 1.0.0
-- Author: Database Architect
-- Created: 2025-10-29
-- =============================================================================

-- Insert achievement definitions
INSERT INTO achievements (achievement_type, code, name, description, icon_url, criteria, points, rarity, order_index) VALUES
-- Getting Started Badges
('badge', 'FIRST_LOGIN', 'Welcome Aboard',
 'Log in to the platform for the first time',
 '/badges/welcome.svg',
 '{"type": "login_count", "threshold": 1}'::jsonb,
 10, 'common', 1),

('badge', 'PROFILE_COMPLETE', 'Profile Master',
 'Complete your user profile with all information',
 '/badges/profile.svg',
 '{"type": "profile_completion", "threshold": 100}'::jsonb,
 25, 'common', 2),

-- Streak Achievements
('streak', 'STREAK_3', '3-Day Streak',
 'Study for 3 consecutive days',
 '/badges/streak-3.svg',
 '{"type": "streak", "days": 3}'::jsonb,
 50, 'common', 3),

('streak', 'STREAK_7', 'Week Warrior',
 'Study for 7 consecutive days',
 '/badges/streak-7.svg',
 '{"type": "streak", "days": 7}'::jsonb,
 100, 'uncommon', 4),

('streak', 'STREAK_30', 'Monthly Master',
 'Study for 30 consecutive days',
 '/badges/streak-30.svg',
 '{"type": "streak", "days": 30}'::jsonb,
 500, 'rare', 5),

('streak', 'STREAK_100', 'Centurion',
 'Study for 100 consecutive days',
 '/badges/streak-100.svg',
 '{"type": "streak", "days": 100}'::jsonb,
 2000, 'legendary', 6),

-- Component Completion Milestones
('milestone', 'COMPLETE_10', 'Getting Started',
 'Complete 10 learning components',
 '/badges/complete-10.svg',
 '{"type": "components_completed", "threshold": 10}'::jsonb,
 100, 'common', 7),

('milestone', 'COMPLETE_50', 'Dedicated Learner',
 'Complete 50 learning components',
 '/badges/complete-50.svg',
 '{"type": "components_completed", "threshold": 50}'::jsonb,
 500, 'uncommon', 8),

('milestone', 'COMPLETE_ALL', 'Completionist',
 'Complete all available learning components',
 '/badges/complete-all.svg',
 '{"type": "components_completed", "threshold": 100, "percentage": 100}'::jsonb,
 2000, 'epic', 9),

-- Domain Mastery
('mastery', 'MASTER_FUNDAMENTALS', 'Fundamentals Master',
 'Master all Networking Fundamentals components',
 '/badges/master-fundamentals.svg',
 '{"type": "domain_mastery", "domain": "Networking Fundamentals"}'::jsonb,
 300, 'uncommon', 10),

('mastery', 'MASTER_IMPLEMENTATIONS', 'Implementation Expert',
 'Master all Network Implementations components',
 '/badges/master-implementations.svg',
 '{"type": "domain_mastery", "domain": "Network Implementations"}'::jsonb,
 300, 'uncommon', 11),

('mastery', 'MASTER_OPERATIONS', 'Operations Pro',
 'Master all Network Operations components',
 '/badges/master-operations.svg',
 '{"type": "domain_mastery", "domain": "Network Operations"}'::jsonb,
 300, 'uncommon', 12),

('mastery', 'MASTER_SECURITY', 'Security Specialist',
 'Master all Network Security components',
 '/badges/master-security.svg',
 '{"type": "domain_mastery", "domain": "Network Security"}'::jsonb,
 300, 'uncommon', 13),

('mastery', 'MASTER_TROUBLESHOOTING', 'Troubleshooting Wizard',
 'Master all Network Troubleshooting components',
 '/badges/master-troubleshooting.svg',
 '{"type": "domain_mastery", "domain": "Network Troubleshooting"}'::jsonb,
 300, 'uncommon', 14),

-- Assessment Achievements
('badge', 'FIRST_QUIZ', 'Quiz Beginner',
 'Complete your first quiz',
 '/badges/first-quiz.svg',
 '{"type": "assessments_completed", "threshold": 1}'::jsonb,
 25, 'common', 15),

('badge', 'PERFECT_SCORE', 'Perfect Score',
 'Achieve 100% on any assessment',
 '/badges/perfect.svg',
 '{"type": "assessment_score", "percentage": 100}'::jsonb,
 200, 'rare', 16),

('badge', 'QUIZ_MASTER', 'Quiz Master',
 'Complete 25 assessments with passing scores',
 '/badges/quiz-master.svg',
 '{"type": "assessments_passed", "threshold": 25}'::jsonb,
 500, 'rare', 17),

('badge', 'PRACTICE_EXAM_PASS', 'Practice Exam Success',
 'Pass a full-length practice exam',
 '/badges/practice-pass.svg',
 '{"type": "practice_exam_passed", "threshold": 1}'::jsonb,
 150, 'uncommon', 18),

-- Time-based Achievements
('milestone', 'STUDY_10HRS', 'Dedicated Student',
 'Study for a total of 10 hours',
 '/badges/time-10.svg',
 '{"type": "study_time_minutes", "threshold": 600}'::jsonb,
 100, 'common', 19),

('milestone', 'STUDY_50HRS', 'Committed Learner',
 'Study for a total of 50 hours',
 '/badges/time-50.svg',
 '{"type": "study_time_minutes", "threshold": 3000}'::jsonb,
 500, 'uncommon', 20),

('milestone', 'STUDY_100HRS', 'Knowledge Seeker',
 'Study for a total of 100 hours',
 '/badges/time-100.svg',
 '{"type": "study_time_minutes", "threshold": 6000}'::jsonb,
 1000, 'rare', 21),

-- Special Achievements
('special', 'EARLY_BIRD', 'Early Bird',
 'Start a study session before 6 AM',
 '/badges/early-bird.svg',
 '{"type": "session_time", "before": "06:00"}'::jsonb,
 50, 'uncommon', 22),

('special', 'NIGHT_OWL', 'Night Owl',
 'Study after midnight',
 '/badges/night-owl.svg',
 '{"type": "session_time", "after": "00:00"}'::jsonb,
 50, 'uncommon', 23),

('special', 'SPEED_LEARNER', 'Speed Learner',
 'Complete 5 components in one day',
 '/badges/speed.svg',
 '{"type": "daily_completions", "threshold": 5}'::jsonb,
 100, 'rare', 24),

('special', 'HELPING_HAND', 'Helping Hand',
 'Rate 10 learning components',
 '/badges/helpful.svg',
 '{"type": "ratings_given", "threshold": 10}'::jsonb,
 75, 'uncommon', 25),

-- Ultimate Achievement
('special', 'NETWORK_PLUS_READY', 'Network+ Ready',
 'Complete all domains with 90%+ average and pass practice exams',
 '/badges/netplus-ready.svg',
 '{"type": "certification_ready", "domains_completed": 5, "min_average": 90, "practice_exams_passed": 2}'::jsonb,
 5000, 'legendary', 26);

-- Award some achievements to demo users
DO $$
DECLARE
    v_sarah_id UUID;
    v_mike_id UUID;
BEGIN
    SELECT id INTO v_sarah_id FROM users WHERE username = 'sarah_network';
    SELECT id INTO v_mike_id FROM users WHERE username = 'mike_netplus';

    -- Sarah's achievements (advanced user)
    INSERT INTO user_achievements (user_id, achievement_id, earned_at)
    SELECT v_sarah_id, id, NOW() - (RANDOM() * INTERVAL '30 days')
    FROM achievements
    WHERE code IN ('FIRST_LOGIN', 'PROFILE_COMPLETE', 'STREAK_3', 'STREAK_7',
                   'COMPLETE_10', 'FIRST_QUIZ', 'STUDY_10HRS', 'EARLY_BIRD');

    -- Mike's achievements (intermediate user)
    INSERT INTO user_achievements (user_id, achievement_id, earned_at)
    SELECT v_mike_id, id, NOW() - (RANDOM() * INTERVAL '20 days')
    FROM achievements
    WHERE code IN ('FIRST_LOGIN', 'PROFILE_COMPLETE', 'STREAK_3',
                   'FIRST_QUIZ', 'STUDY_10HRS');
END $$;
