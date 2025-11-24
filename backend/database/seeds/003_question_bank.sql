-- =============================================================================
-- Seed Data: Question Bank
-- =============================================================================
-- Description: Create sample questions for assessments
-- Version: 1.0.0
-- Author: Database Architect
-- Created: 2025-10-29
-- =============================================================================

DO $$
DECLARE
    v_instructor_id UUID;
BEGIN
    SELECT id INTO v_instructor_id FROM users WHERE username = 'instructor_john';

    -- Multiple Choice Questions
    INSERT INTO question_bank (
        question_type, domain, subdomain, difficulty_level,
        question_text, question_data, correct_answer, explanation,
        comptia_objectives, points, is_published, created_by
    ) VALUES
    -- OSI Model Questions
    ('multiple_choice', 'Networking Fundamentals', 'OSI Model', 'beginner',
     'Which OSI layer is responsible for end-to-end communication and data segmentation?',
     '{"options": ["Physical", "Data Link", "Network", "Transport", "Session"]}'::jsonb,
     '{"correct": "Transport", "index": 3}'::jsonb,
     'The Transport layer (Layer 4) is responsible for end-to-end communication, flow control, and data segmentation. TCP and UDP operate at this layer.',
     ARRAY['1.1'], 1, TRUE, v_instructor_id),

    ('multiple_choice', 'Networking Fundamentals', 'OSI Model', 'intermediate',
     'At which OSI layer does a switch primarily operate?',
     '{"options": ["Layer 1", "Layer 2", "Layer 3", "Layer 4"]}'::jsonb,
     '{"correct": "Layer 2", "index": 1}'::jsonb,
     'Switches primarily operate at Layer 2 (Data Link layer) using MAC addresses for forwarding decisions. Layer 3 switches can also route.',
     ARRAY['1.1'], 1, TRUE, v_instructor_id),

    -- TCP/IP Questions
    ('multiple_choice', 'Networking Fundamentals', 'TCP/IP', 'intermediate',
     'What is the valid range for private Class C IP addresses?',
     '{"options": ["10.0.0.0 to 10.255.255.255", "172.16.0.0 to 172.31.255.255", "192.168.0.0 to 192.168.255.255", "169.254.0.0 to 169.254.255.255"]}'::jsonb,
     '{"correct": "192.168.0.0 to 192.168.255.255", "index": 2}'::jsonb,
     'Class C private addresses range from 192.168.0.0 to 192.168.255.255. These are commonly used in home and small business networks.',
     ARRAY['1.3'], 1, TRUE, v_instructor_id),

    ('multiple_choice', 'Networking Fundamentals', 'TCP/IP', 'advanced',
     'What is the purpose of the TCP three-way handshake?',
     '{"options": ["Establish a connection", "Transfer data", "Terminate a connection", "Acknowledge receipt"]}'::jsonb,
     '{"correct": "Establish a connection", "index": 0}'::jsonb,
     'The three-way handshake (SYN, SYN-ACK, ACK) establishes a reliable TCP connection before data transfer begins.',
     ARRAY['1.3'], 1, TRUE, v_instructor_id),

    -- Network Topology Questions
    ('multiple_choice', 'Networking Fundamentals', 'Network Topologies', 'beginner',
     'Which topology provides the highest redundancy but is most expensive to implement?',
     '{"options": ["Bus", "Star", "Ring", "Mesh"]}'::jsonb,
     '{"correct": "Mesh", "index": 3}'::jsonb,
     'Mesh topology provides the highest redundancy as every device connects to every other device, but requires the most cabling and ports.',
     ARRAY['1.2'], 1, TRUE, v_instructor_id),

    -- Routing Questions
    ('multiple_choice', 'Network Implementations', 'Routing', 'intermediate',
     'Which routing protocol uses hop count as its metric?',
     '{"options": ["OSPF", "RIP", "EIGRP", "BGP"]}'::jsonb,
     '{"correct": "RIP", "index": 1}'::jsonb,
     'RIP (Routing Information Protocol) uses hop count as its metric, with a maximum of 15 hops. This makes it simple but limited for large networks.',
     ARRAY['2.1'], 1, TRUE, v_instructor_id),

    ('multiple_choice', 'Network Implementations', 'Routing', 'advanced',
     'What is the administrative distance of a directly connected route?',
     '{"options": ["0", "1", "90", "110", "120"]}'::jsonb,
     '{"correct": "0", "index": 0}'::jsonb,
     'Directly connected routes have an administrative distance of 0, making them the most trusted routes in the routing table.',
     ARRAY['2.1'], 1, TRUE, v_instructor_id),

    -- VLAN Questions
    ('multiple_choice', 'Network Implementations', 'Switching', 'intermediate',
     'What is the default VLAN on Cisco switches?',
     '{"options": ["VLAN 0", "VLAN 1", "VLAN 10", "VLAN 100"]}'::jsonb,
     '{"correct": "VLAN 1", "index": 1}'::jsonb,
     'VLAN 1 is the default VLAN on Cisco switches. All ports are assigned to VLAN 1 by default, though it is best practice to use other VLANs for security.',
     ARRAY['2.3'], 1, TRUE, v_instructor_id),

    -- Wireless Questions
    ('multiple_choice', 'Network Implementations', 'Wireless', 'intermediate',
     'Which 802.11 standard operates only in the 5 GHz frequency band?',
     '{"options": ["802.11b", "802.11g", "802.11n", "802.11a"]}'::jsonb,
     '{"correct": "802.11a", "index": 3}'::jsonb,
     '802.11a operates exclusively in the 5 GHz band with speeds up to 54 Mbps. It offers less interference but shorter range than 2.4 GHz standards.',
     ARRAY['2.4'], 1, TRUE, v_instructor_id),

    -- Network Security Questions
    ('multiple_choice', 'Network Security', 'Threats', 'intermediate',
     'What type of attack involves flooding a server with traffic to make it unavailable?',
     '{"options": ["Man-in-the-middle", "DDoS", "Phishing", "SQL Injection"]}'::jsonb,
     '{"correct": "DDoS", "index": 1}'::jsonb,
     'A Distributed Denial of Service (DDoS) attack floods a target with traffic from multiple sources to overwhelm it and make it unavailable.',
     ARRAY['4.1'], 1, TRUE, v_instructor_id),

    ('multiple_choice', 'Network Security', 'Encryption', 'advanced',
     'Which encryption protocol provides the strongest security for wireless networks?',
     '{"options": ["WEP", "WPA", "WPA2", "WPA3"]}'::jsonb,
     '{"correct": "WPA3", "index": 3}'::jsonb,
     'WPA3 is the latest and most secure wireless encryption standard, offering improved encryption and protection against brute-force attacks.',
     ARRAY['4.3'], 1, TRUE, v_instructor_id),

    -- Multiple Select Questions
    ('multiple_select', 'Network Troubleshooting', 'Tools', 'intermediate',
     'Which of the following are valid uses of the ping command? (Select all that apply)',
     '{"options": ["Test connectivity", "Verify DNS resolution", "Measure latency", "Configure IP addresses", "Transfer files"]}'::jsonb,
     '{"correct": ["Test connectivity", "Verify DNS resolution", "Measure latency"], "indices": [0, 1, 2]}'::jsonb,
     'Ping is used to test connectivity, verify DNS resolution (by pinging hostnames), and measure latency through round-trip time.',
     ARRAY['5.2'], 2, TRUE, v_instructor_id),

    ('multiple_select', 'Network Security', 'Firewalls', 'advanced',
     'Which factors can a firewall use to filter traffic? (Select all that apply)',
     '{"options": ["Source IP address", "Destination port", "Protocol type", "Packet size", "All of the above"]}'::jsonb,
     '{"correct": ["Source IP address", "Destination port", "Protocol type", "Packet size"], "indices": [0, 1, 2, 3]}'::jsonb,
     'Firewalls can filter based on multiple criteria including IP addresses, ports, protocols, and packet characteristics.',
     ARRAY['4.2'], 2, TRUE, v_instructor_id),

    -- True/False Questions
    ('true_false', 'Networking Fundamentals', 'OSI Model', 'beginner',
     'The Data Link layer is responsible for logical addressing.',
     '{"options": ["True", "False"]}'::jsonb,
     '{"correct": "False", "index": 1}'::jsonb,
     'False. The Network layer (Layer 3) handles logical addressing (IP addresses). The Data Link layer handles physical addressing (MAC addresses).',
     ARRAY['1.1'], 1, TRUE, v_instructor_id),

    ('true_false', 'Network Implementations', 'Routing', 'intermediate',
     'Static routes are automatically updated when network topology changes.',
     '{"options": ["True", "False"]}'::jsonb,
     '{"correct": "False", "index": 1}'::jsonb,
     'False. Static routes must be manually updated by administrators. Dynamic routing protocols automatically adapt to topology changes.',
     ARRAY['2.1'], 1, TRUE, v_instructor_id);

    -- Update usage statistics for realism
    UPDATE question_bank
    SET usage_count = (RANDOM() * 100)::INTEGER + 10,
        correct_count = (RANDOM() * 60)::INTEGER + 20,
        incorrect_count = (RANDOM() * 40)::INTEGER + 5,
        average_time_seconds = (RANDOM() * 120)::INTEGER + 30
    WHERE is_published = TRUE;

END $$;
