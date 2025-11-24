-- =============================================================================
-- Migration 003: Create Assessment Tables
-- =============================================================================
-- Description: Create assessment, question bank, and attempt tracking tables
-- Version: 1.0.0
-- Author: Database Architect
-- Created: 2025-10-29
-- Dependencies: 001_create_users.sql
-- =============================================================================

-- =============================================================================
-- UP MIGRATION
-- =============================================================================

-- Question bank for reusable questions
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

-- Assessments definition
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

-- Assessment attempts tracking
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

-- Individual answers for each attempt
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

-- Create indexes
CREATE INDEX idx_question_bank_type ON question_bank(question_type);
CREATE INDEX idx_question_bank_domain ON question_bank(domain);
CREATE INDEX idx_question_bank_subdomain ON question_bank(subdomain);
CREATE INDEX idx_question_bank_difficulty ON question_bank(difficulty_level);
CREATE INDEX idx_question_bank_published ON question_bank(is_published) WHERE is_published = TRUE;

CREATE INDEX idx_assessment_attempts_user_id ON assessment_attempts(user_id);
CREATE INDEX idx_assessment_attempts_assessment_id ON assessment_attempts(assessment_id);
CREATE INDEX idx_assessment_attempts_status ON assessment_attempts(status);
CREATE INDEX idx_assessment_attempts_completed_at ON assessment_attempts(completed_at);

CREATE INDEX idx_assessment_answers_attempt_id ON assessment_answers(attempt_id);
CREATE INDEX idx_assessment_answers_question_id ON assessment_answers(question_id);
CREATE INDEX idx_assessment_answers_is_correct ON assessment_answers(is_correct);

-- Apply update triggers
CREATE TRIGGER update_question_bank_updated_at BEFORE UPDATE ON question_bank
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_attempts_updated_at BEFORE UPDATE ON assessment_attempts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessment_answers_updated_at BEFORE UPDATE ON assessment_answers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- DOWN MIGRATION
-- =============================================================================

-- To rollback this migration, run the following:
/*
DROP TRIGGER IF EXISTS update_assessment_answers_updated_at ON assessment_answers;
DROP TRIGGER IF EXISTS update_assessment_attempts_updated_at ON assessment_attempts;
DROP TRIGGER IF EXISTS update_assessments_updated_at ON assessments;
DROP TRIGGER IF EXISTS update_question_bank_updated_at ON question_bank;
DROP TABLE IF EXISTS assessment_answers CASCADE;
DROP TABLE IF EXISTS assessment_attempts CASCADE;
DROP TABLE IF EXISTS assessments CASCADE;
DROP TABLE IF EXISTS question_bank CASCADE;
*/
