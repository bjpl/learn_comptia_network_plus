-- =============================================================================
-- Seed Data: Learning Components Catalog
-- =============================================================================
-- Description: Create sample learning components across all domains
-- Version: 1.0.0
-- Author: Database Architect
-- Created: 2025-10-29
-- =============================================================================

-- Get instructor ID for created_by field
DO $$
DECLARE
    v_instructor_id UUID;
BEGIN
    SELECT id INTO v_instructor_id FROM users WHERE username = 'instructor_john';

    -- Domain 1.0: Networking Fundamentals
    INSERT INTO learning_components (
        component_type, domain, subdomain, title, slug, description,
        difficulty_level, estimated_duration_minutes, order_index,
        objectives, comptia_objectives, is_published, created_by
    ) VALUES
    ('lesson', 'Networking Fundamentals', 'OSI Model', 'Understanding the OSI Model',
     'networking-fundamentals-osi-model',
     'Learn the seven layers of the OSI model and how data flows through networks.',
     'beginner', 45, 1,
     ARRAY['Identify OSI layers', 'Understand layer functions', 'Recognize layer protocols'],
     ARRAY['1.1'], TRUE, v_instructor_id),

    ('video', 'Networking Fundamentals', 'Network Topologies', 'Network Topology Overview',
     'networking-fundamentals-topologies',
     'Video introduction to physical and logical network topologies.',
     'beginner', 30, 2,
     ARRAY['Identify topology types', 'Understand topology advantages', 'Choose appropriate topology'],
     ARRAY['1.2'], TRUE, v_instructor_id),

    ('flashcard', 'Networking Fundamentals', 'TCP/IP', 'TCP/IP Protocol Suite',
     'networking-fundamentals-tcpip',
     'Interactive flashcards covering TCP/IP protocols and their functions.',
     'intermediate', 20, 3,
     ARRAY['Memorize protocol names', 'Match protocols to OSI layers', 'Understand protocol purposes'],
     ARRAY['1.3'], TRUE, v_instructor_id),

    -- Domain 2.0: Network Implementations
    ('lesson', 'Network Implementations', 'Routing', 'Routing Fundamentals',
     'network-implementations-routing',
     'Comprehensive guide to routing protocols and router configuration.',
     'intermediate', 60, 4,
     ARRAY['Understand routing concepts', 'Configure static routes', 'Implement dynamic routing'],
     ARRAY['2.1', '2.2'], TRUE, v_instructor_id),

    ('lab', 'Network Implementations', 'Switching', 'Switch Configuration Lab',
     'network-implementations-switching-lab',
     'Hands-on lab for configuring VLANs and trunk ports on network switches.',
     'intermediate', 90, 5,
     ARRAY['Configure VLANs', 'Set up trunk ports', 'Verify switch configuration'],
     ARRAY['2.3'], TRUE, v_instructor_id),

    ('video', 'Network Implementations', 'Wireless', 'Wireless Networking Standards',
     'network-implementations-wireless',
     'Video covering 802.11 standards, frequencies, and wireless security.',
     'intermediate', 40, 6,
     ARRAY['Compare 802.11 standards', 'Understand frequency bands', 'Implement wireless security'],
     ARRAY['2.4'], TRUE, v_instructor_id),

    -- Domain 3.0: Network Operations
    ('lesson', 'Network Operations', 'Monitoring', 'Network Monitoring Tools',
     'network-operations-monitoring',
     'Learn to use SNMP, NetFlow, and other monitoring tools.',
     'intermediate', 50, 7,
     ARRAY['Configure SNMP', 'Analyze NetFlow data', 'Use monitoring dashboards'],
     ARRAY['3.1'], TRUE, v_instructor_id),

    ('simulation', 'Network Operations', 'Troubleshooting', 'Network Troubleshooting Simulator',
     'network-operations-troubleshooting-sim',
     'Interactive simulation of common network problems and solutions.',
     'advanced', 120, 8,
     ARRAY['Diagnose connectivity issues', 'Use troubleshooting methodology', 'Resolve network problems'],
     ARRAY['3.2', '3.3'], TRUE, v_instructor_id),

    -- Domain 4.0: Network Security
    ('lesson', 'Network Security', 'Threats', 'Common Network Threats',
     'network-security-threats',
     'Identify and understand common network security threats and vulnerabilities.',
     'intermediate', 45, 9,
     ARRAY['Identify threat types', 'Understand attack vectors', 'Recognize vulnerabilities'],
     ARRAY['4.1'], TRUE, v_instructor_id),

    ('video', 'Network Security', 'Firewalls', 'Firewall Configuration',
     'network-security-firewalls',
     'Video guide to configuring and managing network firewalls.',
     'advanced', 55, 10,
     ARRAY['Understand firewall types', 'Configure ACLs', 'Implement security policies'],
     ARRAY['4.2'], TRUE, v_instructor_id),

    ('lesson', 'Network Security', 'Encryption', 'Network Encryption Protocols',
     'network-security-encryption',
     'Learn about SSL/TLS, IPSec, and other encryption protocols.',
     'advanced', 50, 11,
     ARRAY['Understand encryption types', 'Implement SSL/TLS', 'Configure VPN encryption'],
     ARRAY['4.3'], TRUE, v_instructor_id),

    -- Domain 5.0: Network Troubleshooting
    ('lesson', 'Network Troubleshooting', 'Methodology', 'Troubleshooting Methodology',
     'network-troubleshooting-methodology',
     'Systematic approach to diagnosing and resolving network issues.',
     'intermediate', 40, 12,
     ARRAY['Apply troubleshooting steps', 'Use diagnostic tools', 'Document solutions'],
     ARRAY['5.1'], TRUE, v_instructor_id),

    ('lab', 'Network Troubleshooting', 'Tools', 'Command Line Tools Lab',
     'network-troubleshooting-tools-lab',
     'Practice using ping, traceroute, nslookup, and other CLI tools.',
     'intermediate', 75, 13,
     ARRAY['Use ping effectively', 'Interpret traceroute output', 'Troubleshoot DNS with nslookup'],
     ARRAY['5.2', '5.3'], TRUE, v_instructor_id),

    -- Practice exams and study materials
    ('quiz', 'Practice Assessments', 'Quick Quiz', 'OSI Model Quick Quiz',
     'practice-osi-quiz',
     'Quick 10-question quiz on OSI model fundamentals.',
     'beginner', 15, 14,
     ARRAY['Test OSI knowledge', 'Reinforce concepts', 'Identify weak areas'],
     ARRAY['1.1'], TRUE, v_instructor_id),

    ('practice_exam', 'Practice Assessments', 'Full Practice', 'Network+ Practice Exam 1',
     'practice-full-exam-1',
     'Full-length practice exam covering all Network+ domains.',
     'intermediate', 90, 15,
     ARRAY['Simulate exam conditions', 'Test comprehensive knowledge', 'Prepare for certification'],
     ARRAY['1.0', '2.0', '3.0', '4.0', '5.0'], TRUE, v_instructor_id),

    ('study_guide', 'Study Materials', 'Reference', 'Network+ Quick Reference Guide',
     'study-quick-reference',
     'Comprehensive quick reference guide for Network+ exam.',
     'intermediate', 30, 16,
     ARRAY['Quick concept review', 'Reference common commands', 'Review exam objectives'],
     ARRAY['1.0', '2.0', '3.0', '4.0', '5.0'], TRUE, v_instructor_id);

    -- Update view counts and ratings for realism
    UPDATE learning_components
    SET view_count = (RANDOM() * 500)::INTEGER + 50,
        completion_count = (RANDOM() * 200)::INTEGER + 10,
        average_rating = ROUND((RANDOM() * 2 + 3)::NUMERIC, 2),
        rating_count = (RANDOM() * 100)::INTEGER + 5
    WHERE is_published = TRUE;

END $$;
