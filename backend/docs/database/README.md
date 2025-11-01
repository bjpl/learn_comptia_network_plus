# Database Documentation

## Overview

This database schema supports the CompTIA Network+ Learning Platform, providing comprehensive data management for user accounts, learning content, assessments, progress tracking, and analytics.

## Quick Start

### Prerequisites

- PostgreSQL 14+ installed
- `psql` command-line tool
- Environment variables configured (see Configuration section)

### Initial Setup

```bash
# 1. Configure environment variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=network_plus_learning
export DB_USER=postgres
export DB_PASSWORD=your_password

# 2. Run migrations
cd backend/database/scripts
chmod +x *.sh
./migrate.sh up

# 3. Seed demo data (optional)
./seed.sh
```

## Database Architecture

### Core Design Principles

1. **UUID Primary Keys**: All tables use UUIDs for distributed system compatibility
2. **Soft Deletes**: Important data uses `deleted_at` timestamps for data retention
3. **Audit Trails**: Automatic `created_at` and `updated_at` timestamps
4. **JSONB Storage**: Flexible data storage for complex structures
5. **Referential Integrity**: Foreign keys with appropriate cascade rules
6. **Query Optimization**: Strategic indexes on frequently queried columns

### Technology Stack

- **Database**: PostgreSQL 14+
- **Extensions**: uuid-ossp, pgcrypto
- **Features**: JSONB, Arrays, Triggers, Views, Materialized Views

## Schema Components

### 1. Core User Tables

#### users
Core authentication and authorization table.

**Key Fields:**
- `id`: UUID primary key
- `email`: Unique email address
- `username`: Unique username
- `password_hash`: bcrypt hashed password
- `role`: student | instructor | admin
- `account_status`: active | suspended | deactivated | deleted
- `email_verified`: Email verification status
- `deleted_at`: Soft delete timestamp

**Indexes:**
- email (unique, where not deleted)
- username (unique, where not deleted)
- role, account_status, created_at

#### user_profiles
Extended user information and preferences.

**Key Fields:**
- `user_id`: Foreign key to users (1:1)
- `first_name`, `last_name`, `display_name`
- `bio`, `avatar_url`
- `timezone`, `locale`
- `certifications`: Array of earned certifications

#### user_settings
Application preferences and configuration.

**Key Fields:**
- `theme`: light | dark | system
- `notifications_enabled`, `email_notifications`
- `study_reminders`, `reminder_time`, `reminder_days`
- `accessibility_mode`, `high_contrast`, `font_size`
- `daily_goal_minutes`
- `privacy_settings`: JSONB

### 2. Learning Content Tables

#### learning_components
Catalog of all learning materials.

**Component Types:**
- lesson, video, flashcard, quiz
- lab, simulation, assessment
- reading, practice_exam, study_guide

**Key Fields:**
- `component_type`: Type of learning material
- `domain`, `subdomain`: Content organization
- `title`, `slug`: Identification
- `content`: JSONB content data
- `difficulty_level`: beginner | intermediate | advanced
- `prerequisites`: Array of prerequisite component IDs
- `comptia_objectives`: Array of exam objective codes
- `is_published`: Publication status

**Metrics:**
- `view_count`, `completion_count`
- `average_rating`, `rating_count`

#### user_progress
Individual progress tracking per component.

**Status Values:**
- not_started, in_progress, completed, mastered

**Key Fields:**
- `progress_percentage`: 0-100
- `time_spent_minutes`: Total time on component
- `last_position`: JSONB for resume capability
- `best_score`, `latest_score`: Assessment scores
- `completion_date`, `mastery_date`: Milestones

#### learning_sessions
Detailed session tracking for analytics.

**Key Fields:**
- `session_start`, `session_end`, `duration_minutes`
- `interaction_count`: User engagement metric
- `device_type`: desktop | tablet | mobile
- `session_data`: JSONB for additional metadata

### 3. Assessment Tables

#### question_bank
Reusable question pool for all assessments.

**Question Types:**
- multiple_choice, multiple_select
- true_false, fill_blank
- matching, simulation

**Key Fields:**
- `question_text`: The question
- `question_data`: JSONB (options, etc.)
- `correct_answer`: JSONB correct answer(s)
- `explanation`: Answer explanation
- `hints`: Array of hints
- `points`: Point value

**Analytics:**
- `usage_count`, `correct_count`, `incorrect_count`
- `average_time_seconds`

#### assessments
Assessment definitions and configuration.

**Assessment Types:**
- quiz, practice_exam, final_exam, checkpoint

**Key Fields:**
- `time_limit_minutes`: Optional time limit
- `passing_score`: Minimum passing percentage
- `question_ids`: Array of question IDs
- `randomize_questions`, `randomize_answers`: Boolean
- `show_answers_after`, `allow_review`: Boolean
- `max_attempts`: Optional attempt limit

#### assessment_attempts
User attempt tracking and scoring.

**Status Values:**
- in_progress, completed, abandoned, timed_out

**Key Fields:**
- `attempt_number`: Attempt sequence
- `score`, `percentage`: Performance metrics
- `passed`: Boolean pass/fail
- `question_order`: Actual question order presented
- `correct_answers`, `incorrect_answers`, `skipped_questions`

#### assessment_answers
Individual answers for each question.

**Key Fields:**
- `attempt_id`, `question_id`: References
- `user_answer`: JSONB user's answer
- `is_correct`: Boolean correctness
- `points_earned`: Points for this answer
- `time_spent_seconds`: Time on question
- `flagged_for_review`: Boolean flag

### 4. Progress Tracking Tables

#### achievements
Achievement and badge definitions.

**Achievement Types:**
- badge, milestone, streak, mastery, special

**Rarity Levels:**
- common, uncommon, rare, epic, legendary

**Key Fields:**
- `code`: Unique achievement code
- `name`, `description`: Display info
- `criteria`: JSONB earning criteria
- `points`: Achievement point value

#### user_achievements
Achievements earned by users.

**Key Fields:**
- `user_id`, `achievement_id`: References
- `earned_at`: Timestamp
- `progress_data`: JSONB tracking data

#### learning_streaks
Daily engagement streak tracking.

**Key Fields:**
- `current_streak`: Current consecutive days
- `longest_streak`: All-time longest streak
- `last_activity_date`: Last activity date
- `total_active_days`: Lifetime active days
- `streak_frozen_days`: Streak protection days
- `streak_history`: JSONB history

#### study_goals
User-defined learning goals.

**Goal Types:**
- daily, weekly, monthly, exam_date, custom

**Metrics:**
- minutes, components, assessments, score, streak

**Key Fields:**
- `target_value`, `current_value`: Goal tracking
- `start_date`, `target_date`, `completed_date`
- `status`: active | completed | failed | abandoned

### 5. Analytics Tables

#### user_activity_logs
Comprehensive activity audit trail.

**Key Fields:**
- `activity_type`: Type of activity
- `activity_description`: Human-readable description
- `resource_type`, `resource_id`: Affected resource
- `metadata`: JSONB additional data
- `ip_address`, `user_agent`: Request info

#### component_analytics
Daily aggregated component metrics.

**Key Fields:**
- `date`: Analytics date
- `views`, `unique_users`, `completions`
- `average_time_minutes`, `average_score`
- `engagement_rate`, `bounce_rate`

#### performance_metrics
System performance and health metrics.

**Key Fields:**
- `metric_type`, `metric_name`: Metric identification
- `metric_value`, `unit`: Measurement
- `tags`: JSONB categorization
- `timestamp`: Measurement time

## Views and Functions

### Views

#### v_user_learning_stats
Aggregated learning statistics per user.

**Columns:**
- Components started, completed, mastered
- Total time, average progress
- Current/longest streak
- Achievements earned

#### v_component_performance
Performance metrics for learning components.

**Columns:**
- Unique users, completion count
- Average progress, time, score
- Rating information

#### v_assessment_performance
Performance metrics for assessments.

**Columns:**
- Total attempts, unique users
- Average score, pass/fail counts
- Average time

#### v_user_assessment_history
Complete user assessment history.

**Columns:**
- All attempt details
- Scores, time spent
- Question statistics

#### v_question_performance
Performance metrics for individual questions.

**Columns:**
- Usage statistics
- Success rate
- Average time

### Materialized Views

#### mv_daily_user_activity
Daily aggregated user activity (refresh nightly).

**Columns:**
- Active users, total sessions
- Total/average minutes
- Completion statistics

#### mv_weekly_domain_progress
Weekly progress by domain (refresh weekly).

**Columns:**
- Week start date, domain
- Active users, components in progress
- Completions, average progress
- Total time

### Functions

#### calculate_overall_progress(user_id)
Calculate user's overall progress percentage.

**Returns:** DECIMAL(5,2)

#### update_learning_streak(user_id)
Update user's learning streak based on activity.

**Returns:** VOID

**Logic:**
- First activity: Initialize streak
- Same day: No change
- Consecutive day: Increment streak
- Gap: Reset streak to 1

#### check_and_award_achievement(user_id, achievement_code)
Award achievement to user if not already earned.

**Returns:** BOOLEAN (true if awarded, false otherwise)

#### get_user_dashboard_summary(user_id)
Get comprehensive dashboard summary for user.

**Returns:** TABLE with:
- Components started/completed
- Total time, current streak
- Achievement count
- Average assessment score
- Active goals count

#### refresh_analytics_views()
Refresh all materialized views for analytics.

**Returns:** VOID

**Views Refreshed:**
- mv_daily_user_activity
- mv_weekly_domain_progress

## Scripts

### Migration Scripts

#### migrate.sh
Run database migrations.

```bash
# Apply all migrations
./migrate.sh up

# View rollback instructions
./migrate.sh down

# Drop and recreate database
./migrate.sh reset
```

#### seed.sh
Populate database with demo data.

```bash
./seed.sh
```

**Creates:**
- Demo user accounts (admin, instructor, students)
- Learning components catalog
- Question bank
- Achievements

### Backup Scripts

#### backup.sh
Create database backups.

```bash
# Full backup (schema + data)
./backup.sh full

# Schema only
./backup.sh schema

# Data only
./backup.sh data

# Clean old backups
./backup.sh cleanup
```

**Retention:** Automatically keeps last 7 days of backups.

#### restore.sh
Restore database from backup.

```bash
./restore.sh /path/to/backup.sql.gz
```

## Configuration

### Environment Variables

```bash
# Database connection
DB_HOST=localhost
DB_PORT=5432
DB_NAME=network_plus_learning
DB_USER=postgres
DB_PASSWORD=your_password

# Backup location
BACKUP_DIR=/path/to/backups
```

### Connection String Format

```
postgresql://username:password@host:port/database
```

## Maintenance

### Regular Tasks

#### Daily
- Refresh materialized views
- Monitor query performance
- Check error logs

```sql
-- Refresh analytics
SELECT refresh_analytics_views();

-- Check slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
```

#### Weekly
- Analyze tables for query optimization
- Review and clean old sessions
- Backup database

```sql
-- Analyze all tables
ANALYZE;

-- Clean old sessions (30+ days)
DELETE FROM learning_sessions
WHERE created_at < NOW() - INTERVAL '30 days';
```

#### Monthly
- Vacuum database
- Review index usage
- Archive old activity logs

```sql
-- Vacuum
VACUUM ANALYZE;

-- Check unused indexes
SELECT * FROM pg_stat_user_indexes
WHERE idx_scan = 0;

-- Archive old logs (90+ days)
DELETE FROM user_activity_logs
WHERE created_at < NOW() - INTERVAL '90 days';
```

### Performance Optimization

#### Query Optimization

1. **Use Prepared Statements**: Reduce parsing overhead
2. **Limit Result Sets**: Always use LIMIT for large queries
3. **Use Indexes**: Verify indexes are being used (EXPLAIN ANALYZE)
4. **Avoid N+1 Queries**: Use JOINs or batch loading

#### Index Maintenance

```sql
-- Find missing indexes
SELECT * FROM pg_stat_user_tables
WHERE seq_scan > idx_scan
AND schemaname = 'public';

-- Rebuild indexes
REINDEX TABLE tablename;
```

#### Connection Pooling

Recommended: PgBouncer or application-level pooling
- Min pool size: 10
- Max pool size: 50
- Idle timeout: 300s

## Security

### Best Practices

1. **Password Storage**: Always use bcrypt with salt rounds >= 10
2. **SQL Injection**: Use parameterized queries only
3. **Access Control**: Implement role-based access (RBAC)
4. **Encryption**: Use SSL/TLS for connections
5. **Auditing**: Log all sensitive operations

### Database Roles

```sql
-- Application role (read/write)
CREATE ROLE app_user WITH LOGIN PASSWORD 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;

-- Read-only role (analytics)
CREATE ROLE readonly WITH LOGIN PASSWORD 'secure_password';
GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;

-- Admin role
CREATE ROLE admin WITH LOGIN PASSWORD 'secure_password' SUPERUSER;
```

### Row-Level Security

```sql
-- Enable RLS on sensitive tables
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own logs
CREATE POLICY user_logs_policy ON user_activity_logs
FOR SELECT
USING (user_id = current_setting('app.user_id')::uuid);
```

## Troubleshooting

### Common Issues

#### Slow Queries

```sql
-- Enable query timing
\timing

-- Analyze query plan
EXPLAIN ANALYZE SELECT ...;

-- Check table statistics
ANALYZE table_name;
```

#### Connection Issues

```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Check connections
psql -c "SELECT count(*) FROM pg_stat_activity;"

# Kill idle connections
psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle';"
```

#### Disk Space

```sql
-- Check database size
SELECT pg_size_pretty(pg_database_size('network_plus_learning'));

-- Check table sizes
SELECT
    relname AS table_name,
    pg_size_pretty(pg_total_relation_size(relid)) AS size
FROM pg_catalog.pg_statio_user_tables
ORDER BY pg_total_relation_size(relid) DESC;
```

## Migration Guide

### From Development to Production

1. **Backup Production**: Create full backup before migration
2. **Test Migration**: Run on staging environment first
3. **Schedule Downtime**: Plan maintenance window
4. **Run Migration**: Execute migration scripts
5. **Verify Data**: Check data integrity
6. **Monitor Performance**: Watch for issues
7. **Rollback Plan**: Have restore procedure ready

### Version Control

All schema changes must:
1. Create new migration file with incremented number
2. Include UP and DOWN sections
3. Test on development database
4. Document in CHANGELOG
5. Review with team before production

## Support

### Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- Schema Visualization: Use tools like pgAdmin, DBeaver
- Performance Monitoring: pg_stat_statements, pgBadger

### Contact

For database issues or questions:
- Create issue in project repository
- Contact database team
- Check documentation wiki

## Appendix

### Demo Accounts

Created by seed script:

```
Admin:      admin@network.test / password123
Instructor: instructor@network.test / password123
Student 1:  student1@network.test / password123
Student 2:  student2@network.test / password123
Student 3:  student3@network.test / password123
```

### CompTIA Exam Objective Mapping

The database supports mapping learning content to official CompTIA Network+ exam objectives:

- **Domain 1.0**: Networking Fundamentals
- **Domain 2.0**: Network Implementations
- **Domain 3.0**: Network Operations
- **Domain 4.0**: Network Security
- **Domain 5.0**: Network Troubleshooting

Each learning component and question can be tagged with specific objective codes (e.g., "1.1", "2.3", "4.2") for precise tracking.
