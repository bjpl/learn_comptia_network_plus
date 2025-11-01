# Network Simulator - Quick Start Guide

## Getting Started in 5 Minutes

### 1. Load the Component

```typescript
import NetworkSimulator from '@/components/appliances/NetworkSimulator';

function App() {
  return <NetworkSimulator />;
}
```

### 2. Understanding the Interface

```
┌─────────────────────────────────────────────────────────────────┐
│  Network Architecture Simulator                                  │
├──────────────────────────────────────────────────────────────────┤
│ [Router] [Switch] [Firewall] [Load Bal] [Wireless]  ▶ ⏸ 🔄 📋 💾 📤 │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│                  Interactive Canvas                             │
│                                                                  │
│         🔵 Router          [🔗] [⚙] [×]                        │
│            ▔▔▔▔▔▔           └─Connection button                │
│                               └─Config button                   │
│                                └─Delete button                  │
│                                                                  │
│                  🔵 Switch                                       │
│                  ▔▔▔▔▔▔▔  ╱─────╲                               │
│                         ╱         ╲ Connection line (animated)  │
│                        ╱           ╲                            │
│                      🔵 Firewall    Bandwidth label            │
│                      ▔▔▔▔▔▔▔▔                                   │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│ Simulation Stats │ Device Details │ Alerts                       │
│ Time: 0s         │ Select device  │ No alerts                    │
│ Devices: 3       │ to view info    │                             │
│ Connections: 2   │                │                             │
│ Active: 0        │                │                             │
└──────────────────────────────────────────────────────────────────┘
```

### 3. Basic Workflow

#### Step A: Add Devices

```
Click [Router] button
→ Router appears on canvas with random position

Click [Switch] button (3 times)
→ Three switches added below router

Click [Firewall] button
→ Firewall added to canvas
```

#### Step B: Arrange Devices

```
Click and drag Router
→ Move to top center of canvas

Click and drag each Switch
→ Arrange in row below router

Click and drag Firewall
→ Position below switches
```

#### Step C: Create Connections

```
Click 🔗 on Router (turns green with green ring)
Click on Switch 1
→ Connection created automatically

Repeat for Switch 2 and Switch 3
→ All switches connected to router
```

#### Step D: Configure Devices

```
Click ⚙ on Router
→ Configuration panel opens:
  - Change name: "Core Router"
  - Throughput: "500 Mbps"
  - Max Connections: 5000
  - Enable Redundancy: checked
Click Update
```

#### Step E: Run Simulation

```
Click ▶ Start Simulation
→ Traffic begins flowing
→ Device loads update
→ Connections animate
→ Alerts appear on overload

Click ⏸ Pause
→ Simulation pauses
```

### 4. Loading Pre-Built Scenarios

```
Click 📋 Scenarios
→ Panel opens showing 3 scenarios:

SCENARIO 1: Network Bottleneck
  Description: Identify single point of failure
  Issue: Main router connects 3 switches (bottleneck)
  Hint: Add backup router with redundancy
  [Load] button

SCENARIO 2: Overloaded Device
  Description: Handle excessive traffic
  Issue: Core router at 85%, web server at 90%
  Hint: Upgrade throughput or add load balancer
  [Load] button

SCENARIO 3: Redundancy Setup
  Description: Design resilient architecture
  Issue: Two firewalls with no single point of failure
  Hint: This is recommended HA architecture
  [Load] button

Click [Load] on any scenario
→ Network loaded to canvas
→ Original network replaced
```

### 5. Saving Your Design

```
Click 💾 Save/Load
→ Panel opens:

SAVE CURRENT DESIGN:
[Enter network name...] [Save]

Example:
[My Lab Network] [Save]
→ Network saved with timestamp

SAVED DESIGNS:
Lab Network A
  Saved: 2024-11-01 10:30:00
  [Load] [Delete]

Lab Network B
  Saved: 2024-11-01 10:45:00
  [Load] [Delete]
```

### 6. Exporting Your Design

```
Click 📤 Export
→ JSON file downloads: network-design-1730451000000.json

File contains:
{
  "devices": [
    {
      "id": "router-1",
      "name": "Core Router",
      "type": "router",
      "position": { "x": 250, "y": 100 },
      "specs": { "throughput": "500 Mbps", ... }
    }
  ],
  "connections": [
    {
      "id": "conn-1",
      "sourceId": "router-1",
      "targetId": "switch-1",
      "bandwidth": "1 Gbps"
    }
  ],
  "timestamp": "2024-11-01T10:30:00.000Z"
}
```

## Common Tasks

### Task: Design a Simple Branch Office Network

```
1. Add 1 Router (gateway)
2. Add 2 Switches (user segments)
3. Add 1 Firewall (security)

Configure Router:
- Name: "Branch Gateway"
- Throughput: "100 Mbps"
- Max Connections: 1000

Connect Router → Switch 1
Connect Router → Switch 2
Connect Router → Firewall

Save as "Branch Office Design"
```

### Task: Build a High-Availability Core

```
1. Add 2 Firewalls (primary & backup)
2. Add 1 Load Balancer
3. Add 1 Switch (distribution)

Configure both Firewalls:
- Redundancy: ENABLED
- Throughput: "500 Mbps"
- Max Connections: 5000

Connect:
  Firewall 1 → Switch
  Firewall 2 → Switch
  Load Balancer → Switch

Save as "HA Core"

Load Scenario 3 to compare with recommended design
```

### Task: Identify Network Bottleneck

```
Load Scenario 1: Network Bottleneck

Observe:
- Single router connects 3 switches
- All traffic flows through one device
- Indicates single point of failure

Run simulation:
- Watch traffic animation
- Note router becomes red at high load
- Alert shows overload condition

Fix:
- Add second router (for redundancy)
- Connect switches to both routers
- Enable redundancy on both routers

Save as "Bottleneck Fixed"
```

## Keyboard & Mouse Controls

| Action           | Control                     |
| ---------------- | --------------------------- |
| Add device       | Click device type button    |
| Select device    | Click on device             |
| Move device      | Click and drag              |
| Connect devices  | Click 🔗, then click target |
| Configure device | Click ⚙ on device          |
| Delete device    | Click × on device           |
| Start simulation | Click ▶ Start button       |
| Pause simulation | Click ⏸ Pause button       |
| Reset simulation | Click 🔄 Reset button       |
| View scenarios   | Click 📋 Scenarios button   |
| Save network     | Click 💾 Save/Load button   |
| Export design    | Click 📤 Export button      |

## Status Color Reference

| Color  | Meaning                     |
| ------ | --------------------------- |
| Green  | Device active, normal load  |
| Yellow | Device warning, load 70-89% |
| Red    | Device error, load 90-100%  |
| Gray   | Device inactive             |

## Alert Types

| Type     | Color  | Meaning                     |
| -------- | ------ | --------------------------- |
| Critical | Red    | Device load >90%, urgent    |
| Warning  | Yellow | Device load 70-89%, monitor |
| Info     | Blue   | General information         |

## Tips & Tricks

1. **Organize Spatially**
   - Keep routers at top
   - Arrange switches below
   - Place firewalls on sides
   - Makes topology clearer

2. **Use Meaningful Names**
   - "Core Router" not "Router 1"
   - "Branch Firewall" not "Firewall 2"
   - Helps when exporting

3. **Test Different Topologies**
   - Load Scenario 1 → Fix it
   - Load Scenario 2 → Optimize it
   - Load Scenario 3 → Learn from it

4. **Save Before Experimenting**
   - Save current design
   - Make changes
   - If wrong, load previous version

5. **Export for Backup**
   - Regular exports to JSON
   - Can import later if needed
   - Good for documentation

6. **Run Simulation to Validate**
   - Always run simulation
   - Check for alerts
   - Verify no bottlenecks

7. **Compare Designs**
   - Load reference scenario
   - Note device positioning
   - Compare to your design
   - Learn best practices

## Troubleshooting

**Q: Connection won't appear**
A: Make sure you clicked 🔗 on source device and target device exists. Click 🔗 again to reset.

**Q: Device won't drag**
A: Check if simulation is running. Stop simulation first with ⏸ Pause.

**Q: Simulation not showing traffic**
A: Ensure devices are connected. At least 2 devices with 1 connection needed for traffic.

**Q: Saved design disappeared**
A: Check browser storage not full. Try exporting designs to JSON for backup.

**Q: Configuration changes not applying**
A: Click "Update" button to confirm changes. Don't click "Cancel".

## Learning Path

### Beginner (10 minutes)

1. Add 3 devices (router, 2 switches)
2. Create 2 connections
3. Run simulation, observe behavior
4. Save design

### Intermediate (20 minutes)

1. Add 5 devices (router, switches, firewall, load balancer)
2. Create 4+ connections
3. Configure each device
4. Run simulation, resolve alerts
5. Export design

### Advanced (30+ minutes)

1. Load Scenario 1 → Fix bottleneck
2. Load Scenario 2 → Optimize overload
3. Load Scenario 3 → Understand HA design
4. Design your own HA network
5. Compare multiple designs
6. Document differences

## Next Steps

- Read full documentation: `COMPONENT_07_NETWORK_SIMULATOR.md`
- Review code: `src/components/appliances/NetworkSimulator.tsx`
- Try scenarios: Use 📋 Scenarios button
- Export designs: Use 📤 Export button
- Share learnings: Save important designs

## Performance Notes

- Handles 20+ devices smoothly
- 50+ connections supported
- Simulation updates every 1 second
- Real-time canvas rendering
- Optimized pathfinding with BFS

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

**Tip**: Start with one of the pre-built scenarios to understand how the component works, then design your own networks!
