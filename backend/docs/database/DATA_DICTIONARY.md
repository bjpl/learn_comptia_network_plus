# Database Data Dictionary

## Overview

This data dictionary provides detailed information about every table, column, constraint, and relationship in the CompTIA Network+ Learning Platform database.

---

## Table: users

**Purpose:** Core user authentication and authorization

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key, unique user identifier |
| email | VARCHAR(255) | NO | - | User email address, must be unique |
| username | VARCHAR(50) | NO | - | User username, must be unique |
| password_hash | TEXT | NO | - | bcrypt hashed password (never store plain text) |
| role | VARCHAR(20) | NO | 'student' | User role: student, instructor, admin |
| email_verified | BOOLEAN | YES | FALSE | Whether email has been verified |
| verification_token | TEXT | YES | - | Token for email verification |
| reset_token | TEXT | YES | - | Token for password reset |
| reset_token_expires | TIMESTAMPTZ | YES | - | Expiration time for reset token |
| last_login | TIMESTAMPTZ | YES | - | Timestamp of last successful login |
| login_count | INTEGER | YES | 0 | Total number of logins |
| account_status | VARCHAR(20) | YES | 'active' | Account status: active, suspended, deactivated, deleted |
| failed_login_attempts | INTEGER | YES | 0 | Count of consecutive failed login attempts |
| locked_until | TIMESTAMPTZ | YES | - | Account lock expiration timestamp |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp (auto-updated) |
| deleted_at | TIMESTAMPTZ | YES | - | Soft delete timestamp |

**Constraints:**
- PRIMARY KEY: id
- UNIQUE: email, username
- CHECK: role IN ('student', 'instructor', 'admin')
- CHECK: account_status IN ('active', 'suspended', 'deactivated', 'deleted')

**Indexes:**
- idx_users_email ON email WHERE deleted_at IS NULL
- idx_users_username ON username WHERE deleted_at IS NULL
- idx_users_role ON role
- idx_users_account_status ON account_status
- idx_users_created_at ON created_at

---

## Table: user_profiles

**Purpose:** Extended user profile information

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key |
| user_id | UUID | NO | - | Foreign key to users table (1:1) |
| first_name | VARCHAR(100) | YES | - | User's first name |
| last_name | VARCHAR(100) | YES | - | User's last name |
| display_name | VARCHAR(100) | YES | - | Public display name |
| bio | TEXT | YES | - | User biography or description |
| avatar_url | TEXT | YES | - | URL to user's avatar image |
| timezone | VARCHAR(50) | YES | 'UTC' | User's timezone (IANA format) |
| locale | VARCHAR(10) | YES | 'en-US' | User's locale/language preference |
| date_of_birth | DATE | YES | - | User's date of birth |
| phone | VARCHAR(20) | YES | - | User's phone number |
| country | VARCHAR(2) | YES | - | ISO 3166-1 alpha-2 country code |
| state_province | VARCHAR(100) | YES | - | State or province |
| city | VARCHAR(100) | YES | - | City |
| linkedin_url | TEXT | YES | - | LinkedIn profile URL |
| github_url | TEXT | YES | - | GitHub profile URL |
| website_url | TEXT | YES | - | Personal website URL |
| occupation | VARCHAR(100) | YES | - | User's occupation |
| organization | VARCHAR(200) | YES | - | User's organization/company |
| certifications | TEXT[] | YES | - | Array of earned certifications |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: user_id REFERENCES users(id) ON DELETE CASCADE
- UNIQUE: user_id

---

## Table: user_settings

**Purpose:** User application preferences and configuration

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key |
| user_id | UUID | NO | - | Foreign key to users table (1:1) |
| theme | VARCHAR(20) | YES | 'system' | UI theme: light, dark, system |
| language | VARCHAR(10) | YES | 'en' | Interface language code |
| notifications_enabled | BOOLEAN | YES | TRUE | Master notification toggle |
| email_notifications | BOOLEAN | YES | TRUE | Email notification preference |
| push_notifications | BOOLEAN | YES | FALSE | Push notification preference |
| study_reminders | BOOLEAN | YES | TRUE | Study reminder toggle |
| reminder_time | TIME | YES | '09:00:00' | Daily reminder time |
| reminder_days | INTEGER[] | YES | [1,2,3,4,5] | Days for reminders (0=Sun, 6=Sat) |
| accessibility_mode | BOOLEAN | YES | FALSE | Accessibility features enabled |
| high_contrast | BOOLEAN | YES | FALSE | High contrast mode |
| font_size | VARCHAR(10) | YES | 'medium' | Font size: small, medium, large, xlarge |
| reduce_motion | BOOLEAN | YES | FALSE | Reduce animations |
| auto_play_videos | BOOLEAN | YES | TRUE | Auto-play video content |
| show_hints | BOOLEAN | YES | TRUE | Show hints in assessments |
| difficulty_level | VARCHAR(20) | YES | 'intermediate' | Preferred difficulty level |
| daily_goal_minutes | INTEGER | YES | 30 | Daily study goal in minutes |
| privacy_settings | JSONB | YES | {...} | Privacy preferences as JSON |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: user_id REFERENCES users(id) ON DELETE CASCADE
- UNIQUE: user_id
- CHECK: theme IN ('light', 'dark', 'system')
- CHECK: font_size IN ('small', 'medium', 'large', 'xlarge')
- CHECK: difficulty_level IN ('beginner', 'intermediate', 'advanced')

---

## Table: learning_components

**Purpose:** Catalog of all learning materials and content

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key |
| component_type | VARCHAR(50) | NO | - | Type: lesson, video, flashcard, quiz, lab, simulation, assessment, reading, practice_exam, study_guide |
| domain | VARCHAR(100) | NO | - | Main subject domain |
| subdomain | VARCHAR(100) | YES | - | Specific subdomain/topic |
| title | VARCHAR(255) | NO | - | Component title |
| slug | VARCHAR(255) | NO | - | URL-friendly unique identifier |
| description | TEXT | YES | - | Component description |
| content | JSONB | YES | - | Component content data structure |
| difficulty_level | VARCHAR(20) | YES | 'intermediate' | Difficulty: beginner, intermediate, advanced |
| estimated_duration_minutes | INTEGER | YES | - | Estimated completion time |
| order_index | INTEGER | YES | 0 | Display order within domain |
| prerequisites | UUID[] | YES | - | Array of prerequisite component IDs |
| objectives | TEXT[] | YES | - | Learning objectives array |
| keywords | TEXT[] | YES | - | Searchable keywords |
| comptia_objectives | TEXT[] | YES | - | CompTIA exam objective codes |
| is_published | BOOLEAN | YES | FALSE | Publication status |
| version | INTEGER | YES | 1 | Content version number |
| thumbnail_url | TEXT | YES | - | Thumbnail image URL |
| video_url | TEXT | YES | - | Video content URL |
| resource_urls | JSONB | YES | - | Additional resource links |
| metadata | JSONB | YES | - | Additional metadata |
| view_count | INTEGER | YES | 0 | Total views |
| completion_count | INTEGER | YES | 0 | Total completions |
| average_rating | DECIMAL(3,2) | YES | 0.00 | Average user rating (0-5) |
| rating_count | INTEGER | YES | 0 | Number of ratings |
| created_by | UUID | YES | - | Author user ID |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |
| published_at | TIMESTAMPTZ | YES | - | Publication timestamp |
| deleted_at | TIMESTAMPTZ | YES | - | Soft delete timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: created_by REFERENCES users(id) ON DELETE SET NULL
- UNIQUE: slug
- CHECK: component_type IN (...)
- CHECK: difficulty_level IN ('beginner', 'intermediate', 'advanced')

**Indexes:**
- idx_learning_components_type ON component_type
- idx_learning_components_domain ON domain
- idx_learning_components_subdomain ON subdomain
- idx_learning_components_published ON is_published WHERE is_published = TRUE
- idx_learning_components_difficulty ON difficulty_level
- idx_learning_components_slug ON slug

---

## Table: user_progress

**Purpose:** Individual user progress tracking per component

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key |
| user_id | UUID | NO | - | Foreign key to users |
| component_id | UUID | NO | - | Foreign key to learning_components |
| status | VARCHAR(20) | YES | 'not_started' | Progress status: not_started, in_progress, completed, mastered |
| progress_percentage | INTEGER | YES | 0 | Progress percentage (0-100) |
| time_spent_minutes | INTEGER | YES | 0 | Total time spent in minutes |
| last_position | JSONB | YES | - | Resume position data (video timestamp, page, etc.) |
| attempts_count | INTEGER | YES | 0 | Number of attempts |
| best_score | DECIMAL(5,2) | YES | - | Best score achieved |
| latest_score | DECIMAL(5,2) | YES | - | Most recent score |
| completion_date | TIMESTAMPTZ | YES | - | Date component was completed |
| mastery_date | TIMESTAMPTZ | YES | - | Date component was mastered |
| notes | TEXT | YES | - | User's personal notes |
| is_bookmarked | BOOLEAN | YES | FALSE | Quick bookmark flag |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: user_id REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY: component_id REFERENCES learning_components(id) ON DELETE CASCADE
- UNIQUE: (user_id, component_id)
- CHECK: status IN ('not_started', 'in_progress', 'completed', 'mastered')
- CHECK: progress_percentage >= 0 AND progress_percentage <= 100

**Indexes:**
- idx_user_progress_user_id ON user_id
- idx_user_progress_component_id ON component_id
- idx_user_progress_status ON status
- idx_user_progress_updated_at ON updated_at

---

## Table: learning_sessions

**Purpose:** Detailed session tracking for analytics

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key |
| user_id | UUID | NO | - | Foreign key to users |
| component_id | UUID | YES | - | Foreign key to learning_components |
| session_start | TIMESTAMPTZ | NO | NOW() | Session start timestamp |
| session_end | TIMESTAMPTZ | YES | - | Session end timestamp |
| duration_minutes | INTEGER | YES | - | Session duration in minutes |
| interaction_count | INTEGER | YES | 0 | Number of user interactions |
| completion_achieved | BOOLEAN | YES | FALSE | Whether completion occurred |
| device_type | VARCHAR(20) | YES | - | Device type: desktop, tablet, mobile |
| browser | VARCHAR(50) | YES | - | Browser information |
| ip_address | INET | YES | - | User IP address |
| session_data | JSONB | YES | - | Additional session metadata |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: user_id REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY: component_id REFERENCES learning_components(id) ON DELETE CASCADE
- CHECK: device_type IN ('desktop', 'tablet', 'mobile')

**Indexes:**
- idx_learning_sessions_user_id ON user_id
- idx_learning_sessions_component_id ON component_id
- idx_learning_sessions_start ON session_start
- idx_learning_sessions_created_at ON created_at

---

## Table: bookmarks

**Purpose:** User bookmarks for quick content access

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key |
| user_id | UUID | NO | - | Foreign key to users |
| component_id | UUID | NO | - | Foreign key to learning_components |
| position | JSONB | NO | - | Bookmark position data |
| note | TEXT | YES | - | User's bookmark note |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: user_id REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY: component_id REFERENCES learning_components(id) ON DELETE CASCADE
- UNIQUE: (user_id, component_id)

---

## Table: question_bank

**Purpose:** Reusable question pool for assessments

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key |
| question_type | VARCHAR(20) | NO | - | Type: multiple_choice, multiple_select, true_false, fill_blank, matching, simulation |
| domain | VARCHAR(100) | NO | - | Subject domain |
| subdomain | VARCHAR(100) | YES | - | Specific subdomain |
| difficulty_level | VARCHAR(20) | YES | 'intermediate' | Difficulty level |
| question_text | TEXT | NO | - | The question text |
| question_data | JSONB | NO | - | Question-specific data (options, etc.) |
| correct_answer | JSONB | NO | - | Correct answer(s) |
| explanation | TEXT | YES | - | Answer explanation |
| hints | TEXT[] | YES | - | Array of hints |
| points | INTEGER | YES | 1 | Point value |
| tags | TEXT[] | YES | - | Searchable tags |
| comptia_objectives | TEXT[] | YES | - | CompTIA objective codes |
| usage_count | INTEGER | YES | 0 | Times question used |
| correct_count | INTEGER | YES | 0 | Times answered correctly |
| incorrect_count | INTEGER | YES | 0 | Times answered incorrectly |
| average_time_seconds | INTEGER | YES | - | Average time to answer |
| is_published | BOOLEAN | YES | FALSE | Publication status |
| created_by | UUID | YES | - | Author user ID |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |
| deleted_at | TIMESTAMPTZ | YES | - | Soft delete timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: created_by REFERENCES users(id) ON DELETE SET NULL
- CHECK: question_type IN (...)
- CHECK: difficulty_level IN ('beginner', 'intermediate', 'advanced')

**Indexes:**
- idx_question_bank_type ON question_type
- idx_question_bank_domain ON domain
- idx_question_bank_difficulty ON difficulty_level
- idx_question_bank_published ON is_published WHERE is_published = TRUE

---

## Table: assessments

**Purpose:** Assessment definitions and configuration

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key |
| assessment_type | VARCHAR(20) | NO | - | Type: quiz, practice_exam, final_exam, checkpoint |
| title | VARCHAR(255) | NO | - | Assessment title |
| slug | VARCHAR(255) | NO | - | URL-friendly identifier |
| description | TEXT | YES | - | Assessment description |
| domain | VARCHAR(100) | YES | - | Subject domain |
| subdomain | VARCHAR(100) | YES | - | Specific subdomain |
| difficulty_level | VARCHAR(20) | YES | 'intermediate' | Difficulty level |
| time_limit_minutes | INTEGER | YES | - | Optional time limit |
| passing_score | INTEGER | YES | 70 | Minimum passing percentage |
| total_questions | INTEGER | NO | - | Number of questions |
| question_ids | UUID[] | NO | - | Array of question IDs |
| randomize_questions | BOOLEAN | YES | TRUE | Randomize question order |
| randomize_answers | BOOLEAN | YES | TRUE | Randomize answer options |
| show_answers_after | BOOLEAN | YES | FALSE | Show answers after completion |
| allow_review | BOOLEAN | YES | TRUE | Allow reviewing answers |
| max_attempts | INTEGER | YES | - | Maximum attempts allowed |
| is_published | BOOLEAN | YES | FALSE | Publication status |
| comptia_objectives | TEXT[] | YES | - | CompTIA objective codes |
| created_by | UUID | YES | - | Author user ID |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |
| published_at | TIMESTAMPTZ | YES | - | Publication timestamp |
| deleted_at | TIMESTAMPTZ | YES | - | Soft delete timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: created_by REFERENCES users(id) ON DELETE SET NULL
- UNIQUE: slug
- CHECK: assessment_type IN (...)
- CHECK: difficulty_level IN ('beginner', 'intermediate', 'advanced')
- CHECK: passing_score >= 0 AND passing_score <= 100

---

## Table: assessment_attempts

**Purpose:** User assessment attempts and scoring

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key |
| user_id | UUID | NO | - | Foreign key to users |
| assessment_id | UUID | NO | - | Foreign key to assessments |
| attempt_number | INTEGER | NO | - | Sequential attempt number |
| status | VARCHAR(20) | YES | 'in_progress' | Status: in_progress, completed, abandoned, timed_out |
| started_at | TIMESTAMPTZ | NO | NOW() | Attempt start time |
| completed_at | TIMESTAMPTZ | YES | - | Attempt completion time |
| time_spent_minutes | INTEGER | YES | - | Total time spent |
| score | DECIMAL(5,2) | YES | - | Total score |
| percentage | DECIMAL(5,2) | YES | - | Score percentage |
| passed | BOOLEAN | YES | - | Pass/fail status |
| total_questions | INTEGER | NO | - | Total questions in attempt |
| correct_answers | INTEGER | YES | 0 | Number correct |
| incorrect_answers | INTEGER | YES | 0 | Number incorrect |
| skipped_questions | INTEGER | YES | 0 | Number skipped |
| question_order | UUID[] | YES | - | Actual question order |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: user_id REFERENCES users(id) ON DELETE CASCADE
- FOREIGN KEY: assessment_id REFERENCES assessments(id) ON DELETE CASCADE
- CHECK: status IN (...)

**Indexes:**
- idx_assessment_attempts_user_id ON user_id
- idx_assessment_attempts_assessment_id ON assessment_id
- idx_assessment_attempts_status ON status
- idx_assessment_attempts_completed_at ON completed_at

---

## Table: assessment_answers

**Purpose:** Individual answers for each question

| Column | Type | Nullable | Default | Description |
|--------|------|----------|---------|-------------|
| id | UUID | NO | uuid_generate_v4() | Primary key |
| attempt_id | UUID | NO | - | Foreign key to assessment_attempts |
| question_id | UUID | NO | - | Foreign key to question_bank |
| user_answer | JSONB | YES | - | User's answer data |
| is_correct | BOOLEAN | YES | - | Correctness flag |
| points_earned | DECIMAL(5,2) | YES | - | Points earned |
| time_spent_seconds | INTEGER | YES | - | Time on question |
| flagged_for_review | BOOLEAN | YES | FALSE | User flagged for review |
| answer_order | INTEGER | YES | - | Order in assessment |
| created_at | TIMESTAMPTZ | NO | NOW() | Record creation timestamp |
| updated_at | TIMESTAMPTZ | NO | NOW() | Last update timestamp |

**Constraints:**
- PRIMARY KEY: id
- FOREIGN KEY: attempt_id REFERENCES assessment_attempts(id) ON DELETE CASCADE
- FOREIGN KEY: question_id REFERENCES question_bank(id) ON DELETE CASCADE

**Indexes:**
- idx_assessment_answers_attempt_id ON attempt_id
- idx_assessment_answers_question_id ON question_id
- idx_assessment_answers_is_correct ON is_correct

---

## Remaining Tables

For brevity, the following tables follow similar patterns. Full details available in schema.sql:

- **achievements**: Achievement definitions
- **user_achievements**: Earned achievements
- **learning_streaks**: Streak tracking
- **study_goals**: User goals
- **user_activity_logs**: Activity audit trail
- **component_analytics**: Component metrics
- **performance_metrics**: System metrics

## Data Types Reference

| PostgreSQL Type | Description | Example Values |
|----------------|-------------|----------------|
| UUID | 128-bit identifier | '550e8400-e29b-41d4-a716-446655440000' |
| VARCHAR(n) | Variable character string | 'example text' |
| TEXT | Unlimited text | Long descriptions |
| INTEGER | 32-bit integer | 42, -100, 0 |
| BOOLEAN | True/false | TRUE, FALSE |
| DECIMAL(p,s) | Fixed decimal | 99.99 |
| TIMESTAMPTZ | Timestamp with timezone | '2025-10-29 12:00:00+00' |
| DATE | Date only | '2025-10-29' |
| TIME | Time only | '09:00:00' |
| JSONB | Binary JSON | {"key": "value"} |
| TEXT[] | Array of text | {"item1", "item2"} |
| UUID[] | Array of UUIDs | {uuid1, uuid2} |
| INTEGER[] | Array of integers | {1, 2, 3} |
| INET | IP address | '192.168.1.1' |

## Constraints Reference

| Constraint Type | Purpose | Example |
|----------------|---------|---------|
| PRIMARY KEY | Unique row identifier | PRIMARY KEY (id) |
| FOREIGN KEY | Relationship enforcement | FOREIGN KEY (user_id) REFERENCES users(id) |
| UNIQUE | Prevent duplicates | UNIQUE (email) |
| CHECK | Value validation | CHECK (age >= 0) |
| NOT NULL | Require value | NOT NULL |
| DEFAULT | Default value | DEFAULT NOW() |

## Cascade Rules

| Rule | Behavior |
|------|----------|
| CASCADE | Delete/update related rows |
| SET NULL | Set foreign key to NULL |
| SET DEFAULT | Set foreign key to default value |
| RESTRICT | Prevent delete/update if references exist |
| NO ACTION | Similar to RESTRICT |

This data dictionary serves as the authoritative reference for all database structures and should be updated with any schema changes.
