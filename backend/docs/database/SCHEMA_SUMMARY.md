# Database Schema Summary

## CompTIA Network+ Learning Platform - PostgreSQL Database

**Version:** 1.0.0
**Database Engine:** PostgreSQL 14+
**Schema Architect:** Database Design Agent
**Date:** 2025-10-29

---

## Executive Summary

This document provides a high-level overview of the complete database schema designed for the CompTIA Network+ Learning Platform. The schema supports user management, learning content delivery, assessment systems, progress tracking, gamification, and comprehensive analytics.

### Key Statistics

- **Total Tables:** 18 core tables
- **Total Views:** 5 views + 2 materialized views
- **Database Functions:** 6 utility functions
- **Indexes:** 50+ optimized indexes
- **Estimated Storage (10K users):** ~2.3 GB
- **Estimated Storage (100K users):** ~23 GB

---

## Schema Architecture

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                    USER MANAGEMENT                          │
│  • users                  • user_profiles                   │
│  • user_settings          • learning_streaks                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                  LEARNING CONTENT                           │
│  • learning_components    • user_progress                   │
│  • learning_sessions      • bookmarks                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    ASSESSMENTS                              │
│  • question_bank          • assessments                     │
│  • assessment_attempts    • assessment_answers              │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│              PROGRESS & GAMIFICATION                        │
│  • achievements           • user_achievements               │
│  • study_goals            • learning_streaks                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   ANALYTICS                                 │
│  • user_activity_logs     • component_analytics             │
│  • performance_metrics    • materialized views              │
└─────────────────────────────────────────────────────────────┘
```

---

## Table Categories

### 1. User Management (4 tables)

| Table            | Purpose                        | Records (est.) |
| ---------------- | ------------------------------ | -------------- |
| users            | Authentication & authorization | 1 per user     |
| user_profiles    | Extended user information      | 1 per user     |
| user_settings    | Application preferences        | 1 per user     |
| learning_streaks | Daily streak tracking          | 1 per user     |

**Key Features:**

- bcrypt password hashing
- Soft delete support
- Role-based access (student, instructor, admin)
- Email verification workflow
- Account locking for security

### 2. Learning Content (4 tables)

| Table               | Purpose                | Records (est.)     |
| ------------------- | ---------------------- | ------------------ |
| learning_components | Content catalog        | ~200 components    |
| user_progress       | Progress tracking      | users × components |
| learning_sessions   | Session analytics      | ~100 per user      |
| bookmarks           | Quick access bookmarks | ~20 per user       |

**Component Types:**

- Lessons, Videos, Flashcards
- Quizzes, Labs, Simulations
- Practice Exams, Study Guides

### 3. Assessments (4 tables)

| Table               | Purpose                | Records (est.)       |
| ------------------- | ---------------------- | -------------------- |
| question_bank       | Reusable questions     | ~1000 questions      |
| assessments         | Assessment definitions | ~50 assessments      |
| assessment_attempts | User attempts          | ~30 per user         |
| assessment_answers  | Individual answers     | attempts × questions |

**Question Types:**

- Multiple Choice, Multiple Select
- True/False, Fill in the Blank
- Matching, Simulations

### 4. Progress Tracking (4 tables)

| Table             | Purpose                 | Records (est.)     |
| ----------------- | ----------------------- | ------------------ |
| achievements      | Achievement definitions | ~25 achievements   |
| user_achievements | Earned achievements     | ~10 per user       |
| study_goals       | User-defined goals      | ~3 per active user |
| learning_streaks  | Engagement tracking     | 1 per user         |

**Achievement Types:**

- Badges, Milestones, Streaks
- Mastery, Special Events

### 5. Analytics (3 tables)

| Table               | Purpose          | Records (est.)    |
| ------------------- | ---------------- | ----------------- |
| user_activity_logs  | Audit trail      | ~100 per user     |
| component_analytics | Daily aggregates | components × days |
| performance_metrics | System health    | Variable          |

---

## Key Design Decisions

### 1. UUID Primary Keys

**Decision:** Use UUIDs instead of auto-incrementing integers

**Rationale:**

- Distributed system compatibility
- No sequential ID exposure
- Merge-friendly across databases
- URL-safe identifiers

### 2. JSONB for Flexibility

**Usage:** Content data, settings, criteria, metadata

**Benefits:**

- Schema flexibility for evolving requirements
- Efficient storage and indexing
- Native PostgreSQL query support

**Examples:**

```json
learning_components.content = {
  "type": "video",
  "duration": 1800,
  "chapters": [...]
}

achievements.criteria = {
  "type": "streak",
  "days": 7,
  "min_time": 30
}
```

### 3. Soft Deletes

**Tables:** users, learning_components, assessments, question_bank

**Implementation:** `deleted_at` timestamp column

**Benefits:**

- Data recovery capability
- Audit trail preservation
- Referential integrity maintenance

### 4. Array Columns

**Usage:** Prerequisites, objectives, tags

**Benefits:**

- Denormalized for performance
- Simple PostgreSQL array operators
- No junction table overhead

**Example:**

```sql
learning_components.prerequisites = ARRAY[uuid1, uuid2, uuid3]
question_bank.comptia_objectives = ARRAY['1.1', '2.3', '4.2']
```

### 5. Automatic Timestamps

**Implementation:** Trigger function for `updated_at`

**Trigger:**

```sql
CREATE TRIGGER update_table_updated_at
BEFORE UPDATE ON table_name
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## Data Flow Examples

### User Registration Flow

```
1. INSERT INTO users (email, username, password_hash)
2. INSERT INTO user_profiles (user_id, first_name, last_name)
3. INSERT INTO user_settings (user_id, theme, daily_goal_minutes)
4. INSERT INTO learning_streaks (user_id)
5. INSERT INTO user_activity_logs (user_id, activity_type='user_registered')
```

### Component Completion Flow

```
1. UPDATE user_progress SET
   - status = 'completed'
   - progress_percentage = 100
   - completion_date = NOW()

2. UPDATE learning_sessions SET
   - session_end = NOW()
   - completion_achieved = TRUE

3. CALL update_learning_streak(user_id)

4. CALL check_and_award_achievement(user_id, 'COMPLETE_10')

5. INSERT INTO user_activity_logs (activity_type='component_completed')
```

### Assessment Taking Flow

```
1. INSERT INTO assessment_attempts (user_id, assessment_id, status='in_progress')

2. SELECT questions FROM question_bank WHERE id = ANY(question_ids)

3. For each answer:
   INSERT INTO assessment_answers (attempt_id, question_id, user_answer)

4. UPDATE assessment_attempts SET
   - status = 'completed'
   - score = calculated_score
   - percentage = calculated_percentage
   - passed = percentage >= passing_score

5. UPDATE user_progress (if assessment is a component)
```

---

## Query Performance Optimization

### Indexes Strategy

**Foreign Keys:** All foreign keys automatically indexed

```sql
user_progress.user_id
user_progress.component_id
```

**Frequently Filtered Columns:**

```sql
users.email, users.username
learning_components.domain, learning_components.component_type
assessments.slug
```

**Composite Indexes:**

```sql
(user_id, component_id) for user_progress lookups
(component_id, date) for analytics queries
```

### Views for Complex Queries

**Standard Views** (real-time):

- v_user_learning_stats
- v_component_performance
- v_assessment_performance
- v_user_assessment_history
- v_question_performance

**Materialized Views** (cached):

- mv_daily_user_activity (refresh nightly)
- mv_weekly_domain_progress (refresh weekly)

### Query Optimization Tips

1. **Use prepared statements** for repeated queries
2. **Limit result sets** with LIMIT and OFFSET
3. **Avoid SELECT \*** - specify needed columns
4. **Use EXISTS** instead of COUNT for existence checks
5. **Leverage views** for complex aggregations

---

## Security Features

### Password Security

- bcrypt hashing with salt rounds >= 10
- Never store plain text passwords
- Password reset tokens with expiration

### Account Security

- Failed login attempt tracking
- Account locking after threshold
- Email verification workflow

### Data Security

- Row-level security policies (optional)
- Audit logging for sensitive operations
- IP address tracking
- Soft deletes for data retention

### SQL Injection Prevention

- Always use parameterized queries
- Never concatenate user input
- Validate all input at application level

---

## Maintenance Procedures

### Daily Tasks

```sql
-- Refresh materialized views
SELECT refresh_analytics_views();

-- Monitor slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;
```

### Weekly Tasks

```sql
-- Analyze tables for optimization
ANALYZE;

-- Clean old sessions (30+ days)
DELETE FROM learning_sessions
WHERE created_at < NOW() - INTERVAL '30 days';
```

### Monthly Tasks

```sql
-- Vacuum database
VACUUM ANALYZE;

-- Archive old activity logs (90+ days)
DELETE FROM user_activity_logs
WHERE created_at < NOW() - INTERVAL '90 days';

-- Review index usage
SELECT * FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

---

## Migration Scripts

### Available Scripts

**migrate.sh** - Database migration management

```bash
./migrate.sh up      # Apply migrations
./migrate.sh down    # Rollback migrations
./migrate.sh reset   # Drop and recreate database
```

**seed.sh** - Populate with demo data

```bash
./seed.sh            # Run all seed files
```

**backup.sh** - Database backup

```bash
./backup.sh full     # Full backup (schema + data)
./backup.sh schema   # Schema only
./backup.sh data     # Data only
./backup.sh cleanup  # Remove old backups
```

**restore.sh** - Database restore

```bash
./restore.sh /path/to/backup.sql.gz
```

### Migration Files

1. **001_create_users.sql** - User tables
2. **002_create_learning.sql** - Learning content tables
3. **003_create_assessments.sql** - Assessment tables
4. **004_create_analytics.sql** - Analytics and tracking tables
5. **005_create_indexes.sql** - Views and functions

Each migration includes:

- UP section (apply changes)
- DOWN section (rollback changes)
- Proper indexing
- Constraint definitions

---

## Seed Data

### Demo Accounts

| Account    | Email                                 | Role       | Password    |
| ---------- | ------------------------------------- | ---------- | ----------- |
| Admin      | admin@network.test                    | admin      | password123 |
| Instructor | instructor@network.test               | instructor | password123 |
| Student 1  | student1@network.test (sarah_network) | student    | password123 |
| Student 2  | student2@network.test (mike_netplus)  | student    | password123 |
| Student 3  | student3@network.test (jane_tech)     | student    | password123 |

### Seeded Content

- **16 Learning Components** across all domains
- **15 Questions** in question bank
- **26 Achievements** defined
- **User progress** for demo students
- **Sample analytics** data

---

## CompTIA Network+ Mapping

The schema supports official CompTIA Network+ exam objectives:

### Domain Coverage

| Domain | Code                    | Description                    |
| ------ | ----------------------- | ------------------------------ |
| 1.0    | Networking Fundamentals | OSI, TCP/IP, topologies        |
| 2.0    | Network Implementations | Routing, switching, wireless   |
| 3.0    | Network Operations      | Monitoring, troubleshooting    |
| 4.0    | Network Security        | Threats, firewalls, encryption |
| 5.0    | Network Troubleshooting | Methodology, tools             |

### Objective Tracking

Every learning component and question can be tagged with specific objective codes:

```sql
learning_components.comptia_objectives = ARRAY['1.1', '1.2']
question_bank.comptia_objectives = ARRAY['2.3']
assessments.comptia_objectives = ARRAY['1.0', '2.0', '3.0', '4.0', '5.0']
```

This enables:

- Progress tracking by objective
- Gap analysis for exam readiness
- Personalized study recommendations

---

## Performance Benchmarks

### Expected Query Performance

| Query Type        | Target  | Notes                     |
| ----------------- | ------- | ------------------------- |
| User login        | < 50ms  | Indexed on email/username |
| Dashboard load    | < 200ms | Uses views and caching    |
| Component list    | < 100ms | Indexed on domain/type    |
| Progress update   | < 50ms  | Simple UPDATE             |
| Assessment submit | < 500ms | Transaction with INSERTs  |
| Analytics query   | < 2s    | Uses materialized views   |

### Scalability Projections

| Users     | Storage | Queries/sec | Notes                     |
| --------- | ------- | ----------- | ------------------------- |
| 1,000     | ~230 MB | ~100        | Single instance           |
| 10,000    | ~2.3 GB | ~500        | Single instance + caching |
| 100,000   | ~23 GB  | ~2,000      | Read replicas recommended |
| 1,000,000 | ~230 GB | ~10,000     | Partitioning + sharding   |

---

## Future Enhancements

### Planned Additions

1. **Real-time Collaboration**
   - Shared study sessions
   - Live chat support
   - Collaborative notes

2. **Advanced Analytics**
   - Predictive success modeling
   - Personalized recommendations
   - Learning path optimization

3. **External Integrations**
   - LMS integration (Moodle, Canvas)
   - SSO authentication
   - Calendar sync

4. **Performance Optimizations**
   - Table partitioning by date
   - Read replica configuration
   - Materialized view automation

### Extensibility

The schema is designed for extensibility:

- JSONB columns for flexible data
- Array columns for multi-valued attributes
- Metadata fields for future features
- Modular table design

---

## Documentation Files

### Complete Documentation Set

1. **README.md** - Quick start guide and overview
2. **SCHEMA_SUMMARY.md** (this file) - Executive summary
3. **ERD.md** - Entity relationship diagram
4. **DATA_DICTIONARY.md** - Complete table/column reference
5. **schema.sql** - Full schema definition
6. **migrations/** - Migration scripts
7. **seeds/** - Demo data scripts
8. **scripts/** - Management scripts

---

## Support & Resources

### Getting Help

- **Schema Questions:** Reference DATA_DICTIONARY.md
- **Setup Issues:** Reference README.md
- **Performance:** Check pg_stat_statements
- **Errors:** Review PostgreSQL logs

### External Resources

- PostgreSQL Documentation: https://www.postgresql.org/docs/
- CompTIA Network+: https://www.comptia.org/certifications/network
- Database Design Best Practices: Various PostgreSQL wikis

---

## Version History

### Version 1.0.0 (2025-10-29)

- Initial schema design
- 18 core tables
- 5 views + 2 materialized views
- 6 utility functions
- Complete migration scripts
- Seed data for development
- Comprehensive documentation

---

## Conclusion

This database schema provides a robust, scalable foundation for the CompTIA Network+ Learning Platform. It supports:

✅ Comprehensive user management with roles and profiles
✅ Flexible learning content with progress tracking
✅ Complete assessment system with question bank
✅ Gamification through achievements and streaks
✅ Detailed analytics and reporting
✅ Strong security and data integrity
✅ Optimized query performance
✅ Easy maintenance and backup

The schema is production-ready and designed to scale from development through enterprise deployment.

**Total Development Time:** Schema design, implementation, testing, and documentation
**Database Version:** PostgreSQL 14+
**License:** Proprietary - CompTIA Network+ Learning Platform

---

**For technical implementation details, refer to schema.sql and migration files.**
