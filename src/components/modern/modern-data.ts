/**
 * Data for modern network technology components
 */

import type {
  TechnologyArticle,
  TechnologyFeature,
  IPv6MigrationScenario,
  IaCTemplate,
  ValidationCheck,
  Playbook,
  ConfigurationDrift,
} from './modern-types';

// Technology Articles for Summarization
export const technologyArticles: TechnologyArticle[] = [
  {
    id: 'sdn-intro',
    title: 'Software-Defined Networking: Revolutionizing Network Management',
    category: 'sdn-sdwan',
    wordCount: 1850,
    keyTopics: ['SDN', 'SD-WAN', 'Network Virtualization', 'Central Management'],
    difficulty: 'intermediate',
    content: `
Software-Defined Networking (SDN) represents a paradigm shift in network architecture, separating the control plane from the data plane to enable centralized network management and programmability. Traditional networks rely on distributed control, where each network device makes forwarding decisions independently. SDN changes this by centralizing control in a software-based controller, allowing administrators to manage the entire network from a single point.

Application-aware routing is a cornerstone feature of SDN and SD-WAN technologies. Unlike traditional routing that relies solely on IP addresses and basic metrics, application-aware routing examines application traffic patterns, performance requirements, and business priorities. This enables the network to dynamically route critical applications over optimal paths while relegating less important traffic to alternative routes. For example, video conferencing might be routed over low-latency MPLS connections while email traffic uses less expensive internet connections.

Zero-touch provisioning (ZTP) eliminates manual configuration of network devices, a significant advancement in deployment efficiency. When a new device connects to the network, it automatically downloads its configuration from a central repository, applies settings, and becomes operational without human intervention. This dramatically reduces deployment time and configuration errors, especially valuable for branch offices and remote locations where skilled IT staff may not be available.

Transport agnostic architecture allows SD-WAN solutions to operate across any underlying network transport – MPLS, broadband internet, LTE, or satellite connections. The SD-WAN overlay abstracts the underlying transport layer, making all connections appear as a unified fabric. This flexibility enables organizations to leverage cost-effective internet connections alongside traditional MPLS, optimizing costs while maintaining performance.

Central policy management consolidates security, routing, and quality-of-service policies in a centralized controller. Administrators define policies once and push them network-wide, ensuring consistent enforcement across all locations. Policy changes propagate automatically, eliminating the need to configure each device individually. This centralization improves security posture, reduces configuration drift, and enables rapid response to changing business requirements.

SD-WAN specifically extends SDN principles to wide-area networks, connecting distributed locations through intelligent overlay networks. Traditional WAN architectures often require expensive MPLS circuits and complex configurations. SD-WAN simplifies this by creating encrypted tunnels over any available transport, automatically selecting optimal paths based on real-time performance monitoring. Built-in security features like IPsec encryption and next-generation firewall capabilities protect traffic without requiring additional appliances.

The benefits of SDN and SD-WAN extend beyond technical capabilities. Organizations report significant cost savings by reducing MPLS dependency, faster deployment of new sites, improved application performance through intelligent routing, and enhanced security through centralized policy enforcement. As network demands continue growing with cloud adoption and distributed workforces, SDN and SD-WAN technologies become increasingly essential for maintaining agile, efficient, and secure network infrastructure.
    `,
  },
  {
    id: 'vxlan-deep',
    title: 'VXLAN: Extending Layer 2 Networks Across Data Centers',
    category: 'vxlan',
    wordCount: 1650,
    keyTopics: ['VXLAN', 'Network Virtualization', 'Data Center', 'Overlay Networks'],
    difficulty: 'advanced',
    content: `
Virtual Extensible LAN (VXLAN) addresses fundamental limitations in traditional VLAN technology, particularly the 4,096 VLAN limit imposed by the 12-bit VLAN ID field in 802.1Q headers. Modern data centers with multi-tenant environments easily exhaust this address space, requiring more scalable solutions. VXLAN overcomes this by using a 24-bit VXLAN Network Identifier (VNI), supporting over 16 million logical networks – sufficient for even the largest cloud providers.

Data Center Interconnect (DCI) represents one of VXLAN's most powerful applications. Organizations often maintain multiple data centers for redundancy, disaster recovery, and geographic distribution. VXLAN enables seamless Layer 2 connectivity between these facilities, allowing virtual machines to migrate between data centers without IP address changes. This capability is crucial for disaster recovery scenarios where applications must fail over to backup sites while maintaining network connectivity.

Layer 2 over Layer 3 encapsulation forms the technical foundation of VXLAN. Traditional Layer 2 networks struggle with scalability and geographic distribution due to Spanning Tree Protocol limitations and broadcast domain constraints. VXLAN encapsulates Ethernet frames within UDP packets, allowing them to traverse Layer 3 networks. This approach leverages existing IP routing infrastructure, eliminating Spanning Tree limitations while maintaining Layer 2 semantics for applications requiring same-subnet communication.

The VXLAN Tunnel Endpoint (VTEP) performs encapsulation and decapsulation of VXLAN packets. VTEPs can be implemented in software on hypervisors or in hardware on network switches. When a virtual machine sends a frame, the VTEP encapsulates it with VXLAN, UDP, and IP headers before transmitting it across the underlay network. The receiving VTEP decapsulates the packet and delivers the original Ethernet frame to the destination. This process is transparent to end systems, which operate as if connected to a traditional Layer 2 network.

VXLAN supports both unicast and multicast underlay modes. Multicast mode uses IP multicast groups for broadcast, unknown unicast, and multicast (BUM) traffic distribution, simplifying MAC address learning but requiring multicast support in the underlay network. Unicast mode, also called head-end replication, eliminates the multicast requirement by having the source VTEP replicate BUM frames to all remote VTEPs, though this increases bandwidth consumption and processing overhead.

Network virtualization overlays built on VXLAN enable sophisticated multi-tenant environments. Each tenant receives isolated logical networks with complete control over IP addressing and network topology, regardless of the underlying physical infrastructure. This isolation is enforced through VNI separation, ensuring traffic from different tenants never intermingles. Service providers leverage this capability to offer Infrastructure-as-a-Service (IaaS) while cloud-native applications use it for micro-segmentation and zero-trust networking.

Performance considerations include MTU sizing, as VXLAN adds 50 bytes of overhead to each packet. Networks must support jumbo frames or configure appropriate MTU settings to avoid fragmentation. Hardware VTEP implementations offer line-rate performance, while software VTEPs consume CPU resources on hosts. Modern implementations include optimizations like VXLAN offload to network interface cards, reducing CPU overhead while maintaining flexibility.
    `,
  },
  {
    id: 'zero-trust',
    title: 'Zero Trust Architecture: Never Trust, Always Verify',
    category: 'zero-trust',
    wordCount: 1750,
    keyTopics: ['Zero Trust', 'Security', 'Authentication', 'Microsegmentation'],
    difficulty: 'intermediate',
    content: `
Zero Trust Architecture represents a fundamental shift from traditional perimeter-based security models. The conventional approach assumes anything inside the network perimeter is trustworthy, while external traffic faces scrutiny. This model fails in modern environments where users work remotely, applications run in multiple clouds, and sophisticated attackers breach perimeters with increasing frequency. Zero Trust operates on the principle "never trust, always verify," requiring continuous authentication and authorization regardless of location.

Policy-based authentication forms the foundation of Zero Trust implementations. Instead of simple username and password combinations, Zero Trust employs multiple factors: user identity, device health, location, time of day, behavior patterns, and data sensitivity. Each access request triggers policy evaluation considering these factors. For example, an employee accessing public data from a company-managed device on the corporate network might proceed with minimal friction, while the same user accessing sensitive financial data from a personal device on public Wi-Fi faces additional authentication challenges and potential access denial.

Authorization requirements extend beyond initial authentication to continuous verification throughout sessions. Traditional systems authenticate users once and grant access until logout. Zero Trust continuously evaluates authorization based on behavior analysis and risk scoring. If a user suddenly accesses unusual data volumes, connects from a new geographic location, or exhibits abnormal behavior patterns, the system may require re-authentication, reduce access privileges, or terminate the session entirely.

Least privilege access ensures users and systems receive only the minimum permissions necessary for their functions. This principle limits the impact of compromised credentials or insider threats. Implementation requires detailed access policies based on roles, responsibilities, and data sensitivity. For instance, a customer service representative might access customer records but not payment processing systems, while database administrators access infrastructure but not customer data. Modern Zero Trust systems dynamically adjust permissions based on context, temporarily elevating privileges when needed and immediately revoking them upon task completion.

Microsegmentation divides networks into small, isolated zones with separate access controls. Traditional flat networks allow lateral movement once attackers breach the perimeter. Microsegmentation restricts communication between segments, containing breaches and limiting damage. Implementation typically uses software-defined perimeters, host-based firewalls, or network segmentation. Each workload or application receives its own security boundary, preventing unauthorized communication even within the same data center.

Identity and Access Management (IAM) systems serve as the control plane for Zero Trust architectures. These platforms manage user identities, authenticate access requests, enforce policies, and log all activities. Modern IAM solutions integrate with numerous identity providers, support multi-factor authentication, implement risk-based access controls, and provide detailed audit trails. Single Sign-On (SSO) improves user experience while maintaining security, allowing users to authenticate once and access multiple applications without repeated credential entry.

Network architecture must evolve to support Zero Trust principles. Software-Defined Perimeter (SDP) technology creates invisible infrastructure, only revealing network resources after authentication. This approach eliminates the attack surface visible to unauthenticated users. Secure Access Service Edge (SASE) combines network and security functions in cloud-delivered services, applying Zero Trust principles to all traffic regardless of source or destination.

Implementation challenges include legacy application compatibility, user experience concerns, and organizational change management. Successful deployments typically follow phased approaches: inventorying assets and data flows, defining access policies, implementing controls for high-value assets first, gradually extending coverage, and continuously monitoring and adjusting policies. The transition requires cultural change, shifting from implicit trust to explicit verification while maintaining operational efficiency.
    `,
  },
  {
    id: 'sase-sse',
    title: 'SASE and SSE: Cloud-Native Network Security Convergence',
    category: 'sase-sse',
    wordCount: 1900,
    keyTopics: ['SASE', 'SSE', 'Cloud Security', 'SD-WAN'],
    difficulty: 'advanced',
    content: `
Secure Access Service Edge (SASE) represents the convergence of network and security services into a unified cloud-delivered platform. Traditional architectures route traffic through data centers for security inspection, creating latency and bandwidth bottlenecks. SASE delivers security at the edge, close to users and resources, optimizing both performance and protection. This approach aligns with modern IT environments where users, applications, and data exist across distributed locations rather than centralized data centers.

The SASE framework combines several technologies: SD-WAN for intelligent connectivity, Cloud Access Security Broker (CASB) for cloud application security, Secure Web Gateway (SWG) for internet access protection, Zero Trust Network Access (ZTNA) for application access control, and Firewall-as-a-Service (FWaaS) for network security. These components integrate into a single platform, eliminating the complexity of managing separate point solutions while ensuring consistent policy enforcement.

Security Service Edge (SSE) focuses specifically on the security components within the SASE framework. While SASE encompasses both networking and security, SSE concentrates on CASB, SWG, ZTNA, and data loss prevention capabilities. Organizations already possessing robust SD-WAN solutions may adopt SSE to enhance security without replacing existing network infrastructure. This modular approach allows incremental migration toward full SASE architectures.

Cloud-delivered security inspection processes all traffic through distributed points of presence (PoPs) globally positioned to minimize latency. When users access resources, traffic routes through the nearest PoP for security inspection before reaching the destination. This architecture contrasts with traditional hub-and-spoke models where branch office traffic backhauled to headquarters creates inefficiency. SASE inspection occurs inline with minimal latency impact, supporting modern work-from-anywhere requirements.

CASB functionality provides visibility and control over cloud application usage. Organizations often discover employees using dozens of unsanctioned cloud services, creating security and compliance risks. CASB identifies cloud applications, assesses risk levels, enforces usage policies, and protects sensitive data. Advanced CASB solutions use API integration for deep visibility into application activities, enabling granular controls like preventing sensitive data uploads to personal cloud storage while allowing business-approved applications.

Secure Web Gateway capabilities filter internet traffic, blocking malicious websites, preventing malware downloads, and enforcing acceptable use policies. Modern SWGs employ machine learning to identify previously unknown threats, decrypt TLS traffic for inspection, and apply category-based filtering. Integration with threat intelligence feeds enables real-time blocking of newly identified malicious domains before they can impact users.

Zero Trust Network Access provides application-level access control without placing users on the corporate network. Traditional VPNs grant broad network access after authentication, allowing lateral movement. ZTNA authenticates users and devices, then creates encrypted micro-tunnels to specific applications based on authorization policies. Applications remain invisible to unauthorized users, reducing the attack surface and preventing lateral movement even if credentials are compromised.

Firewall-as-a-Service extends next-generation firewall capabilities to cloud-delivered platforms. FWaaS inspects traffic for threats using intrusion prevention systems, anti-malware engines, and URL filtering. Unlike appliance-based firewalls limited by hardware capacity, FWaaS scales dynamically with demand. This elasticity supports sudden traffic surges from remote workers or new sites without capacity planning or hardware procurement.

Data Loss Prevention (DLP) capabilities prevent sensitive information from leaving organizational control. DLP examines traffic for patterns matching sensitive data types – credit cards, social security numbers, intellectual property, or custom-defined content. When detected, DLP can block transmission, encrypt data, or alert administrators. Integration with SASE ensures consistent DLP enforcement regardless of how users access applications – from corporate networks, remote locations, or mobile devices.

Implementation considerations include bandwidth requirements for sending traffic to cloud PoPs, integration with existing security tools, user experience during migration, and total cost of ownership compared to traditional architectures. Successful deployments typically follow phased approaches: piloting with remote workers, expanding to branch offices, eventually migrating all traffic. Performance monitoring ensures quality of service meets requirements while security policies evolve based on observed traffic patterns.
    `,
  },
  {
    id: 'iac-automation',
    title: 'Infrastructure as Code: Automating Network Configuration and Management',
    category: 'iac',
    wordCount: 2000,
    keyTopics: ['IaC', 'Automation', 'DevOps', 'Configuration Management'],
    difficulty: 'intermediate',
    content: `
Infrastructure as Code (IaC) transforms network management from manual, error-prone processes to automated, repeatable workflows defined in code. Traditional network configuration requires administrators to log into each device and enter commands manually, creating opportunities for inconsistencies and mistakes. IaC treats infrastructure configuration as software, using version control, testing, and deployment practices borrowed from software development. This approach brings predictability, consistency, and agility to network operations.

Automation with playbooks and templates enables repeatable configuration deployment across thousands of devices. Playbooks define sequences of tasks to accomplish specific objectives – deploying new routers, updating firewall rules, or configuring VLANs. Templates provide reusable configurations with variables for customization. For example, a router configuration template might include placeholders for IP addresses, routing protocols, and access control lists, allowing the same template to configure hundreds of routers with site-specific values.

Configuration drift detection identifies unauthorized or accidental changes that deviate from intended configurations. Over time, manual changes, troubleshooting modifications, and errors cause actual device configurations to differ from documented standards. Drift detection tools continuously compare running configurations against authoritative sources, reporting discrepancies. Automated remediation can revert unauthorized changes, ensuring compliance with security policies and operational standards.

Version control and branching apply software development practices to infrastructure management. All configuration files reside in version control repositories like Git, creating complete history of changes including who made them, when, and why. Branching enables testing configuration changes in isolated environments before merging to production. Code reviews ensure changes receive peer validation before deployment, catching errors and sharing knowledge across teams.

Central repository management consolidates infrastructure definitions, creating a single source of truth for network configurations. Rather than maintaining configurations on individual devices or scattered documentation, all definitions live in centralized repositories. This centralization enables disaster recovery by quickly rebuilding failed infrastructure from code, simplifies auditing through complete change history, and facilitates knowledge transfer when team members change.

Declarative configuration languages describe desired state rather than procedural steps. Instead of specifying "run this command, then this command," declarative approaches state "ensure this configuration exists." The automation platform determines necessary steps to achieve the desired state, handling dependencies and idempotency. This abstraction simplifies complex workflows and makes configurations more maintainable as business requirements evolve.

Testing and validation occur before production deployment, catching errors early when they're less costly to fix. Automated tests verify syntax correctness, validate configurations against policy requirements, and simulate deployment in test environments. Continuous integration pipelines automatically run these tests whenever changes are committed, providing immediate feedback to developers. Only changes passing all tests proceed to production deployment.

Automated upgrade scheduling eliminates manual coordination for software updates and patches. IaC platforms can automatically schedule maintenance windows, backup configurations, deploy updates, validate results, and roll back if problems occur. This automation reduces downtime, ensures consistent update application across infrastructure, and frees staff for higher-value activities.

Dynamic inventory management automatically discovers and tracks infrastructure resources. Traditional inventory spreadsheets become outdated quickly as infrastructure changes. Dynamic inventory queries live systems, cloud providers, and virtualization platforms to build real-time inventory. This automation ensures playbooks target correct devices, enables accurate capacity planning, and supports compliance auditing.

Orchestration capabilities coordinate complex workflows across multiple systems and tools. For instance, provisioning a new application environment might require: creating VLANs, configuring routers, deploying firewalls, provisioning virtual machines, installing applications, and configuring monitoring. Orchestration platforms coordinate these tasks, managing dependencies, handling errors, and providing visibility into workflow status.

Security benefits include audit trails documenting all changes, peer review of modifications before deployment, automated compliance checking against security policies, and rapid response to vulnerabilities through automated patching. IaC also supports immutable infrastructure concepts where systems are replaced rather than modified, eliminating configuration drift entirely.

Organizational change management represents a significant implementation challenge. Network engineers must develop coding skills, adopt software development practices, and shift from reactive firefighting to proactive automation development. Successful transitions typically include training programs, starting with simple automation projects, celebrating early wins, and gradually expanding automation coverage while demonstrating tangible benefits in reduced errors, faster deployments, and improved reliability.
    `,
  },
  {
    id: 'ipv6-transition',
    title: 'IPv6 Transition Strategies: Addressing the Address Exhaustion Challenge',
    category: 'ipv6',
    wordCount: 1800,
    keyTopics: ['IPv6', 'Dual Stack', 'Tunneling', 'NAT64'],
    difficulty: 'intermediate',
    content: `
IPv4 address exhaustion represents one of the internet's most significant infrastructure challenges. The 32-bit IPv4 address space provides approximately 4.3 billion addresses, seemingly abundant when the internet began but inadequate for today's billions of devices. Regional Internet Registries exhausted their IPv4 allocations years ago, forcing organizations to adopt IPv6 or employ increasingly complex workarounds. IPv6's 128-bit address space provides 340 undecillion addresses – enough for the foreseeable future even with explosive IoT growth.

Address exhaustion mitigation strategies include Network Address Translation (NAT), which allows multiple devices to share single public IP addresses, Carrier-Grade NAT (CGNAT) used by ISPs to extend IPv4 lifetimes, and aggressive reclamation of unused address space. However, these approaches add complexity, impair end-to-end connectivity, and increase costs. IPv6 adoption eliminates these workarounds while providing benefits like simplified address assignment, improved routing efficiency, and built-in security features.

Dual stack configuration represents the most straightforward transition strategy, running IPv4 and IPv6 simultaneously on all network devices. Hosts obtain both IPv4 and IPv6 addresses, communicating via whichever protocol the destination supports. This approach provides maximum compatibility – legacy IPv4-only systems continue functioning while new IPv6 deployments communicate natively. Modern operating systems prefer IPv6 when available, gradually shifting traffic as adoption increases.

Dual stack implementation requires DNS support for both A records (IPv4) and AAAA records (IPv6). When clients query domain names, DNS returns both address types. The client's operating system attempts IPv6 first, falling back to IPv4 if IPv6 fails. This behavior, called "Happy Eyeballs," optimizes user experience by quickly detecting IPv6 connectivity issues and reverting to IPv4 without noticeable delays.

Challenges with dual stack include doubled address management overhead, potential for configuration errors in either protocol, increased security surface requiring parallel firewall rules, and the indefinite timeline for IPv4 retirement. Organizations must maintain expertise in both protocols while ensuring consistent security and operational policies across both address families.

Tunneling methods enable IPv6 connectivity across IPv4-only infrastructure by encapsulating IPv6 packets within IPv4 headers. Several tunneling protocols exist, each suited for different scenarios. 6to4 tunneling uses special IPv6 address prefixes derived from IPv4 addresses, automatically establishing tunnels between dual-stack endpoints across IPv4 networks. This approach requires no manual configuration but depends on public IPv4 addresses and functions only for site-to-site connectivity.

Teredo tunneling enables IPv6 connectivity for hosts behind NAT devices by encapsulating IPv6 packets in IPv4 UDP datagrams. This approach allows IPv6 communication even from private IPv4 addresses, making it popular for consumer broadband networks. However, Teredo introduces additional latency and complexity while presenting security concerns due to its ability to bypass traditional firewall controls.

ISATAP (Intra-Site Automatic Tunnel Addressing Protocol) facilitates IPv6 communication within organizations still operating IPv4 infrastructure. ISATAP treats IPv4 networks as virtual IPv6 links, allowing IPv6-capable hosts to communicate regardless of underlying IPv4 topology. This approach simplifies enterprise IPv6 deployment by leveraging existing infrastructure while administrators upgrade core networking equipment.

Tunneling limitations include performance overhead from additional encapsulation, MTU issues requiring packet fragmentation, troubleshooting complexity when problems occur, and security concerns from traffic traversing unexpected paths. Tunnels should be viewed as temporary transition mechanisms rather than permanent solutions, with migration to native IPv6 as the ultimate goal.

NAT64 translation enables communication between IPv6-only and IPv4-only hosts by translating packets between protocols. NAT64 gateways maintain address mappings, converting IPv6 packets to IPv4 when accessing legacy services and vice versa. This approach allows organizations to deploy IPv6-only networks internally while maintaining connectivity to the IPv4 internet, reducing address management complexity and operational costs.

DNS64 complements NAT64 by synthesizing AAAA records for IPv4-only destinations. When IPv6 clients query domains without AAAA records, DNS64 creates synthetic IPv6 addresses mapping to the NAT64 gateway. This combination allows IPv6-only clients to access any internet resource transparently, accelerating IPv6-only network deployment.

NAT64 limitations include application layer protocol dependencies on IP addresses embedded in payloads, challenges with protocols carrying IP addresses in signaling, IPsec incompatibility requiring workarounds, and potential for central gateway bottlenecks. Careful planning and application testing ensure NAT64 deployments avoid these pitfalls.

Migration planning should assess current infrastructure IPv6 readiness, identify applications requiring updates, develop phased implementation timelines, and train staff on IPv6 concepts and operations. Successful transitions typically begin with dual stack deployment on internet-facing services, gradually extending IPv6 internally while monitoring adoption metrics and addressing issues before eventually deprecating IPv4 when usage falls below economic sustainability thresholds.
    `,
  },
];

// SDN/SD-WAN Features
export const sdnFeatures: TechnologyFeature[] = [
  {
    name: 'Application-aware routing',
    description: 'Routes traffic based on application requirements and performance',
    importance: 'critical',
    examples: [
      'Route video conferencing over low-latency paths',
      'Direct email traffic to cost-effective internet links',
      'Prioritize business-critical applications',
    ],
  },
  {
    name: 'Zero-touch provisioning',
    description: 'Automatic device configuration without manual intervention',
    importance: 'high',
    examples: [
      'New branch router auto-configures from central repository',
      'Reduced deployment time and errors',
      'No on-site IT staff required',
    ],
  },
  {
    name: 'Transport agnostic',
    description: 'Operates over any network transport layer',
    importance: 'high',
    examples: [
      'MPLS, broadband internet, LTE, satellite',
      'Unified management across all transports',
      'Cost optimization through transport diversity',
    ],
  },
  {
    name: 'Central policy management',
    description: 'Unified policy control across entire network',
    importance: 'critical',
    examples: [
      'Define security policies once, enforce everywhere',
      'Rapid policy updates network-wide',
      'Consistent compliance and governance',
    ],
  },
];

// VXLAN Features
export const vxlanFeatures: TechnologyFeature[] = [
  {
    name: 'Data Center Interconnect (DCI)',
    description: 'Seamless Layer 2 connectivity between data centers',
    importance: 'critical',
    examples: [
      'VM migration between data centers',
      'Disaster recovery failover',
      'Geographic distribution with network continuity',
    ],
  },
  {
    name: 'Layer 2 over Layer 3 encapsulation',
    description: 'Ethernet frames transported over IP networks',
    importance: 'high',
    examples: [
      'Overcome Spanning Tree limitations',
      'Leverage existing IP routing',
      'Scalable multi-tenant networks',
    ],
  },
  {
    name: '24-bit VNI addressing',
    description: '16 million logical network segments',
    importance: 'critical',
    examples: [
      'Massive multi-tenant environments',
      'Microsegmentation for security',
      'Overcome 4096 VLAN limit',
    ],
  },
];

// IPv6 Migration Scenarios
export const migrationScenarios: IPv6MigrationScenario[] = [
  {
    id: 'enterprise-basic',
    name: 'Mid-Size Enterprise Migration',
    description: 'Traditional enterprise with on-premises data center and 20 branch offices',
    complexity: 'medium',
    currentState: {
      ipv4Addresses: 5000,
      ipv6Addresses: 0,
      devices: 2500,
      subnets: 150,
      applications: [
        { name: 'Email', ipv6Ready: true, criticality: 'critical', dependsOn: [] },
        { name: 'ERP System', ipv6Ready: false, criticality: 'critical', dependsOn: ['Database'] },
        { name: 'CRM', ipv6Ready: true, criticality: 'high', dependsOn: ['Database'] },
        { name: 'Database', ipv6Ready: false, criticality: 'critical', dependsOn: [] },
        { name: 'Web Portal', ipv6Ready: true, criticality: 'high', dependsOn: [] },
        { name: 'File Sharing', ipv6Ready: true, criticality: 'medium', dependsOn: [] },
      ],
      infrastructure: {
        routers: { total: 25, ipv6Capable: 15 },
        switches: { total: 80, ipv6Capable: 50 },
        firewalls: { total: 5, ipv6Capable: 3 },
        servers: { total: 150, ipv6Capable: 120 },
      },
    },
    targetState: {
      ipv4Addresses: 5000,
      ipv6Addresses: 5000,
      devices: 2500,
      subnets: 150,
      applications: [
        { name: 'Email', ipv6Ready: true, criticality: 'critical', dependsOn: [] },
        { name: 'ERP System', ipv6Ready: true, criticality: 'critical', dependsOn: ['Database'] },
        { name: 'CRM', ipv6Ready: true, criticality: 'high', dependsOn: ['Database'] },
        { name: 'Database', ipv6Ready: true, criticality: 'critical', dependsOn: [] },
        { name: 'Web Portal', ipv6Ready: true, criticality: 'high', dependsOn: [] },
        { name: 'File Sharing', ipv6Ready: true, criticality: 'medium', dependsOn: [] },
      ],
      infrastructure: {
        routers: { total: 25, ipv6Capable: 25 },
        switches: { total: 80, ipv6Capable: 80 },
        firewalls: { total: 5, ipv6Capable: 5 },
        servers: { total: 150, ipv6Capable: 150 },
      },
    },
    constraints: [
      { type: 'budget', description: 'Hardware replacement limited to $200,000', severity: 'high' },
      { type: 'timeline', description: 'Must complete within 18 months', severity: 'medium' },
      {
        type: 'compatibility',
        description: 'ERP system requires vendor upgrade',
        severity: 'high',
      },
      { type: 'expertise', description: 'Limited IPv6 experience in team', severity: 'medium' },
    ],
  },
  {
    id: 'isp-transition',
    name: 'ISP Customer Network Transition',
    description: 'Internet service provider transitioning customer networks to IPv6',
    complexity: 'high',
    currentState: {
      ipv4Addresses: 50000,
      ipv6Addresses: 1000,
      devices: 25000,
      subnets: 500,
      applications: [
        { name: 'Broadband Access', ipv6Ready: true, criticality: 'critical', dependsOn: [] },
        { name: 'IPTV', ipv6Ready: false, criticality: 'high', dependsOn: ['Content Delivery'] },
        { name: 'VoIP', ipv6Ready: true, criticality: 'critical', dependsOn: [] },
        { name: 'Content Delivery', ipv6Ready: false, criticality: 'high', dependsOn: [] },
        { name: 'Email Hosting', ipv6Ready: true, criticality: 'medium', dependsOn: [] },
      ],
      infrastructure: {
        routers: { total: 200, ipv6Capable: 120 },
        switches: { total: 500, ipv6Capable: 300 },
        firewalls: { total: 50, ipv6Capable: 30 },
        servers: { total: 300, ipv6Capable: 200 },
      },
    },
    targetState: {
      ipv4Addresses: 50000,
      ipv6Addresses: 50000,
      devices: 25000,
      subnets: 500,
      applications: [
        { name: 'Broadband Access', ipv6Ready: true, criticality: 'critical', dependsOn: [] },
        { name: 'IPTV', ipv6Ready: true, criticality: 'high', dependsOn: ['Content Delivery'] },
        { name: 'VoIP', ipv6Ready: true, criticality: 'critical', dependsOn: [] },
        { name: 'Content Delivery', ipv6Ready: true, criticality: 'high', dependsOn: [] },
        { name: 'Email Hosting', ipv6Ready: true, criticality: 'medium', dependsOn: [] },
      ],
      infrastructure: {
        routers: { total: 200, ipv6Capable: 200 },
        switches: { total: 500, ipv6Capable: 500 },
        firewalls: { total: 50, ipv6Capable: 50 },
        servers: { total: 300, ipv6Capable: 300 },
      },
    },
    constraints: [
      {
        type: 'budget',
        description: 'Infrastructure investment of $2M approved',
        severity: 'medium',
      },
      { type: 'timeline', description: '3-year migration plan', severity: 'low' },
      { type: 'business', description: 'Cannot disrupt customer service', severity: 'high' },
      { type: 'compatibility', description: 'Legacy CPE devices in field', severity: 'high' },
    ],
  },
];

// IaC Templates and Playbooks
export const iacTemplates: IaCTemplate[] = [
  {
    id: 'router-base-config',
    name: 'Router Base Configuration',
    description: 'Standard router configuration with security hardening',
    category: 'configuration',
    platform: 'ansible',
    difficulty: 'beginner',
    tags: ['router', 'security', 'baseline'],
    parameters: [
      { name: 'hostname', type: 'string', description: 'Router hostname', required: true },
      {
        name: 'management_ip',
        type: 'string',
        description: 'Management interface IP',
        required: true,
      },
      {
        name: 'snmp_community',
        type: 'string',
        description: 'SNMP community string',
        required: false,
        default: 'public',
      },
      { name: 'ntp_servers', type: 'list', description: 'NTP server addresses', required: true },
    ],
    tasks: [
      {
        id: 'task-1',
        name: 'Configure hostname',
        type: 'configure',
        description: 'Set device hostname and domain name',
        order: 1,
        dependencies: [],
        parameters: { hostname: '{{ hostname }}', domain: 'example.com' },
        validation: [
          {
            name: 'Verify hostname',
            type: 'configuration',
            command: 'show running-config | include hostname',
            expectedResult: 'hostname {{ hostname }}',
            timeout: 30,
          },
        ],
      },
      {
        id: 'task-2',
        name: 'Configure management interface',
        type: 'configure',
        description: 'Set management interface IP and enable SSH',
        order: 2,
        dependencies: ['task-1'],
        parameters: {
          interface: 'GigabitEthernet0/0',
          ip: '{{ management_ip }}',
          mask: '255.255.255.0',
        },
        validation: [
          {
            name: 'Verify interface',
            type: 'connectivity',
            command: 'ping {{ management_ip }}',
            expectedResult: 'Success rate is 100 percent',
            timeout: 60,
          },
        ],
      },
      {
        id: 'task-3',
        name: 'Configure NTP',
        type: 'configure',
        description: 'Configure NTP servers for time synchronization',
        order: 3,
        dependencies: ['task-2'],
        parameters: { servers: '{{ ntp_servers }}' },
        validation: [
          {
            name: 'Verify NTP',
            type: 'service',
            command: 'show ntp associations',
            expectedResult: 'configured',
            timeout: 120,
          },
        ],
      },
      {
        id: 'task-4',
        name: 'Apply security hardening',
        type: 'configure',
        description: 'Disable unused services and configure access controls',
        order: 4,
        dependencies: ['task-3'],
        parameters: {
          disable_services: ['http', 'telnet', 'finger'],
          enable_services: ['https', 'ssh'],
        },
        validation: [
          {
            name: 'Verify SSH',
            type: 'service',
            command: 'show ip ssh',
            expectedResult: 'SSH Enabled',
            timeout: 30,
          },
        ],
      },
    ],
  },
  {
    id: 'vlan-deployment',
    name: 'VLAN Configuration Deployment',
    description: 'Deploy VLANs and trunk ports across switch infrastructure',
    category: 'deployment',
    platform: 'ansible',
    difficulty: 'intermediate',
    tags: ['switch', 'vlan', 'layer2'],
    parameters: [
      { name: 'vlans', type: 'list', description: 'List of VLANs to create', required: true },
      { name: 'trunk_ports', type: 'list', description: 'Trunk port interfaces', required: true },
      {
        name: 'native_vlan',
        type: 'number',
        description: 'Native VLAN ID',
        required: false,
        default: 1,
      },
    ],
    tasks: [
      {
        id: 'task-1',
        name: 'Create VLANs',
        type: 'deploy',
        description: 'Create VLAN database entries',
        order: 1,
        dependencies: [],
        parameters: { vlan_list: '{{ vlans }}' },
        validation: [
          {
            name: 'Verify VLANs',
            type: 'configuration',
            command: 'show vlan brief',
            expectedResult: 'active',
            timeout: 30,
          },
        ],
      },
      {
        id: 'task-2',
        name: 'Configure trunk ports',
        type: 'configure',
        description: 'Configure trunk encapsulation and allowed VLANs',
        order: 2,
        dependencies: ['task-1'],
        parameters: {
          ports: '{{ trunk_ports }}',
          encapsulation: '802.1q',
          native: '{{ native_vlan }}',
        },
        validation: [
          {
            name: 'Verify trunks',
            type: 'configuration',
            command: 'show interfaces trunk',
            expectedResult: 'trunking',
            timeout: 30,
          },
        ],
      },
    ],
  },
  {
    id: 'firewall-rules-update',
    name: 'Firewall Rule Updates',
    description: 'Update firewall access control lists and NAT rules',
    category: 'security',
    platform: 'ansible',
    difficulty: 'advanced',
    tags: ['firewall', 'security', 'acl'],
    parameters: [
      { name: 'acl_rules', type: 'list', description: 'Access control list rules', required: true },
      { name: 'nat_rules', type: 'list', description: 'NAT translation rules', required: false },
      {
        name: 'log_level',
        type: 'string',
        description: 'Logging level',
        required: false,
        default: 'informational',
      },
    ],
    tasks: [
      {
        id: 'task-1',
        name: 'Backup current configuration',
        type: 'backup',
        description: 'Create configuration backup before changes',
        order: 1,
        dependencies: [],
        parameters: { destination: '/backups/firewall-{{ ansible_date_time.epoch }}.cfg' },
        validation: [
          {
            name: 'Verify backup',
            type: 'configuration',
            command: 'ls /backups/',
            expectedResult: 'firewall-',
            timeout: 30,
          },
        ],
      },
      {
        id: 'task-2',
        name: 'Apply ACL rules',
        type: 'configure',
        description: 'Update access control lists',
        order: 2,
        dependencies: ['task-1'],
        parameters: { rules: '{{ acl_rules }}', logging: '{{ log_level }}' },
        rollback: {
          id: 'rollback-1',
          name: 'Restore configuration',
          type: 'restore',
          description: 'Restore from backup',
          order: 1,
          dependencies: [],
          parameters: { source: '/backups/firewall-{{ ansible_date_time.epoch }}.cfg' },
          validation: [],
        },
        validation: [
          {
            name: 'Verify ACLs',
            type: 'configuration',
            command: 'show access-list',
            expectedResult: 'extended',
            timeout: 30,
          },
        ],
      },
      {
        id: 'task-3',
        name: 'Test connectivity',
        type: 'validate',
        description: 'Validate network connectivity after rule changes',
        order: 3,
        dependencies: ['task-2'],
        parameters: { test_hosts: ['10.0.0.1', '10.0.0.2'] },
        validation: [
          {
            name: 'Ping test',
            type: 'connectivity',
            command: 'ping {{ item }}',
            expectedResult: 'Success',
            timeout: 60,
          },
        ],
      },
    ],
  },
];

// Sample Playbook
export const samplePlaybooks: Playbook[] = [
  {
    id: 'pb-001',
    name: 'Network Infrastructure Baseline',
    description: 'Deploy baseline configuration to all network devices',
    platform: 'ansible',
    version: '1.2.0',
    createdAt: new Date('2025-10-01'),
    updatedAt: new Date('2025-10-15'),
    tags: ['baseline', 'security', 'compliance'],
    variables: {
      ntp_servers: ['time1.example.com', 'time2.example.com'],
      syslog_server: 'syslog.example.com',
      snmp_community: 'monitoring',
    },
    inventory: [
      {
        name: 'routers',
        hosts: [
          {
            hostname: 'router-hq-01',
            ipAddress: '10.0.1.1',
            platform: 'cisco_ios',
            credentials: 'vault:cisco_creds',
            variables: { role: 'core', location: 'headquarters' },
          },
          {
            hostname: 'router-branch-01',
            ipAddress: '10.1.1.1',
            platform: 'cisco_ios',
            credentials: 'vault:cisco_creds',
            variables: { role: 'edge', location: 'branch-office-1' },
          },
        ],
        variables: { device_type: 'router' },
      },
      {
        name: 'switches',
        hosts: [
          {
            hostname: 'switch-core-01',
            ipAddress: '10.0.2.1',
            platform: 'cisco_ios',
            credentials: 'vault:cisco_creds',
            variables: { role: 'core', location: 'headquarters' },
          },
        ],
        variables: { device_type: 'switch' },
      },
    ],
    tasks: iacTemplates[0].tasks,
    handlers: [
      {
        name: 'save_configuration',
        action: 'ios_command: commands: [write memory]',
        condition: 'on_change',
      },
      {
        name: 'restart_service',
        action: 'service: name=sshd state=restarted',
        condition: 'on_failure',
      },
    ],
  },
];

// Configuration Drift Examples
export const driftExamples: ConfigurationDrift[] = [
  {
    hostId: 'router-hq-01',
    hostname: 'router-hq-01',
    detectedAt: new Date('2025-10-28T10:30:00'),
    severity: 'high',
    autoFixable: true,
    drifts: [
      {
        parameter: 'ntp server',
        expected: 'time1.example.com',
        actual: 'pool.ntp.org',
        category: 'configuration',
        impact: 'Time synchronization using unauthorized server',
        recommendation: 'Restore approved NTP server configuration',
      },
      {
        parameter: 'snmp community',
        expected: 'monitoring',
        actual: 'public',
        category: 'security',
        impact: 'Weak SNMP community string exposes device to unauthorized access',
        recommendation: 'Immediately update to secure community string',
      },
      {
        parameter: 'ssh timeout',
        expected: '300',
        actual: '600',
        category: 'security',
        impact: 'Extended SSH timeout increases attack window',
        recommendation: 'Reduce timeout to policy-compliant value',
      },
    ],
  },
  {
    hostId: 'switch-core-01',
    hostname: 'switch-core-01',
    detectedAt: new Date('2025-10-28T11:15:00'),
    severity: 'medium',
    autoFixable: true,
    drifts: [
      {
        parameter: 'vlan 100',
        expected: 'present',
        actual: 'absent',
        category: 'configuration',
        impact: 'Required VLAN missing, affecting network segmentation',
        recommendation: 'Create VLAN 100 with appropriate configuration',
      },
      {
        parameter: 'port-security maximum',
        expected: '2',
        actual: '10',
        category: 'security',
        impact: 'Excessive MAC addresses allowed, weakening port security',
        recommendation: 'Reduce maximum to policy-compliant value',
      },
    ],
  },
];

export const validationChecks: ValidationCheck[] = [
  {
    name: 'Connectivity Check',
    type: 'connectivity',
    command: 'ping 8.8.8.8',
    expectedResult: 'Success rate is 100 percent',
    timeout: 30,
  },
  {
    name: 'Configuration Validation',
    type: 'configuration',
    command: 'show running-config | include ntp',
    expectedResult: 'ntp server',
    timeout: 15,
  },
  {
    name: 'Service Status',
    type: 'service',
    command: 'show ip ssh',
    expectedResult: 'SSH Enabled - version 2.0',
    timeout: 15,
  },
  {
    name: 'Performance Check',
    type: 'performance',
    command: 'show processes cpu | include five',
    expectedResult: 'five minutes: [0-50]%',
    timeout: 20,
  },
];
