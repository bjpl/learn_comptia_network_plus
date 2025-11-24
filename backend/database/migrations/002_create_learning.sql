-- =============================================================================
-- Migration 002: Create Learning Content Tables
-- =============================================================================
-- Description: Create learning components and progress tracking tables
-- Version: 1.0.0
-- Author: Database Architect
-- Created: 2025-10-29
-- Dependencies: 001_create_users.sql
-- =============================================================================

-- =============================================================================
-- UP MIGRATION
-- =============================================================================

-- Learning components catalog
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

-- User progress tracking
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

-- Learning sessions for analytics
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

-- Bookmarks for quick access
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

-- Create indexes
CREATE INDEX idx_learning_components_type ON learning_components(component_type);
CREATE INDEX idx_learning_components_domain ON learning_components(domain);
CREATE INDEX idx_learning_components_subdomain ON learning_components(subdomain);
CREATE INDEX idx_learning_components_published ON learning_components(is_published) WHERE is_published = TRUE;
CREATE INDEX idx_learning_components_difficulty ON learning_components(difficulty_level);
CREATE INDEX idx_learning_components_slug ON learning_components(slug);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_component_id ON user_progress(component_id);
CREATE INDEX idx_user_progress_status ON user_progress(status);
CREATE INDEX idx_user_progress_updated_at ON user_progress(updated_at);

CREATE INDEX idx_learning_sessions_user_id ON learning_sessions(user_id);
CREATE INDEX idx_learning_sessions_component_id ON learning_sessions(component_id);
CREATE INDEX idx_learning_sessions_start ON learning_sessions(session_start);
CREATE INDEX idx_learning_sessions_created_at ON learning_sessions(created_at);

-- Apply update triggers
CREATE TRIGGER update_learning_components_updated_at BEFORE UPDATE ON learning_components
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookmarks_updated_at BEFORE UPDATE ON bookmarks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- DOWN MIGRATION
-- =============================================================================

-- To rollback this migration, run the following:
/*
DROP TRIGGER IF EXISTS update_bookmarks_updated_at ON bookmarks;
DROP TRIGGER IF EXISTS update_user_progress_updated_at ON user_progress;
DROP TRIGGER IF EXISTS update_learning_components_updated_at ON learning_components;
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS learning_sessions CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS learning_components CASCADE;
*/
