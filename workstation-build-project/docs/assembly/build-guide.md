# 4x RTX 4090 Workstation - Complete Assembly Guide

## Table of Contents

1. [Pre-Assembly Preparation](#pre-assembly-preparation)
2. [Installation Sequence](#installation-sequence)
3. [Dual PSU Setup](#dual-psu-setup)
4. [GPU Installation](#gpu-installation)
5. [BIOS Configuration](#bios-configuration)
6. [POST Troubleshooting](#post-troubleshooting)
7. [Testing Protocols](#testing-protocols)
8. [Final QA Checklist](#final-qa-checklist)

---

## Pre-Assembly Preparation

### Required Tools & Equipment

#### Essential Tools

- **Phillips head screwdriver** (magnetic tip recommended)
- **Anti-static wrist strap** (critical for this build)
- **Needle-nose pliers** (for standoffs and cable management)
- **Cable ties/Velcro straps** (minimum 50 pieces)
- **Thermal paste** (Thermal Grizzly Kryonaut included)
- **Flashlight or headlamp** (for interior visibility)
- **Wire cutters/strippers** (for cable management)

#### Recommended Tools

- **Electric screwdriver** with torque control (for standoffs)
- **PSU tester** (for dual PSU verification)
- **Multimeter** (for voltage verification)
- **Label maker** (for cable identification)
- **Digital camera/phone** (document each step)

### ESD Protection Protocol

> **CRITICAL WARNING**: This build contains $17,000+ in components. ESD damage may not be immediately apparent but can cause intermittent failures.

#### ESD Safety Requirements

1. **Grounded Work Surface**
   - Use ESD mat connected to ground
   - Alternative: Build on cardboard on concrete floor
   - NEVER work on carpet or synthetic surfaces

2. **Personal Grounding**
   - Wear anti-static wrist strap connected to:
     - Case chassis (once installed in case)
     - Ground point on ESD mat
     - Grounded metal object (unpainted)
   - Touch grounded metal frequently
   - Remove synthetic clothing (fleece, polyester)

3. **Component Handling**
   - Handle PCBs by edges only
   - Never touch gold contacts or circuits
   - Keep components in anti-static bags until installation
   - Avoid touching GPU backplates (can transfer charge)

4. **Environmental Conditions**
   - Humidity: 40-60% relative humidity (use humidifier if dry)
   - Temperature: 65-75°F (avoid rapid temperature changes)
   - Avoid working during thunderstorms (power fluctuations)

### Workspace Preparation

#### Workspace Requirements

- **Space**: Minimum 6' x 4' clear surface
- **Lighting**: Bright overhead + task lighting
- **Power**: Multiple grounded outlets (test with outlet tester)
- **Ventilation**: Well-ventilated area for thermal paste odors

#### Component Layout Strategy

```
[Workspace Layout]

Left Side:                Center:              Right Side:
- Motherboard box        - Case               - PSU boxes
- CPU box                - Work area          - GPU boxes (stacked)
- Memory modules         - Tools              - Storage drives
- Cooler box             - Documentation      - Cables/accessories

Keep frequently accessed items central
```

### Pre-Assembly Checklist

#### Inventory Verification

- [ ] **CPU**: AMD Threadripper PRO 7975WX (verify seal unbroken)
- [ ] **Motherboard**: ASUS Pro WS WRX90E-SAGE SE (check for shipping damage)
- [ ] **Memory**: 8x 64GB DDR5-5600 ECC modules (all same lot number preferred)
- [ ] **GPUs**: 4x RTX 4090 24GB (verify serial numbers, photograph)
- [ ] **Primary PSU**: EVGA SuperNOVA 1600 T2 (test before installation)
- [ ] **Secondary PSU**: EVGA SuperNOVA 1000 T2 (test before installation)
- [ ] **Add2PSU Adapter**: Dual PSU synchronization cable
- [ ] **Storage**: 1x 2TB 990 PRO + 2x 4TB Crucial T705
- [ ] **Case**: Phanteks Enthoo Pro 2 Server Edition
- [ ] **Fans**: 6x Noctua iPPC-3000 PWM 140mm
- [ ] **Thermal Paste**: Thermal Grizzly Kryonaut
- [ ] **Network Card**: Mellanox ConnectX-4 Lx 25GbE
- [ ] **KVM**: PiKVM v4

#### Documentation Review

- [ ] Read motherboard manual (especially PCIe lane allocation)
- [ ] Review GPU installation requirements (slot spacing)
- [ ] Study dual PSU wiring diagram
- [ ] Bookmark BIOS update procedure
- [ ] Have thermal paste application guide ready

#### Safety Verification

- [ ] ESD wrist strap tested (use multimeter to verify continuity)
- [ ] Workspace humidity checked (40-60% RH)
- [ ] Power outlets tested (ground pin continuity)
- [ ] Fire extinguisher accessible (Class C rated)
- [ ] First aid kit nearby

---

## Installation Sequence

> **ASSEMBLY PHILOSOPHY**: Install components in order of difficulty and dependency. Test at each major milestone.

### Phase 1: Case Preparation (30 minutes)

#### Step 1.1: Case Unboxing & Inspection

1. Remove case from packaging carefully
2. Inspect for shipping damage (photograph any issues)
3. Remove all panels (both side panels, top, front)
4. Remove all pre-installed standoffs and screws
5. Verify all included accessories:
   - Standoffs (should have 10+ for E-ATX)
   - Screws (M3, 6-32 thread types)
   - Cable ties
   - Manual

#### Step 1.2: Install I/O Shield

1. Locate motherboard I/O shield in motherboard box
2. Align with rear case opening
3. Press firmly from inside until all edges click
4. Verify no bent tabs protruding inward (will short motherboard)

#### Step 1.3: Install Motherboard Standoffs

```
Standoff Pattern for E-ATX:
○ = Required standoff (9 minimum)
● = Optional/recommended (use all available)

Top: ○     ○     ○
Mid: ○     ○     ○
Bot: ○     ○     ○

Install standoffs for ALL available holes
```

1. Identify E-ATX mounting holes in case
2. Hand-tighten standoffs (use needle-nose pliers for final 1/4 turn)
3. **CRITICAL**: Verify no extra standoffs under motherboard (causes shorts)
4. Count standoffs: Should have 9-12 installed

#### Step 1.4: Pre-Install Case Fans

**Fan Configuration for Optimal Airflow:**

```
[Top View]
    EXHAUST ↑↑
Front→ GPU GPU GPU GPU →Rear
    INTAKE ↑↑↑

Front: 3x 140mm intake (bottom to top)
Top: 2x 140mm exhaust (front to back)
Rear: 1x 140mm exhaust
```

1. **Front Intake** (3x Noctua iPPC-3000):
   - Mount bottom to top for progressive cooling
   - Airflow direction: Front → Interior
   - Connect to CHA_FAN1, CHA_FAN2, CHA_FAN3 headers

2. **Top Exhaust** (2x Noctua iPPC-3000):
   - Position over GPU area
   - Airflow direction: Interior → Top
   - Connect to CHA_FAN4, CHA_FAN5 headers

3. **Rear Exhaust** (1x Noctua iPPC-3000):
   - Standard ATX position
   - Airflow direction: Interior → Rear
   - Connect to CHA_FAN6 header

**Fan Cable Management**:

- Route cables behind motherboard tray
- Leave 6" slack for motherboard installation
- Label each cable with position (F1, F2, F3, T1, T2, R1)

### Phase 2: Motherboard Assembly (Outside Case) (45 minutes)

> **WHY OUTSIDE CASE**: CPU and RAM installation requires significant force. Working on stable surface prevents motherboard flex.

#### Step 2.1: Motherboard Preparation

1. Place motherboard box on stable surface
2. Open anti-static bag (do not remove motherboard yet)
3. Ground yourself to ESD mat
4. Remove motherboard, place on anti-static bag on box
5. Verify no bent pins in CPU socket (use magnifying glass)

#### Step 2.2: CPU Installation (Threadripper PRO 7975WX)

> **WARNING**: Threadripper CPUs are LARGE and HEAVY. Dropping can damage pins or substrate.

**Pre-Installation**:

1. Identify CPU socket (sTR5, large square in center)
2. Locate socket release lever (usually right side)
3. Locate CPU alignment triangle (bottom-left corner)
4. Review CPU installation diagram in manual

**Installation Procedure**:

```
Socket Lever Positions:
[Closed] ← Load → [Open]
   |                 |
   Ready          Ready to
   to use        install CPU
```

1. **Open Socket**:
   - Release retention bracket lever (push down, pull out)
   - Lift bracket completely vertical (90°)
   - Remove protective cover (keep for RMA purposes)

2. **CPU Placement**:
   - Remove CPU from packaging (handle by edges only)
   - Locate alignment triangle on CPU (bottom-left corner)
   - Align triangle on CPU with triangle on socket
   - **DO NOT FORCE** - CPU should drop into place with gravity
   - Verify CPU is fully seated (should be level, no gaps)

3. **Secure CPU**:
   - Lower retention bracket (should contact CPU IHS)
   - Push retention lever down and under clip
   - **Expect resistance** - this is normal (requires ~5-10 lbs force)
   - Lever should lock flush with socket

4. **Verification**:
   - Visually inspect all sides (CPU should be level)
   - Gentle press on CPU IHS (should not move)
   - Check for any bent pins visible around edges (use flashlight)

**CHECKPOINT**: CPU installed and secured. Take photograph for documentation.

#### Step 2.3: Thermal Paste Application

> **CRITICAL**: Threadripper has LARGE IHS (Integrated Heat Spreader). Standard application methods insufficient.

**Thermal Grizzly Kryonaut Application for Threadripper**:

```
Method: Modified X-Pattern

     [CPU IHS - Top View]
      _______________
     |  \    X    /  |
     |   \   |   /   |
     | ---\ | /---  |
     |     \|/      |
     |     /|\      |
     | ---/ | \---  |
     |   /   |   \   |
     |  /    X    \  |
     |_______________|

Apply 5 lines:
- Diagonal 1 (corner to corner)
- Diagonal 2 (corner to corner)
- Vertical center
- Horizontal center
- Small dot in center
```

**Application Steps**:

1. Clean CPU IHS with isopropyl alcohol 99% (let dry 2 minutes)
2. Apply thermal paste in pattern above
3. Each line: ~2mm wide, ~1mm thick
4. Total paste: ~0.3-0.5g (pea-sized per line)
5. **DO NOT SPREAD** - cooler mounting pressure will spread

**Common Mistakes to Avoid**:

- ❌ Too little paste (Threadripper coverage critical)
- ❌ Too much paste (can spill onto socket)
- ❌ Pre-spreading paste (traps air bubbles)
- ❌ Using old/dried paste (reduce thermal performance)

#### Step 2.4: CPU Cooler Installation

> **NOTE**: Assuming air cooler. If using custom water loop, follow manufacturer instructions.

**Threadripper Cooler Mounting (TR4/sTR5 Socket)**:

1. **Install Mounting Brackets**:
   - Attach mounting brackets to motherboard (usually 4 screws per side)
   - Torque evenly: Tighten each screw 2-3 turns, then move to opposite corner
   - Final torque: Firm but not over-tight (no motherboard flex)

2. **Cooler Installation**:
   - Lower cooler onto CPU (align with mounting holes)
   - Start all mounting screws finger-tight
   - Tighten in STAR pattern (opposite corners): ¼ turn each
   - Final torque: Firm contact, no excessive pressure
   - **VERIFY**: Cooler should not rock/move when touched

3. **Fan Connection**:
   - Connect cooler fan(s) to CPU_FAN header
   - Route cable neatly (avoid blocking other components)

**CHECKPOINT**: CPU and cooler installed. Verify cooler mounting before proceeding.

#### Step 2.5: Memory Installation (8x 64GB DDR5 ECC)

> **IMPORTANT**: Threadripper PRO has 8 memory channels. All 8 DIMMs must be installed for maximum performance.

**Memory Channel Layout (Consult Manual for Exact Slots)**:

```
Typical 8-Channel Layout (A-H):
[CPU Socket]
A1 B1 C1 D1 | E1 F1 G1 H1
A2 B2 C2 D2 | E2 F2 G2 H2

Install in: A1, B1, C1, D1, E1, F1, G1, H1 (closest to CPU)
OR all *1 slots, then all *2 slots if using 16 DIMMs
```

**Installation Procedure (Repeat for Each DIMM)**:

1. **Prepare Slot**:
   - Open DIMM slot clips (push outward)
   - Verify slot is clean (no dust/debris)

2. **DIMM Alignment**:
   - Match notch in DIMM with key in slot
   - Hold DIMM by edges (avoid touching gold contacts)

3. **Installation**:
   - Align DIMM vertically over slot
   - Press down firmly and evenly on both ends
   - **Expect firm resistance** - requires 20-30 lbs force
   - Clips should automatically close and lock DIMM

4. **Verification**:
   - DIMM should be fully seated (gold contacts not visible)
   - Both clips locked (visual + audible click)
   - DIMM perpendicular to motherboard (not tilted)

**Installation Order for 8 DIMMs**:

1. Install DIMMs in pairs (A1+E1, B1+F1, etc.) for balanced load
2. Alternate sides of CPU socket for even pressure
3. Verify all 8 installed before proceeding

**CHECKPOINT**: All 8x 64GB DIMMs installed. Total: 512GB DDR5-5600 ECC.

### Phase 3: Motherboard Installation in Case (20 minutes)

#### Step 3.1: Pre-Installation Prep

1. Verify I/O shield installed and aligned
2. Count motherboard standoffs (should match your earlier count)
3. Prepare motherboard screws (usually 6-32 thread, 9-12 needed)
4. Ground yourself (touch case or wear wrist strap)

#### Step 3.2: Motherboard Placement

> **TIP**: This is a 2-person job. Motherboard + CPU + cooler + RAM = 15+ lbs.

1. **Lift Motherboard**:
   - One person supports CPU cooler
   - Other person holds motherboard edges
   - Avoid stress on cooler mounting

2. **Alignment**:
   - Slide motherboard toward I/O shield at 30° angle
   - Align I/O ports with I/O shield cutouts
   - Lower motherboard onto standoffs
   - **CRITICAL**: Verify ALL screw holes align with standoffs

3. **Securing Motherboard**:
   - Start all screws finger-tight (prevents misalignment)
   - Tighten in STAR pattern (opposite corners)
   - Final torque: Snug but not over-tight
   - **DO NOT over-torque** - can crack motherboard

**Screw Tightening Pattern**:

```
1     5     9
  3     7
    [CPU]
  4     8
2     6    10
```

#### Step 3.3: Post-Installation Verification

- [ ] Motherboard flat against standoffs (no gaps)
- [ ] No standoffs under motherboard without screws (short risk)
- [ ] I/O ports accessible through I/O shield
- [ ] No bent I/O shield tabs touching connectors
- [ ] Motherboard secure (no flex when pressed gently)

---

## Dual PSU Setup

> **CRITICAL SECTION**: Improper dual PSU setup can damage components or cause fire. Follow exactly.

### Understanding Dual PSU Requirements

**Why Dual PSU?**

- 4x RTX 4090 = 1800W GPU power alone
- Threadripper PRO = 280W TDP
- Total system power: ~2400W peak
- Single consumer PSUs max out at 1600-2000W

**Power Distribution Strategy**:

```
Primary PSU (1600W):          Secondary PSU (1000W):
- Motherboard 24-pin          - GPU 3 (12VHPWR)
- CPU 8-pin x2                - GPU 4 (12VHPWR)
- GPU 1 (12VHPWR)
- GPU 2 (12VHPWR)
- Storage drives
- Case fans
- Peripherals

Total: ~1400W peak            Total: ~900W peak
Load: 87% (safe)              Load: 90% (safe)
```

### Phase 4: PSU Installation (40 minutes)

#### Step 4.1: Primary PSU Installation (EVGA 1600 T2)

**Location**: Standard ATX PSU position (bottom of case)

1. **Case Preparation**:
   - Remove PSU mounting bracket (if present)
   - Install PSU fan filter (if case provides)
   - Identify cable routing holes

2. **PSU Orientation**:
   - Fan facing DOWN (draws cool air from outside)
   - Exception: If case on carpet, fan facing UP (into case)
   - Power switch facing rear I/O

3. **PSU Installation**:
   - Slide PSU into case (align with mounting holes)
   - Install 4 PSU mounting screws (hand-tight, then ½ turn)
   - Verify PSU secure (no movement when shaken)

4. **Cable Preparation**:
   - Identify needed cables:
     - 1x 24-pin ATX (motherboard main power)
     - 2x 8-pin EPS (CPU power)
     - 2x 12VHPWR or 4x 8-pin PCIe (GPU 1 & 2)
     - 3x SATA power (storage drives)
     - 1x 4-pin Molex (fan hub, if needed)
   - Keep cables in bag until routing

#### Step 4.2: Secondary PSU Installation (EVGA 1000 T2)

**Location**: Upper PSU mount (case-dependent) OR 5.25" bay adapter

**Option A: Dedicated Secondary PSU Mount**:

1. Install secondary PSU in upper chamber
2. Mount with fan facing interior (shares case airflow)
3. Secure with mounting screws

**Option B: 5.25" Bay Adapter** (Phanteks Enthoo Pro 2):

1. Install PSU in bay adapter bracket
2. Mount bracket in top 5.25" bays
3. Secure with bay clips or screws

**Cable Preparation**:

- Identify needed cables:
  - 2x 12VHPWR or 4x 8-pin PCIe (GPU 3 & 4)
- Route cables to GPU area

#### Step 4.3: Add2PSU Adapter Installation

> **CRITICAL**: Add2PSU synchronizes both PSUs. Without this, secondary PSU won't power on.

**Add2PSU Wiring**:

```
[Primary PSU]              [Secondary PSU]
   24-pin -----> [Add2PSU] <----- 24-pin
                    |
              (No motherboard
               connection for
               secondary PSU)
```

**Installation Steps**:

1. **Adapter Preparation**:
   - Identify Add2PSU adapter (small PCB with 2x 24-pin connectors)
   - Verify both PSUs are OFF and unplugged

2. **Primary PSU Connection**:
   - Connect primary PSU 24-pin cable to Add2PSU "Primary" port
   - Secure clip should lock (audible click)

3. **Secondary PSU Connection**:
   - Connect secondary PSU 24-pin cable to Add2PSU "Secondary" port
   - Adapter bridges PS_ON pins to synchronize startup

4. **Add2PSU Motherboard Connection**:
   - Connect Add2PSU 24-pin output to motherboard 24-pin header
   - This cable now controls BOTH PSUs

**Verification**:

- [ ] Primary PSU 24-pin → Add2PSU "Primary"
- [ ] Secondary PSU 24-pin → Add2PSU "Secondary"
- [ ] Add2PSU output → Motherboard 24-pin
- [ ] Both PSU power switches OFF
- [ ] Both PSU power cables unplugged

### Phase 5: PSU Cabling (60 minutes)

> **PHILOSOPHY**: Route all cables before connecting to components. Measure twice, route once.

#### Step 5.1: Cable Routing Strategy

**Cable Management Zones**:

```
[Top View - Behind Motherboard Tray]

Zone 1 (Top):        CPU power (EPS)
Zone 2 (Mid-Top):    Motherboard 24-pin
Zone 3 (Mid):        GPU power cables
Zone 4 (Bottom):     SATA/Molex, fan cables

Route cables to zones, then connect components
```

**Routing Rules**:

1. Use all cable management holes (prevents cable stress)
2. Leave 2-3" slack at each connection (maintenance access)
3. Bundle similar cables together (24-pin, EPS, PCIe separate)
4. Avoid crossing cables (causes cable bulk)

#### Step 5.2: Motherboard Power Cables (Primary PSU)

**24-Pin ATX Main Power**:

1. Route from primary PSU → grommet hole → motherboard 24-pin
2. Path: Behind motherboard tray → right edge → 24-pin header
3. Connect to motherboard (full insertion, clip locks)
4. Secure cable with ties every 6-8"

**CPU EPS Power (2x 8-pin)**:

```
Motherboard has 2x 8-pin CPU power connectors:
EPS_1: Primary (required)
EPS_2: Secondary (recommended for 280W TDP CPU)
```

1. Route 2x 8-pin EPS cables from PSU → top grommet → CPU area
2. Connect both 8-pin connectors (EPS_1 and EPS_2)
3. **CRITICAL**: Use EPS cables, NOT PCIe cables (keyed differently)
4. Verify full insertion (clips locked)

#### Step 5.3: GPU Power Cable Preparation

> **RTX 4090 Power Requirements**: Each GPU needs 450W. Use 12VHPWR or 3x 8-pin adapters.

**12VHPWR Cable Configuration** (Recommended):

```
Each RTX 4090 needs:
- 1x 12VHPWR cable (600W capable)
OR
- 3x 8-pin PCIe cables with adapter

Use 12VHPWR directly from PSU for cleanest solution
```

**Cable Assignments**:

- **GPU 1 (Slot 1)**: Primary PSU, 12VHPWR Cable 1
- **GPU 2 (Slot 3)**: Primary PSU, 12VHPWR Cable 2
- **GPU 3 (Slot 5)**: Secondary PSU, 12VHPWR Cable 1
- **GPU 4 (Slot 7)**: Secondary PSU, 12VHPWR Cable 2

**Pre-Routing** (Before GPU Installation):

1. Identify GPU slot positions (slots 1, 3, 5, 7 per motherboard manual)
2. Route cables from PSUs → GPU area
3. Label each cable (GPU1, GPU2, GPU3, GPU4)
4. Leave cables draped in position for GPU installation

#### Step 5.4: Storage Power Cables

**SATA Power Distribution**:

- OS Drive (990 PRO): SATA Power 1
- Model Storage 1 (T705): SATA Power 2
- Model Storage 2 (T705): SATA Power 3

1. Route SATA power cable from primary PSU → drive bays
2. Connect 3 drives to single SATA power cable (max 3 per cable)
3. **CRITICAL**: Do not daisy-chain NVMe drives (each has own M.2 slot power)

#### Step 5.5: Fan Power Cables

**Fan Hub Configuration** (If using):

- 6x Noctua iPPC-3000 fans → Fan hub → Motherboard CHA_FAN header
- Fan hub powered by 4-pin Molex from primary PSU

**Direct Motherboard Connection** (Alternative):

- Connect each fan directly to motherboard headers (CHA_FAN1-6)
- Route fan cables through cable management holes

**CHECKPOINT**: All power cables routed but not yet connected to components.

---

## GPU Installation

> **MOST CRITICAL SECTION**: $7,200 in GPUs. Take your time. Verify each step.

### Understanding GPU Slot Allocation

**ASUS Pro WS WRX90E-SAGE SE PCIe Layout**:

```
[Motherboard PCIe Slots - Rear to Front]

Slot 1: PCIe 5.0 x16 ← GPU 1 (Top GPU)
Slot 2: PCIe 5.0 x1  (Skip - blocked by GPU 1)
Slot 3: PCIe 5.0 x16 ← GPU 2
Slot 4: PCIe 5.0 x1  (Skip - blocked by GPU 2)
Slot 5: PCIe 5.0 x16 ← GPU 3
Slot 6: PCIe 5.0 x1  (Skip - blocked by GPU 3)
Slot 7: PCIe 5.0 x16 ← GPU 4 (Bottom GPU)

Note: 3-slot spacing allows 2.5-slot GPUs with clearance
```

### Phase 6: GPU Installation (45 minutes)

#### Step 6.1: Pre-Installation Verification

**GPU Inspection** (For Each GPU):

1. Remove GPU from anti-static bag
2. Inspect for shipping damage:
   - Bent PCIe fingers
   - Damaged power connectors
   - Cracked PCB or backplate
3. Verify fan spins freely (gentle finger spin)
4. Check thermal pads on backplate (should be intact)
5. Photograph GPU serial number (RMA documentation)

**Slot Preparation**:

1. Remove PCIe slot covers for slots 1, 3, 5, 7
2. Keep screws for later (secure GPUs with these)
3. Verify no obstructions in slots (dust, debris)

#### Step 6.2: GPU Installation Sequence

> **INSTALL ORDER**: Bottom to top (GPU 4 → GPU 1). Prevents blocking access to lower slots.

**GPU 4 Installation (Slot 7 - Bottom)**:

1. **Align GPU**:
   - Hold GPU horizontally above Slot 7
   - Align PCIe fingers with slot
   - Align rear bracket with PCIe slot opening

2. **Insert GPU**:
   - Lower GPU into slot at slight angle (front down ~10°)
   - Push PCIe edge into slot firmly
   - **Expect resistance** - requires ~5-10 lbs force
   - Press rear bracket flush with case
   - **LISTEN for click** - PCIe slot retention clip locks

3. **Secure GPU**:
   - Install PCIe bracket screw (rear of case)
   - Tighten firmly but not over-tight
   - Verify GPU secure (no sag, no movement)

4. **Power Connection**:
   - Locate GPU power connector (12VHPWR on top edge)
   - Align cable connector (keyed, only fits one way)
   - Push until click (full insertion critical)
   - **CRITICAL**: Verify connector fully seated (no gaps)

5. **Support Check**:
   - Verify GPU level (no excessive sag)
   - If sagging: Install GPU support bracket or riser

**GPU 3 Installation (Slot 5)**:

- Repeat steps above for GPU 3
- Verify 3-slot spacing from GPU 4 (should have clearance)
- Connect power from secondary PSU

**GPU 2 Installation (Slot 3)**:

- Repeat steps above for GPU 2
- Verify 3-slot spacing from GPU 3
- Connect power from primary PSU

**GPU 1 Installation (Slot 1 - Top)**:

- Repeat steps above for GPU 1
- This is most accessible slot (easiest installation)
- Connect power from primary PSU

#### Step 6.3: GPU Power Connection Verification

> **WARNING**: Improper 12VHPWR connection is #1 cause of RTX 4090 failures (melting connectors).

**12VHPWR Connection Checklist** (For Each GPU):

- [ ] Connector fully inserted (no gaps visible)
- [ ] Retention clip engaged (audible/visible click)
- [ ] Cable not bent sharply at connector (min 35mm straight run)
- [ ] Cable strain relief in place (no pulling on connector)
- [ ] Connector not loose (gentle tug test)

**Common 12VHPWR Mistakes**:

- ❌ Partial insertion (causes arcing/melting)
- ❌ Sharp bend near connector (damages pins)
- ❌ Using adapter with loose fit
- ❌ Exceeding cable power rating (use native 12VHPWR)

#### Step 6.4: GPU Support Installation (Anti-Sag)

**GPU Sag Prevention**:

```
[Side View]
     ___GPU1___
    /          \ ← Sag (bad)
   /   Support  \
  /      ↑       \
[Slot] [Brace] [Slot]
```

**Support Options**:

1. **GPU Support Bracket** (Recommended):
   - Adjustable stand from case floor to GPU edge
   - Position under GPU sag point (usually center)
   - Adjust height until GPU level

2. **PCIe Slot Support**:
   - Reinforced PCIe riser cables
   - Distributes weight across multiple slots

3. **Vertical GPU Mount** (Not recommended for 4-GPU):
   - Requires PCIe riser cables
   - Reduces airflow between GPUs

**Installation**:

1. Install support under GPU 4 (longest/heaviest)
2. Adjust until GPU level with motherboard
3. Repeat for GPUs 3, 2, 1 if needed
4. Verify no stress on PCIe slots (gentle wiggle test)

**CHECKPOINT**: All 4 GPUs installed, powered, and supported. Verify level and secure.

---

## Storage Installation

### Phase 7: NVMe Drive Installation (15 minutes)

#### M.2 Slot Identification

**ASUS Pro WS WRX90E-SAGE SE M.2 Slots**:

```
Typical layout (consult manual):
M.2_1: PCIe 5.0 x4 ← 2TB Samsung 990 PRO (OS)
M.2_2: PCIe 5.0 x4 ← 4TB Crucial T705 (Models)
M.2_3: PCIe 5.0 x4 ← 4TB Crucial T705 (Models)
```

#### NVMe Installation Procedure (For Each Drive)

1. **Heatsink Removal**:
   - Remove M.2 heatsink cover (usually 1-2 screws)
   - Remove thermal pad protective film (both sides)

2. **Drive Installation**:
   - Align notch in M.2 drive with M.2 slot key
   - Insert at 30° angle
   - Press down firmly until flat
   - Secure with M.2 mounting screw (included with motherboard)
   - **Do not over-tighten** (can crack drive PCB)

3. **Heatsink Reinstallation**:
   - Apply thermal pad to drive (if not pre-applied)
   - Install heatsink cover
   - Secure with screws

**Installation Order**:

1. **M.2_1**: Samsung 990 PRO 2TB (OS/Software)
2. **M.2_2**: Crucial T705 4TB (Model Storage 1)
3. **M.2_3**: Crucial T705 4TB (Model Storage 2)

**CHECKPOINT**: All 3 NVMe drives installed with heatsinks.

---

## Network Card Installation

### Phase 8: Mellanox 25GbE Installation (10 minutes)

**Slot Selection**:

- Use remaining open PCIe x16 slot (not occupied by GPU)
- Typically Slot 2, 4, or 6 (x1 electrical, sufficient for 25GbE)

**Installation**:

1. Remove PCIe slot cover for chosen slot
2. Align network card with slot
3. Press firmly until click (retention clip locks)
4. Secure with PCIe bracket screw
5. **No power cables needed** (draws power from PCIe)

---

## Cable Management

### Phase 9: Final Cable Routing (30 minutes)

#### Cable Management Best Practices

**Behind Motherboard Tray**:

1. Bundle cables by type (power, data, fans)
2. Use cable ties every 6-8 inches
3. Avoid tight bends (min 1" radius)
4. Leave 2-3" slack at each connection

**Front of Motherboard**:

1. Route cables along edges (avoid blocking airflow)
2. GPU power cables should drop vertically (no sharp bends)
3. Front panel cables routed to bottom-right

**Cable Tie Technique**:

```
Good:  Loose enough to slide 1 finger under
       =====[Cable Bundle]=====
            ↑ 1 finger gap

Bad:   Too tight (damages cables)
       ≡≡≡≡≡[Crushed]≡≡≡≡≡
```

#### Final Cable Checklist

- [ ] All cables secured with ties
- [ ] No cables touching fans (spin test)
- [ ] No cables blocking airflow paths
- [ ] Excess cable length tucked behind tray
- [ ] All cables labeled (for future maintenance)

---

## BIOS Configuration

### Phase 10: First Boot & BIOS Setup (30 minutes)

#### Pre-Power-On Checks

**CRITICAL: Final Safety Inspection**

- [ ] All power cables connected (motherboard, CPU, GPUs)
- [ ] All PSU power switches OFF
- [ ] All case fans connected
- [ ] No loose screws or tools in case
- [ ] No cables touching fans
- [ ] Both PSUs plugged into grounded outlets
- [ ] Monitor connected to GPU 1 (top GPU)
- [ ] Keyboard connected

#### First Power-On Procedure

> **TAKE IT SLOW**: First boot is most critical. Watch for smoke, smell, or unusual sounds.

1. **PSU Power-On Sequence**:
   - Turn ON primary PSU power switch (rear of PSU)
   - Turn ON secondary PSU power switch
   - **Both PSUs should turn on simultaneously** (Add2PSU sync)
   - Observe motherboard LED (should light up)

2. **Press Power Button**:
   - Press case power button
   - **Listen for**:
     - ✓ Fans spinning up (CPU, case, GPU fans)
     - ✓ POST beep (single beep = success)
     - ❌ Continuous beeps (error code)
     - ❌ No beeps, no fans (power issue)

3. **Watch Monitor**:
   - Should display ASUS splash screen (5-10 seconds)
   - May show "New CPU Installed" or "Memory Changed" messages (normal)
   - Press **DEL** or **F2** to enter BIOS

**If No Display**:

- Verify monitor connected to GPU 1 (top GPU)
- Verify GPU power cables connected
- Verify monitor power and input selection
- Wait 60 seconds (first boot takes longer)

#### BIOS Initial Setup

**Essential BIOS Settings** (Settings → Advanced):

**1. Memory Configuration**:

```
AI Tweaker / Memory Settings:
- Memory Frequency: 5600 MHz (DDR5-5600)
- Memory Timing Mode: Auto (will use XMP/EXPO)
- Memory Channel: All (enable all 8 channels)
```

**2. PCIe Configuration**:

```
Advanced → PCIe Configuration:
- PCIe Slot 1: Gen 5, x16 mode
- PCIe Slot 3: Gen 5, x16 mode
- PCIe Slot 5: Gen 5, x16 mode
- PCIe Slot 7: Gen 5, x16 mode

Above Board Decoding 4G: Enabled (required for 4 GPUs)
Resizable BAR: Enabled (performance)
```

**3. Storage Configuration**:

```
Advanced → NVMe Configuration:
- M.2_1: Enabled (990 PRO)
- M.2_2: Enabled (T705 #1)
- M.2_3: Enabled (T705 #2)
```

**4. Boot Configuration**:

```
Boot → Boot Configuration:
- Fast Boot: Disabled (for initial setup)
- Boot Logo: Enabled
- Boot Device: M.2_1 (990 PRO)
```

**5. Fan Control**:

```
Monitor → Fan Control:
- CPU Fan: PWM Mode, target 60°C
- CHA_FAN1-6: PWM Mode, target 50°C (aggressive for GPUs)
- Fan Curve: Aggressive (Industrial fans can handle it)
```

**6. Power Management**:

```
Advanced → Power Management:
- Power On By PCIe: Disabled
- Restore AC Power Loss: Power Off (safety)
```

**7. Security**:

```
Security:
- Secure Boot: Disabled (for Linux compatibility)
- CSM: Enabled (legacy boot support)
```

#### Save and Exit

1. Press **F10** (Save & Exit)
2. Confirm changes
3. System will reboot

**POST Verification**:

- System should boot faster (5-10 seconds to POST screen)
- All 8x RAM modules detected (512GB total)
- All 4x GPUs detected (check PCIe device list)
- All 3x NVMe drives detected (boot device list)

---

## POST Troubleshooting

### Common POST Issues & Solutions

#### Issue 1: No Power (No Fans, No LEDs)

**Symptoms**: Press power button, nothing happens

**Troubleshooting Steps**:

1. **Verify PSU Power**:
   - [ ] Primary PSU switch ON
   - [ ] Secondary PSU switch ON
   - [ ] Wall outlets have power (test with lamp)
   - [ ] Power cables fully inserted into PSUs

2. **Test PSU Independently**:
   - Unplug 24-pin from motherboard
   - Use PSU jumper test (short pins 4 & 5 on 24-pin)
   - PSU fan should spin (PSU working)
   - If no spin: PSU defective

3. **Check Add2PSU Adapter**:
   - Verify connections: Primary PSU → Add2PSU → Motherboard
   - Secondary PSU → Add2PSU
   - Try bypassing Add2PSU (connect primary PSU directly to test)

4. **Front Panel Connectors**:
   - Verify power button connector on motherboard
   - Check pinout in manual (usually bottom-right)
   - Try shorting PWR_SW pins with screwdriver (tests button)

#### Issue 2: Fans Spin, No Display (No POST)

**Symptoms**: Fans running, but no display output

**Troubleshooting Steps**:

1. **GPU Power Verification**:
   - [ ] All GPU 12VHPWR cables connected
   - [ ] GPU fans spinning (indicates power)
   - [ ] GPU LED indicators lit (if present)

2. **Display Connection**:
   - [ ] Monitor connected to GPU 1 (top GPU, primary slot)
   - [ ] Monitor power on
   - [ ] Correct input selected (DisplayPort/HDMI)
   - [ ] Try different cable/port

3. **GPU Reseating**:
   - Power off system
   - Remove GPU 1
   - Inspect PCIe slot for damage
   - Reinstall GPU 1 firmly (listen for click)
   - Retry boot

4. **Memory Issues**:
   - Try booting with only 2 DIMMs (A1 + E1)
   - If boots: Add DIMMs one at a time to identify bad module
   - Verify all DIMMs fully seated (clips locked)

#### Issue 3: POST Beep Codes

**ASUS Motherboard Beep Codes**:

- **1 short beep**: POST successful (normal)
- **1 long, 2 short**: Graphics card error
  - Check GPU power connections
  - Reseat GPU
  - Try different PCIe slot
- **1 long, 3 short**: Memory error
  - Reseat RAM
  - Try different DIMM slots
  - Test DIMMs individually
- **Continuous beeps**: Power supply issue
  - Check all power connections
  - Verify PSU capacity sufficient

#### Issue 4: System Reboots During POST

**Symptoms**: Starts to boot, then restarts

**Troubleshooting**:

1. **Power Supply Overload**:
   - Disconnect non-essential devices (extra GPUs)
   - Boot with only GPU 1
   - If stable: Power distribution issue

2. **Short Circuit**:
   - Power off, inspect for:
     - Extra standoffs under motherboard
     - Loose screws touching motherboard
     - Cables touching exposed circuits
   - Remove motherboard, reinstall carefully

3. **CPU/Cooler Issues**:
   - Verify CPU cooler connected to CPU_FAN header
   - Check BIOS CPU temperature (should be <40°C idle)
   - Reseat CPU cooler if temps >50°C idle

#### Issue 5: Some GPUs Not Detected

**Symptoms**: BIOS shows only 2-3 GPUs instead of 4

**Troubleshooting**:

1. **PCIe Configuration**:
   - Enter BIOS → PCIe settings
   - Verify all x16 slots set to Gen 5, x16 mode
   - Enable "Above 4G Decoding"

2. **GPU Power**:
   - Verify missing GPU has power connected
   - Check GPU LED/fans (indicates power)
   - Try swapping power cable with working GPU

3. **Slot Testing**:
   - Move working GPU to "missing" GPU's slot
   - If detected: Slot is fine, GPU may be defective
   - If not detected: Slot issue (check manual for disabling option)

---

## Testing Protocols

### Phase 11: System Validation (60 minutes)

#### Test 1: BIOS Hardware Verification (5 minutes)

**BIOS Hardware Checklist**:

- [ ] CPU: AMD Threadripper PRO 7975WX detected
- [ ] Memory: 512GB DDR5-5600 (8x 64GB modules)
- [ ] Storage: 3x NVMe drives detected
- [ ] GPUs: 4x NVIDIA GeForce RTX 4090 detected
- [ ] Network: Mellanox 25GbE detected (PCIe devices)
- [ ] Temperatures:
  - CPU: <40°C idle
  - Motherboard: <35°C

#### Test 2: OS Installation & Boot (30 minutes)

**Ubuntu 22.04 LTS Server Installation**:

1. **Create Bootable USB**:
   - Download Ubuntu 22.04 LTS Server ISO
   - Use Rufus (Windows) or dd (Linux) to create USB
   - Boot from USB (F8 for boot menu)

2. **Installation Options**:
   - Install on: Samsung 990 PRO 2TB (M.2_1)
   - Partitioning:
     - `/boot/efi`: 512MB (EFI)
     - `/`: 100GB (root)
     - `/home`: Remaining space
     - `swap`: 64GB (or none if using large RAM)
   - Hostname: `ai-workstation`
   - User: `admin` (or your preference)

3. **Post-Install Verification**:
   - Boot to Ubuntu
   - Login via SSH or local console
   - Run: `lsblk` (verify all drives detected)
   - Run: `free -h` (verify 512GB RAM detected)

#### Test 3: GPU Driver Installation (15 minutes)

**NVIDIA Driver Installation**:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install NVIDIA driver (version 550+ for RTX 4090)
sudo apt install -y nvidia-driver-550

# Install CUDA Toolkit
sudo apt install -y nvidia-cuda-toolkit

# Reboot
sudo reboot

# Verify GPU detection (after reboot)
nvidia-smi
```

**Expected Output**:

```
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 550.xx       Driver Version: 550.xx       CUDA Version: 12.4   |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
|   0  NVIDIA GeForce RTX 4090    Off  | 00000000:01:00.0  On |                  Off |
|   1  NVIDIA GeForce RTX 4090    Off  | 00000000:02:00.0 Off |                  Off |
|   2  NVIDIA GeForce RTX 4090    Off  | 00000000:03:00.0 Off |                  Off |
|   3  NVIDIA GeForce RTX 4090    Off  | 00000000:04:00.0 Off |                  Off |
+-----------------------------------------------------------------------------+
```

**Verification Checklist**:

- [ ] All 4 GPUs detected (`nvidia-smi` shows 4 devices)
- [ ] Driver version 550+ installed
- [ ] CUDA 12.4+ available
- [ ] GPU temperatures <50°C idle

#### Test 4: Stress Testing (60+ minutes)

> **WARNING**: Stress testing generates significant heat. Monitor temperatures continuously.

**CPU Stress Test (30 minutes)**:

```bash
# Install stress testing tools
sudo apt install -y stress-ng

# Run CPU stress test (all 64 threads, 30 min)
stress-ng --cpu 64 --timeout 30m --metrics-brief

# Monitor in separate terminal
watch -n 1 'sensors | grep -E "CPU|Tdie"'
```

**Expected Results**:

- CPU temperature: <90°C under load (85°C target)
- All cores active (check with `htop`)
- No throttling (clock speeds stable)
- No system crashes/freezes

**GPU Stress Test (60 minutes)**:

```bash
# Install GPU stress tool
sudo apt install -y gpu-burn

# Test all GPUs simultaneously (60 min)
# Run in separate terminals for each GPU:
CUDA_VISIBLE_DEVICES=0 gpu-burn 3600  # GPU 0
CUDA_VISIBLE_DEVICES=1 gpu-burn 3600  # GPU 1
CUDA_VISIBLE_DEVICES=2 gpu-burn 3600  # GPU 2
CUDA_VISIBLE_DEVICES=3 gpu-burn 3600  # GPU 3

# Monitor GPUs
watch -n 1 nvidia-smi
```

**Expected Results**:

- GPU temperature: <85°C under load (80°C target)
- GPU power draw: ~400-450W each
- No thermal throttling (clocks stable)
- No artifacts or crashes
- Memory errors: 0 (check `nvidia-smi -q`)

**Temperature Monitoring Targets**:

```
Component          Idle    Load    Max (Throttle)
CPU                <40°C   <85°C   95°C
GPU (each)         <50°C   <80°C   89°C
Memory             <45°C   <65°C   85°C
Motherboard VRM    <50°C   <80°C   100°C
```

#### Test 5: Memory Test (Optional, 8+ hours)

**MemTest86+ (Boot from USB)**:

```bash
# Create MemTest86+ USB
# Boot from USB
# Run full test (all 8 passes, ~8-12 hours)
# Expected: 0 errors
```

**Alternative: Linux memtester**:

```bash
sudo apt install -y memtester

# Test 500GB (leave 12GB for OS)
sudo memtester 500G 1
```

#### Test 6: Storage Performance Test (10 minutes)

**NVMe Performance Verification**:

```bash
# Install fio (flexible I/O tester)
sudo apt install -y fio

# Test OS drive (990 PRO)
sudo fio --name=seqread --rw=read --bs=1M --size=10G --filename=/tmp/test

# Test model storage (T705)
sudo fio --name=seqread --rw=read --bs=1M --size=10G --filename=/home/test
```

**Expected Results**:

- 990 PRO: ~7,000 MB/s sequential read
- T705: ~14,000 MB/s sequential read

#### Test 7: Network Performance Test (5 minutes)

**25GbE Verification**:

```bash
# Install iperf3
sudo apt install -y iperf3

# On another machine (server):
iperf3 -s

# On workstation (client):
iperf3 -c <server-ip> -t 30

# Expected: ~23-24 Gbps throughput (25GbE limit)
```

---

## Final QA Checklist

### Phase 12: Final Quality Assurance (30 minutes)

#### Hardware Verification

**Physical Inspection**:

- [ ] All components secured (no loose screws/parts)
- [ ] No visible damage to components
- [ ] All cables connected and secured
- [ ] Cable management clean (no blocking airflow)
- [ ] GPU support brackets installed (no sag)
- [ ] All case panels fit properly (no gaps)

**Power System**:

- [ ] Both PSUs operational
- [ ] Add2PSU synchronization working
- [ ] All power cables fully inserted (24-pin, EPS, GPU)
- [ ] No burning smell or excessive heat
- [ ] PSU fans spinning under load

**Cooling System**:

- [ ] All fans operational (6x case + CPU + 4x GPU)
- [ ] Airflow direction correct (front→rear, bottom→top)
- [ ] No fan cables touching fan blades
- [ ] CPU cooler secure (no wobble)
- [ ] Thermal paste applied correctly (check temps)

#### Software Verification

**BIOS Settings**:

- [ ] All memory channels active (8x 64GB = 512GB)
- [ ] PCIe slots configured correctly (all x16 mode)
- [ ] Above 4G Decoding enabled
- [ ] Resizable BAR enabled
- [ ] Boot order correct (990 PRO first)
- [ ] Fan curves configured (aggressive for 24/7 load)

**Operating System**:

- [ ] Ubuntu 22.04 LTS installed and updated
- [ ] All drives mounted and accessible
- [ ] Network connectivity (10GbE + 25GbE)
- [ ] SSH access configured (if headless)

**GPU Configuration**:

- [ ] NVIDIA driver 550+ installed
- [ ] CUDA 12.4+ installed
- [ ] All 4 GPUs detected (`nvidia-smi`)
- [ ] GPU temperatures normal (<50°C idle)
- [ ] No GPU errors (`dmesg | grep -i nvidia`)

#### Performance Verification

**Baseline Benchmarks**:

- [ ] CPU: Cinebench R23 (multi-core >100,000)
- [ ] GPU: 3DMark Time Spy (4x scores ~30,000 each)
- [ ] Memory: AIDA64 (bandwidth >400 GB/s)
- [ ] Storage: CrystalDiskMark (990 PRO >7000 MB/s, T705 >14000 MB/s)

**Stress Test Results**:

- [ ] CPU stress test: 30 min, <90°C, no throttling
- [ ] GPU stress test: 60 min each GPU, <85°C, no errors
- [ ] Memory test: 0 errors (if run)
- [ ] System stable under full load (CPU + 4x GPU)

#### Safety & Reliability

**Electrical Safety**:

- [ ] No exposed wiring or connections
- [ ] All ground pins connected (3-prong plugs)
- [ ] No overloaded power strips (use separate circuits if possible)
- [ ] Surge protection on all power connections

**Thermal Safety**:

- [ ] Case exterior cool to touch (<40°C)
- [ ] No hot spots on case (IR thermometer check)
- [ ] Room ventilation adequate (ambient <25°C)
- [ ] Clearance around case (6" minimum all sides)

**Long-Term Reliability**:

- [ ] All firmware updated (BIOS, GPU, network card)
- [ ] Monitoring software installed (sensors, nvidia-smi)
- [ ] Backup power solution planned (UPS recommended)
- [ ] Documentation complete (build log, serial numbers)

---

## Maintenance & Monitoring

### Recommended Monitoring Setup

**Install Monitoring Tools**:

```bash
# System monitoring
sudo apt install -y htop iotop lm-sensors

# GPU monitoring
watch -n 1 nvidia-smi

# Temperature logging
sudo sensors-detect  # Auto-detect sensors
sensors  # Display all temperatures
```

**Create Monitoring Script** (`~/monitor.sh`):

```bash
#!/bin/bash
# System monitoring dashboard

echo "=== CPU ==="
sensors | grep -E "Tdie|CPU"

echo "=== GPUs ==="
nvidia-smi --query-gpu=index,name,temperature.gpu,utilization.gpu,power.draw --format=csv,noheader

echo "=== Memory ==="
free -h | grep Mem

echo "=== Storage ==="
df -h | grep -E "nvme|/$"

echo "=== Fan Speeds ==="
sensors | grep -i fan
```

### Maintenance Schedule

**Daily** (Automated):

- Monitor GPU temperatures (alert if >85°C)
- Check system logs for errors
- Verify all GPUs operational

**Weekly**:

- Review temperature trends
- Check for driver/firmware updates
- Verify backup systems

**Monthly**:

- Clean dust filters (front intake)
- Inspect cable connections
- Review performance benchmarks (detect degradation)

**Quarterly**:

- Deep clean (compressed air, all components)
- Thermal paste inspection (reapply if temps increasing)
- Cable management review
- Full system backup

**Annually**:

- Replace thermal paste (CPU + GPUs if accessible)
- Replace case fans (if bearings noisy)
- BIOS update (if stability improvements available)
- Warranty status review

---

## Safety Warnings Summary

### CRITICAL SAFETY REMINDERS

**Electrical Hazards**:

- ⚠️ **2,600W Total Power**: Use dedicated 20A circuits (2x recommended)
- ⚠️ **Never work on powered system**: Shut down, switch off PSUs, unplug
- ⚠️ **ESD Protection Mandatory**: $17,000+ components, ESD can destroy instantly
- ⚠️ **Grounding Required**: All 3-prong plugs, verify ground with tester

**Fire Hazards**:

- ⚠️ **12VHPWR Connectors**: #1 cause of RTX 4090 fires - verify FULL insertion
- ⚠️ **Overloaded Circuits**: 2,600W system can trip 15A breakers
- ⚠️ **Dust Accumulation**: Clean filters monthly (dust + high power = fire risk)
- ⚠️ **Cable Rating**: Use 16AWG or thicker power cables (not thin extension cords)

**Thermal Hazards**:

- ⚠️ **High Operating Temps**: GPUs reach 80°C+, CPU 85°C+ under load
- ⚠️ **Burn Risk**: Allow 15 min cooldown before touching internal components
- ⚠️ **Ventilation Required**: Minimum 6" clearance all sides, well-ventilated room
- ⚠️ **Thermal Runaway**: Monitor temps during first week (failure mode detection)

**Physical Hazards**:

- ⚠️ **Heavy Components**: Motherboard + CPU + RAM + cooler = 15+ lbs (2-person lift)
- ⚠️ **Sharp Edges**: Case interior, heatsink fins, PCB edges (wear gloves)
- ⚠️ **GPU Weight**: Each 4090 = 5+ lbs (support brackets mandatory)
- ⚠️ **Pinch Points**: Case panels, cooler mounting (watch fingers)

**Component Damage Risks**:

- ⚠️ **Over-Torquing**: Motherboard screws, cooler mounting (can crack PCB)
- ⚠️ **Bent Pins**: CPU socket (inspect before installation)
- ⚠️ **PCIe Slot Damage**: GPU installation requires 5-10 lbs force (align carefully)
- ⚠️ **RAM Installation**: Requires 20-30 lbs force (support motherboard)

---

## Appendix: Quick Reference

### Component Installation Order

1. ✅ Case preparation (I/O shield, standoffs, fans)
2. ✅ Motherboard assembly outside case (CPU, RAM, cooler)
3. ✅ Motherboard installation in case
4. ✅ PSU installation (primary + secondary)
5. ✅ Add2PSU adapter installation
6. ✅ Power cable routing
7. ✅ GPU installation (bottom to top)
8. ✅ Storage installation (NVMe drives)
9. ✅ Network card installation
10. ✅ Cable management
11. ✅ First boot & BIOS configuration
12. ✅ OS installation
13. ✅ Driver installation
14. ✅ Stress testing
15. ✅ Final QA

### Power Budget Reference

| Component         | Idle     | Typical    | Peak       |
| ----------------- | -------- | ---------- | ---------- |
| CPU (7975WX)      | 50W      | 180W       | 280W       |
| GPU 1-4 (each)    | 25W      | 350W       | 450W       |
| Memory (512GB)    | 40W      | 50W        | 60W        |
| Motherboard       | 30W      | 50W        | 80W        |
| Storage (3x NVMe) | 10W      | 20W        | 30W        |
| Fans (9x total)   | 15W      | 30W        | 50W        |
| **Total**         | **245W** | **1,580W** | **2,410W** |

### Temperature Targets Reference

| Component  | Idle Target | Load Target | Thermal Throttle |
| ---------- | ----------- | ----------- | ---------------- |
| CPU        | <40°C       | <85°C       | 95°C             |
| GPU (each) | <50°C       | <80°C       | 89°C             |
| Memory     | <45°C       | <65°C       | 85°C             |
| VRM        | <50°C       | <80°C       | 100°C            |
| NVMe       | <50°C       | <70°C       | 85°C             |

### Cable Color Reference (Typical)

| Cable Type        | Color/Label           | Connector    |
| ----------------- | --------------------- | ------------ |
| Motherboard Power | 24-pin, thick         | ATX 24-pin   |
| CPU Power         | 8-pin, labeled "EPS"  | 8-pin 12V    |
| GPU Power         | 12VHPWR or 8-pin PCIe | 12VHPWR      |
| SATA Power        | Flat, multi-connector | SATA L-shape |
| Fan Power         | 4-pin, thin           | 4-pin PWM    |

### Useful Commands Reference

```bash
# Hardware detection
lspci -v                    # All PCIe devices
lsblk                       # Storage devices
free -h                     # Memory usage
sensors                     # Temperature sensors

# GPU monitoring
nvidia-smi                  # GPU status
nvidia-smi -l 1             # Continuous monitoring
nvidia-smi -q               # Detailed info

# Performance testing
stress-ng --cpu 64          # CPU stress test
gpu-burn 3600               # GPU stress test (60 min)
fio --name=test --rw=read   # Storage test

# System information
dmidecode -t memory         # Memory details
dmidecode -t processor      # CPU details
lscpu                       # CPU topology
```

---

## Document Information

**Version**: 1.0
**Last Updated**: 2025-11-02
**Target Build**: 4x RTX 4090 Threadripper PRO Workstation
**Total Build Time**: 6-8 hours (first-time builder)
**Difficulty**: Advanced (requires experience with high-end PC building)

**Support Resources**:

- ASUS WRX90E-SAGE SE Manual: [ASUS Support](https://www.asus.com/support/)
- RTX 4090 12VHPWR Guide: [NVIDIA Support](https://nvidia.com)
- Threadripper Installation: [AMD Support](https://www.amd.com/support)

**Revision History**:

- v1.0 (2025-11-02): Initial comprehensive assembly guide

---

**END OF BUILD GUIDE**

_Remember: This is a $17,000+ build. Take your time, verify each step, and don't hesitate to ask for help or consult manufacturer documentation. Better to spend an extra hour verifying than to damage expensive components._
