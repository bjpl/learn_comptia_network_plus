# Component 20: IaC Builder - Quick Reference Guide

## Component Overview

**Name:** Infrastructure as Code (IaC) Builder
**File:** `src/components/modern/IaCBuilder.tsx`
**Lines:** 1032
**Status:** Fully Enhanced with 6 Learning Tabs

---

## Quick Navigation

### Tab Overview

| Tab           | Focus                 | Content Type          | Use Case               |
| ------------- | --------------------- | --------------------- | ---------------------- |
| **Concepts**  | Fundamentals          | Theory + Principles   | Learn what IaC is      |
| **Templates** | Pre-built Solutions   | Code Samples          | Quick start examples   |
| **Builder**   | Code Editing          | Interactive Editor    | Write your own configs |
| **Drift**     | Configuration Changes | Detection/Remediation | Manage compliance      |
| **Pipeline**  | Deployment Flow       | Visualization         | Understand CI/CD       |
| **Tools**     | Tool Comparison       | Research + Selection  | Choose right tool      |

---

## Key IaC Concepts

### What is IaC?

Managing infrastructure through machine-readable code files instead of manual configuration.

### Core Principles

1. Version Control Everything
2. Treat Infrastructure Like Code
3. Automate Deployments
4. Detect & Fix Drift
5. Enable Auditability

### Benefits (5 Key)

- **Consistency:** Same config everywhere
- **Speed:** Automated vs manual deployment
- **Reliability:** Fewer human errors
- **Auditability:** Track all changes
- **Scalability:** Easy to replicate

---

## IaC Tools at a Glance

```
ANSIBLE          TERRAFORM         PUPPET            CHEF             SALTSTACK
────────────────────────────────────────────────────────────────────────────────
Imperative       Declarative       Declarative       Hybrid           Hybrid
Agentless (SSH)  No Agent          Agent-based       Agent-based      Agent-based
YAML             HCL               DSL               Ruby             YAML
Network Devices  Cloud Infra       Enterprise        App + Infra      Event-driven

Best for:        Best for:         Best for:         Best for:        Best for:
Network Config   AWS/Azure/GCP     Large-scale       Full Stack       Real-time
Multi-vendor     Infrastructure    Compliance        Automation       Automation
```

### Quick Selection Criteria

- **Network devices?** → Ansible
- **Cloud infrastructure?** → Terraform
- **Enterprise scale?** → Puppet
- **Event-driven?** → SaltStack
- **Full stack?** → Chef

---

## Configuration Drift

### What is It?

The difference between your desired infrastructure state and what's actually running.

```
Desired State (IaC Code)
         ↓
      [DRIFT]  ← Unauthorized changes
         ↓
Actual State (Live System)
```

### Common Causes

- Manual configuration changes
- Security patches applied
- Accidental deletions
- Service updates
- Compliance violations

### Drift Detection Methods

1. **Periodic Scanning** - Check at intervals
2. **Real-time Monitoring** - Continuous tracking
3. **Event-based** - React to changes
4. **Compliance Audits** - Regular reviews

### Remediation Strategies

1. **Auto-fix** - Automatically correct
2. **Alert & Manual** - Notify operator
3. **Quarantine** - Isolate affected resource
4. **Review & Approve** - Human validation

---

## Ansible Example (Network Device)

```yaml
---
- name: Configure Router
  hosts: routers
  gather_facts: no

  vars:
    ntp_servers:
      - time1.example.com
      - time2.example.com

  tasks:
    - name: Set hostname
      cisco.ios.ios_config:
        lines:
          - hostname router-01

    - name: Configure NTP
      cisco.ios.ios_config:
        lines:
          - 'ntp server {{ item }}'
      loop: '{{ ntp_servers }}'

    - name: Save config
      cisco.ios.ios_config:
        save_when: changed
```

---

## Terraform Example (Infrastructure)

```hcl
variable "instance_count" {
  type        = number
  default     = 2
}

resource "aws_instance" "web" {
  count           = var.instance_count
  ami             = "ami-0c55b159cbfafe1f0"
  instance_type   = "t2.micro"

  tags = {
    Name = "web-server-${count.index + 1}"
  }
}

output "instance_ips" {
  value = aws_instance.web[*].public_ip
}
```

---

## CI/CD Pipeline Stages

```
VALIDATE          TEST              DEPLOY (STAGING)   VERIFY            DEPLOY (PROD)
    │               │                    │                 │                  │
    ├─ Syntax        ├─ Unit tests        ├─ Deploy         ├─ Connectivity    ├─ Final Deploy
    ├─ Schema        ├─ Integration       ├─ Config         ├─ Validation      ├─ Smoke tests
    └─ Linting       └─ Security          └─ Services       └─ Health checks   └─ Monitoring
```

### Key Checks at Each Stage

1. **Validate** - Syntax/schema correctness
2. **Test** - Unit & integration tests
3. **Deploy Staging** - Deploy to test environment
4. **Verify** - Connectivity & validation checks
5. **Deploy Prod** - Production deployment

---

## Version Control Workflow

### Standard Git Flow for IaC

```
main (production)
  ↓
  ├── feature/add-router-config
  │   ├── Commit: Add router template
  │   ├── Commit: Add validation checks
  │   └── Create Pull Request
  │       ├── Code review
  │       ├── Approval
  │       └── Merge
  └── Updated main
```

### Repository Structure

```
network-iac/
├── ansible/
│   ├── playbooks/         # Main playbooks
│   ├── roles/             # Reusable roles
│   ├── inventory/         # Host definitions
│   └── group_vars/        # Variable files
├── terraform/
│   ├── aws/               # AWS resources
│   ├── azure/             # Azure resources
│   └── modules/           # Reusable modules
├── tests/                 # Test files
├── docs/                  # Documentation
└── README.md
```

---

## Network+ Exam Focus Areas

### Topics Covered

1. **IaC Benefits**
   - Consistency
   - Repeatability
   - Version control
   - Reduced errors

2. **Tool Knowledge**
   - Ansible characteristics
   - Terraform capabilities
   - Puppet features
   - Differences between tools

3. **Configuration Management**
   - Playbooks
   - Templates
   - Variables
   - Handlers

4. **Drift Management**
   - Detection methods
   - Severity levels
   - Remediation
   - Compliance

5. **CI/CD Integration**
   - Pipeline stages
   - Automated testing
   - Deployment strategies
   - Rollback procedures

### Common Exam Questions

**Q1: What is the primary advantage of Ansible over Puppet?**

- A) Uses declarative syntax
- B) Agent-based architecture
- C) Agentless and uses SSH
- D) Better for cloud resources

**A1: C** - Ansible is agentless

**Q2: Configuration drift is best detected through:**

- A) Manual inspection
- B) Automated monitoring
- C) Annual audits
- D) Device logs only

**A2: B** - Automated monitoring enables detection

**Q3: In a CI/CD pipeline, which stage comes first?**

- A) Deploy to production
- B) Test
- C) Validate
- D) Verify

**A3: C** - Validation of syntax/schema first

---

## Best Practices Checklist

### Planning Phase

- [ ] Identify infrastructure to automate
- [ ] Choose appropriate tool
- [ ] Design repository structure
- [ ] Plan version control workflow

### Implementation Phase

- [ ] Version control all IaC code
- [ ] Write reusable templates/modules
- [ ] Implement code validation
- [ ] Create comprehensive tests
- [ ] Document all configurations

### Deployment Phase

- [ ] Test in non-production first
- [ ] Implement approval workflows
- [ ] Enable detailed logging
- [ ] Plan rollback procedures
- [ ] Monitor for drift

### Maintenance Phase

- [ ] Regular drift detection
- [ ] Update templates as needed
- [ ] Review and optimize code
- [ ] Train team members
- [ ] Document lessons learned

---

## Study Tips for Network+ Exam

1. **Memorize Tool Differences**
   - Know which tools are agentless
   - Understand declarative vs imperative
   - Know best use cases

2. **Understand Drift Concept**
   - What it is and why it matters
   - How to detect it
   - How to remediate it

3. **Know Pipeline Stages**
   - Order of stages
   - What happens at each stage
   - Why each stage is important

4. **Practice Scenarios**
   - "Which tool would you use for..."
   - "How would you detect..."
   - "What's the best way to..."

5. **Review Real Examples**
   - Study the templates in Component 20
   - Understand the YAML/HCL syntax
   - See how validation works

---

## Key Takeaways

1. **IaC = Code for Infrastructure**
   - Version control it
   - Treat it like application code
   - Automate everything

2. **Choose Tool Based on Needs**
   - Network devices? Ansible
   - Cloud? Terraform
   - Enterprise? Puppet

3. **Drift is Your Enemy**
   - Monitor continuously
   - Fix quickly
   - Prevent changes outside IaC

4. **CI/CD Automates Deployment**
   - Reduces errors
   - Speeds up deployment
   - Provides consistency

5. **Version Control is Essential**
   - Track all changes
   - Enable collaboration
   - Allow rollback

---

## Component Features Summary

### User Interface

- 6 well-organized tabs
- Color-coded for easy scanning
- Responsive design (mobile/tablet/desktop)
- Interactive code editor
- Real-time validation

### Educational Value

- Comprehensive IaC fundamentals
- Practical tool comparisons
- Real-world examples
- Version control guidance
- Exam-focused content

### Practical Tools

- Pre-built templates
- Code generator
- Syntax validator
- Drift examples
- Pipeline visualizer
- Tool selector guide

---

## File Locations

| Item               | Location                                        |
| ------------------ | ----------------------------------------------- |
| Component          | `src/components/modern/IaCBuilder.tsx`          |
| Type Definitions   | `src/components/modern/modern-types.ts`         |
| Sample Data        | `src/components/modern/modern-data.ts`          |
| Full Documentation | `docs/enhancements/COMPONENT_20_IAC_BUILDER.md` |
| This Guide         | `docs/COMPONENT_20_QUICK_REFERENCE.md`          |

---

## Next Steps

1. **Explore Each Tab** - Start with Concepts, move through each tab
2. **Study Tool Comparisons** - Review the Tools tab thoroughly
3. **Review Examples** - Examine templates and code samples
4. **Understand Drift** - Master drift detection and remediation
5. **Learn Pipeline Concepts** - Understand CI/CD stages
6. **Practice Questions** - Test knowledge with exam scenarios
7. **Build Custom Configs** - Use Builder tab to create your own

---

## Quick Links in Component

- **Concepts Tab** - IaC fundamentals and principles
- **Templates Tab** - Pre-built configuration templates
- **Builder Tab** - Interactive code editor (YAML/JSON/HCL)
- **Drift Tab** - Configuration drift examples and detection
- **Pipeline Tab** - CI/CD pipeline visualization
- **Tools Tab** - Comprehensive tool comparison and selection guide

---

## Troubleshooting

**Issue: Code validation failing**

- Check YAML starts with `---`
- Validate JSON syntax separately
- Review validation checks panel

**Issue: Don't understand drift**

- Review Drift tab examples
- Compare Expected vs Actual values
- Study remediation recommendations

**Issue: Confused which tool to use**

- Go to Tools tab
- Review comparison table
- Use selection criteria guide

**Issue: Don't understand pipeline**

- Review pipeline visualization
- Study each stage purpose
- Compare with real CI/CD tools

---

_Last Updated: 2025-11-01_
_Component Status: Enhanced & Complete_
_Exam Alignment: CompTIA Network+ N10-008_
