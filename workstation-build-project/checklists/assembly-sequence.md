# Assembly Sequence Checklist - 4x RTX 4090 Workstation

## Purpose

This checklist provides a step-by-step verification system for assembling the 4x RTX 4090 workstation. Check off each item as completed. **DO NOT skip items** - each step builds on the previous.

---

## Pre-Assembly Phase (60 minutes)

### Workspace Setup

- [ ] Clear 6'x4' workspace prepared
- [ ] ESD mat installed and grounded
- [ ] Anti-static wrist strap tested for continuity
- [ ] Adequate lighting (overhead + task light)
- [ ] All tools gathered and accessible
- [ ] Fire extinguisher (Class C) within reach
- [ ] First aid kit accessible
- [ ] Camera/phone ready for documentation

### Environmental Verification

- [ ] Room temperature 65-75°F
- [ ] Humidity 40-60% RH (use humidifier if needed)
- [ ] No synthetic clothing worn (avoid fleece/polyester)
- [ ] Not working during thunderstorm
- [ ] Grounded power outlets verified with tester

### Component Inventory

- [ ] **CPU**: Threadripper PRO 7975WX (seal unbroken)
- [ ] **Motherboard**: ASUS Pro WS WRX90E-SAGE SE (no damage)
- [ ] **Memory**: 8x 64GB DDR5-5600 ECC (same lot# preferred)
- [ ] **GPU 1**: RTX 4090 (serial# photographed: \_\_\_\_\_\_\_\_)
- [ ] **GPU 2**: RTX 4090 (serial# photographed: \_\_\_\_\_\_\_\_)
- [ ] **GPU 3**: RTX 4090 (serial# photographed: \_\_\_\_\_\_\_\_)
- [ ] **GPU 4**: RTX 4090 (serial# photographed: \_\_\_\_\_\_\_\_)
- [ ] **Primary PSU**: EVGA 1600 T2 (tested with jumper)
- [ ] **Secondary PSU**: EVGA 1000 T2 (tested with jumper)
- [ ] **Add2PSU Adapter**: Dual PSU sync cable
- [ ] **Storage 1**: 2TB Samsung 990 PRO
- [ ] **Storage 2**: 4TB Crucial T705
- [ ] **Storage 3**: 4TB Crucial T705
- [ ] **Case**: Phanteks Enthoo Pro 2 Server Edition
- [ ] **Fans**: 6x Noctua iPPC-3000 140mm
- [ ] **Thermal Paste**: Thermal Grizzly Kryonaut
- [ ] **Network Card**: Mellanox ConnectX-4 Lx 25GbE
- [ ] **KVM**: PiKVM v4 (optional)

### Documentation Review

- [ ] Motherboard manual read (PCIe lane allocation section)
- [ ] GPU spacing requirements reviewed
- [ ] Dual PSU wiring diagram bookmarked
- [ ] BIOS update procedure available
- [ ] Thermal paste application guide ready
- [ ] Build guide (main document) accessible

### Safety Equipment Check

- [ ] Anti-static wrist strap tested
- [ ] ESD mat grounded
- [ ] Outlet ground pins verified
- [ ] Magnetic screwdriver available
- [ ] Needle-nose pliers available
- [ ] Cable ties (50+ pieces) ready
- [ ] Flashlight/headlamp functional

**CHECKPOINT 1**: All pre-assembly items completed. Proceed to Phase 1.

---

## Phase 1: Case Preparation (30 minutes)

### Case Unboxing

- [ ] Case removed from packaging
- [ ] Inspected for shipping damage (photographed if any)
- [ ] All panels removed (left, right, top, front)
- [ ] All pre-installed standoffs removed
- [ ] All included accessories inventoried:
  - [ ] Standoffs (10+ for E-ATX)
  - [ ] Screws (M3 and 6-32 types)
  - [ ] Cable ties
  - [ ] Case manual

### I/O Shield Installation

- [ ] I/O shield located in motherboard box
- [ ] Aligned with rear case opening
- [ ] Pressed firmly until all edges click
- [ ] No bent tabs protruding inward (verified visually)

### Motherboard Standoff Installation

- [ ] E-ATX mounting holes identified in case
- [ ] Standoffs hand-tightened in all holes
- [ ] Final tightening with needle-nose pliers (¼ turn)
- [ ] No extra standoffs under motherboard area
- [ ] Standoff count: \_\_\_\_\_ (should be 9-12)

### Case Fan Pre-Installation

**Front Intake Fans (3x 140mm)**:

- [ ] Bottom fan installed (airflow: front→interior)
- [ ] Middle fan installed (airflow: front→interior)
- [ ] Top fan installed (airflow: front→interior)
- [ ] All fans connected: CHA_FAN1, CHA_FAN2, CHA_FAN3
- [ ] Cables routed behind motherboard tray
- [ ] 6" slack left for motherboard installation
- [ ] Fans labeled: F1, F2, F3

**Top Exhaust Fans (2x 140mm)**:

- [ ] Front-top fan installed (airflow: interior→top)
- [ ] Rear-top fan installed (airflow: interior→top)
- [ ] Both fans connected: CHA_FAN4, CHA_FAN5
- [ ] Positioned over GPU area
- [ ] Cables routed behind motherboard tray
- [ ] Fans labeled: T1, T2

**Rear Exhaust Fan (1x 140mm)**:

- [ ] Rear fan installed (airflow: interior→rear)
- [ ] Connected to CHA_FAN6
- [ ] Cable routed behind motherboard tray
- [ ] Fan labeled: R1

**Fan Installation Verification**:

- [ ] All 6 fans spin freely (finger spin test)
- [ ] Airflow direction verified (front→rear, bottom→top)
- [ ] No fan cables blocking fan blades
- [ ] All cables labeled for identification

**CHECKPOINT 2**: Case preparation complete. Ready for motherboard assembly.

---

## Phase 2: Motherboard Assembly (Outside Case) (45 minutes)

### Motherboard Preparation

- [ ] Motherboard box on stable surface
- [ ] Anti-static bag opened (not removed yet)
- [ ] Self grounded to ESD mat
- [ ] Motherboard removed, placed on anti-static bag
- [ ] CPU socket inspected (no bent pins, used magnifying glass)

### CPU Installation (Threadripper PRO 7975WX)

**Socket Preparation**:

- [ ] CPU socket identified (sTR5, large square)
- [ ] Socket release lever located
- [ ] CPU alignment triangle identified (bottom-left)
- [ ] CPU installation diagram reviewed in manual

**CPU Installation**:

- [ ] Socket retention bracket opened (lever released)
- [ ] Protective cover removed (kept for RMA)
- [ ] CPU removed from packaging (handled by edges only)
- [ ] Alignment triangle matched (CPU to socket)
- [ ] CPU dropped into socket (no force applied)
- [ ] CPU fully seated (level, no gaps verified)
- [ ] Retention bracket lowered onto CPU
- [ ] Retention lever locked (5-10 lbs force applied)
- [ ] Lever flush with socket (locked position)

**CPU Installation Verification**:

- [ ] CPU level on all sides (visual inspection)
- [ ] CPU does not move when gently pressed
- [ ] No bent pins visible around edges (flashlight check)
- [ ] Installation photographed for documentation

### Thermal Paste Application

**Surface Preparation**:

- [ ] CPU IHS cleaned with isopropyl alcohol 99%
- [ ] Surface dried (2 min wait)
- [ ] Thermal Grizzly Kryonaut tube opened

**Paste Application** (Modified X-Pattern for Threadripper):

- [ ] Diagonal line 1 applied (corner to corner, ~2mm wide)
- [ ] Diagonal line 2 applied (corner to corner, ~2mm wide)
- [ ] Vertical center line applied
- [ ] Horizontal center line applied
- [ ] Small dot in center applied
- [ ] Total paste: ~0.3-0.5g used
- [ ] Paste NOT spread (will spread during cooler mounting)

### CPU Cooler Installation

**Mounting Bracket Installation**:

- [ ] Mounting brackets attached to motherboard (4 screws per side)
- [ ] Screws tightened in star pattern (2-3 turns each, opposite corners)
- [ ] Final torque applied (firm, no motherboard flex)
- [ ] Mounting secure (no movement when touched)

**Cooler Installation**:

- [ ] Cooler lowered onto CPU (aligned with mounting holes)
- [ ] All mounting screws started finger-tight
- [ ] Screws tightened in STAR pattern (¼ turn each, opposite corners)
- [ ] Final torque applied (firm contact, no excessive pressure)
- [ ] Cooler does not rock/move when touched

**Cooler Fan Connection**:

- [ ] Cooler fan(s) connected to CPU_FAN header
- [ ] Cable routed neatly (not blocking components)

**CHECKPOINT 3**: CPU and cooler installed. Verify cooler mounting before proceeding.

### Memory Installation (8x 64GB DDR5 ECC)

**Memory Channel Identification**:

- [ ] 8-channel layout confirmed in manual
- [ ] Installation slots identified: A1, B1, C1, D1, E1, F1, G1, H1
- [ ] All DIMM slots opened (clips pushed outward)

**DIMM Installation** (Repeat for Each of 8 DIMMs):

**DIMM 1 (Slot A1)**:

- [ ] Slot clips opened
- [ ] DIMM notch aligned with slot key
- [ ] DIMM pressed firmly and evenly (20-30 lbs force)
- [ ] Both clips automatically locked (audible click)
- [ ] DIMM fully seated (gold contacts not visible)
- [ ] DIMM perpendicular to motherboard

**DIMM 2 (Slot B1)**:

- [ ] Same verification as DIMM 1

**DIMM 3 (Slot C1)**:

- [ ] Same verification as DIMM 1

**DIMM 4 (Slot D1)**:

- [ ] Same verification as DIMM 1

**DIMM 5 (Slot E1)**:

- [ ] Same verification as DIMM 1

**DIMM 6 (Slot F1)**:

- [ ] Same verification as DIMM 1

**DIMM 7 (Slot G1)**:

- [ ] Same verification as DIMM 1

**DIMM 8 (Slot H1)**:

- [ ] Same verification as DIMM 1

**Memory Installation Verification**:

- [ ] All 8 DIMMs installed and locked
- [ ] All DIMMs perpendicular to motherboard
- [ ] No DIMMs tilted or partially inserted
- [ ] Total capacity: 512GB (8 x 64GB)

**CHECKPOINT 4**: All 8x 64GB DIMMs installed. Motherboard assembly complete.

---

## Phase 3: Motherboard Installation in Case (20 minutes)

### Pre-Installation Verification

- [ ] I/O shield installed and aligned (verified)
- [ ] Standoff count matches screw holes: \_\_\_\_\_
- [ ] Motherboard screws prepared (9-12 screws, 6-32 thread)
- [ ] Self grounded to case or ESD mat

### Motherboard Placement

**Two-Person Lift** (Recommended):

- [ ] Person 1 supporting CPU cooler
- [ ] Person 2 holding motherboard edges
- [ ] Motherboard + components weight noted (15+ lbs)

**Installation**:

- [ ] Motherboard approached at 30° angle
- [ ] I/O ports aligned with I/O shield cutouts
- [ ] Motherboard lowered onto standoffs
- [ ] ALL screw holes aligned with standoffs (verified)
- [ ] All screws started finger-tight (prevents misalignment)

**Screw Tightening** (Star Pattern):

- [ ] Screw 1 (top-left) tightened
- [ ] Screw 2 (bottom-right) tightened
- [ ] Screw 3 (top-center-left) tightened
- [ ] Screw 4 (bottom-center-left) tightened
- [ ] Screw 5 (top-center) tightened
- [ ] Screw 6 (bottom-center) tightened
- [ ] Screw 7 (top-center-right) tightened
- [ ] Screw 8 (bottom-center-right) tightened
- [ ] Screw 9 (top-right) tightened
- [ ] Additional screws (if applicable): \_\_\_\_\_

### Post-Installation Verification

- [ ] Motherboard flat against standoffs (no gaps)
- [ ] No standoffs under motherboard without screws
- [ ] I/O ports accessible through I/O shield
- [ ] No bent I/O shield tabs touching connectors
- [ ] Motherboard secure (no flex when gently pressed)

**CHECKPOINT 5**: Motherboard installed in case. Ready for PSU installation.

---

## Phase 4: Power Supply Installation (40 minutes)

### Primary PSU Installation (EVGA 1600 T2)

**PSU Preparation**:

- [ ] PSU mounting bracket removed (if present)
- [ ] PSU fan filter installed (if case provides)
- [ ] Cable routing holes identified

**PSU Orientation**:

- [ ] Fan facing DOWN (cool air from outside)
  - OR [ ] Fan facing UP (if case on carpet)
- [ ] Power switch facing rear I/O

**PSU Installation**:

- [ ] PSU slid into case (aligned with mounting holes)
- [ ] 4 PSU mounting screws installed (hand-tight + ½ turn)
- [ ] PSU secure (no movement when shaken)

**Primary PSU Cable Identification**:

- [ ] 1x 24-pin ATX cable
- [ ] 2x 8-pin EPS cables (CPU power)
- [ ] 2x 12VHPWR cables (GPU 1 & 2 power)
- [ ] 3x SATA power cables (storage)
- [ ] 1x 4-pin Molex cable (fan hub, if needed)

### Secondary PSU Installation (EVGA 1000 T2)

**PSU Location** (Choose One):

- [ ] **Option A**: Upper PSU mount (dedicated)
- [ ] **Option B**: 5.25" bay adapter

**Option A Installation** (If using upper mount):

- [ ] Secondary PSU installed in upper chamber
- [ ] Fan facing interior (shares case airflow)
- [ ] Secured with mounting screws

**Option B Installation** (If using bay adapter):

- [ ] PSU installed in bay adapter bracket
- [ ] Bracket mounted in top 5.25" bays
- [ ] Secured with bay clips or screws

**Secondary PSU Cable Identification**:

- [ ] 2x 12VHPWR cables (GPU 3 & 4 power)

### Add2PSU Adapter Installation

**CRITICAL: Dual PSU Synchronization**:

- [ ] Add2PSU adapter identified (small PCB, 2x 24-pin)
- [ ] Both PSUs OFF and unplugged (verified)

**Adapter Wiring**:

- [ ] Primary PSU 24-pin → Add2PSU "Primary" port (clip locked)
- [ ] Secondary PSU 24-pin → Add2PSU "Secondary" port (clip locked)
- [ ] Add2PSU output → Motherboard 24-pin header (clip locked)

**Add2PSU Verification**:

- [ ] Primary PSU 24-pin connected to Add2PSU Primary
- [ ] Secondary PSU 24-pin connected to Add2PSU Secondary
- [ ] Add2PSU output connected to motherboard 24-pin
- [ ] Both PSU power switches OFF
- [ ] Both PSU power cables unplugged from wall

**CHECKPOINT 6**: Both PSUs installed with Add2PSU adapter. Ready for cable routing.

---

## Phase 5: PSU Cabling (60 minutes)

### Motherboard Power Cables (Primary PSU)

**24-Pin ATX Main Power**:

- [ ] Cable routed from primary PSU → grommet hole → 24-pin header
- [ ] Path behind motherboard tray confirmed
- [ ] Connected to motherboard (full insertion, clip locked)
- [ ] Cable secured with ties every 6-8"
- [ ] 2-3" slack left at connection

**CPU EPS Power (2x 8-pin)**:

- [ ] EPS cable 1 routed from PSU → top grommet → EPS_1 header
- [ ] EPS cable 2 routed from PSU → top grommet → EPS_2 header
- [ ] Both cables fully inserted (clips locked)
- [ ] Verified using EPS cables (NOT PCIe cables)
- [ ] Cables secured with ties

### GPU Power Cable Pre-Routing

**Cable Labeling**:

- [ ] GPU 1 cable labeled (Primary PSU, 12VHPWR #1)
- [ ] GPU 2 cable labeled (Primary PSU, 12VHPWR #2)
- [ ] GPU 3 cable labeled (Secondary PSU, 12VHPWR #1)
- [ ] GPU 4 cable labeled (Secondary PSU, 12VHPWR #2)

**Cable Routing** (Before GPU Installation):

- [ ] GPU 1 cable routed to Slot 1 area (top GPU position)
- [ ] GPU 2 cable routed to Slot 3 area
- [ ] GPU 3 cable routed to Slot 5 area
- [ ] GPU 4 cable routed to Slot 7 area (bottom GPU position)
- [ ] All cables draped in position (ready for GPU installation)

### Storage Power Cables

**SATA Power Distribution**:

- [ ] SATA power cable routed from primary PSU → M.2 area
- [ ] 3 SATA connectors available (one per NVMe drive)
- [ ] Cable secured with ties
- [ ] Note: NVMe drives draw power from M.2 slots (SATA for monitoring only)

### Fan Power Cables (Already Connected in Phase 1)

**Verification**:

- [ ] All 6 case fans connected to CHA_FAN headers
- [ ] Cables routed neatly behind motherboard tray

**CHECKPOINT 7**: All power cables routed. Ready for GPU installation.

---

## Phase 6: GPU Installation (45 minutes)

### Pre-Installation Preparation

**GPU Inspection** (For Each of 4 GPUs):

**GPU 1 Inspection**:

- [ ] Removed from anti-static bag
- [ ] No shipping damage (PCIe fingers, power connectors, PCB)
- [ ] Fan spins freely (finger spin test)
- [ ] Thermal pads intact on backplate
- [ ] Serial number photographed: \_\_\_\_\_\_\_\_

**GPU 2 Inspection**:

- [ ] Same inspection as GPU 1

**GPU 3 Inspection**:

- [ ] Same inspection as GPU 1

**GPU 4 Inspection**:

- [ ] Same inspection as GPU 1

**Slot Preparation**:

- [ ] PCIe slot cover removed for Slot 1 (top GPU)
- [ ] PCIe slot cover removed for Slot 3
- [ ] PCIe slot cover removed for Slot 5
- [ ] PCIe slot cover removed for Slot 7 (bottom GPU)
- [ ] Slot screws kept for GPU bracket mounting
- [ ] No obstructions in slots (dust, debris)

### GPU Installation Sequence (Bottom to Top)

> **INSTALL ORDER**: GPU 4 → GPU 3 → GPU 2 → GPU 1

#### GPU 4 Installation (Slot 7 - Bottom GPU)

**Installation**:

- [ ] GPU held horizontally above Slot 7
- [ ] PCIe fingers aligned with slot
- [ ] Rear bracket aligned with PCIe opening
- [ ] GPU lowered into slot at 10° angle (front down)
- [ ] PCIe edge pushed firmly into slot (5-10 lbs force)
- [ ] Rear bracket flush with case
- [ ] **CLICK heard** - PCIe retention clip locked
- [ ] PCIe bracket screw installed (rear case)
- [ ] GPU secure (no sag, no movement)

**Power Connection**:

- [ ] 12VHPWR connector located on GPU (top edge)
- [ ] Secondary PSU cable aligned (keyed connector)
- [ ] Cable pushed until **CLICK** (full insertion critical)
- [ ] Connector fully seated (no gaps visible)
- [ ] Cable has 35mm+ straight run (no sharp bend near connector)
- [ ] Cable strain relief verified (no pulling on connector)

**Support Installation**:

- [ ] GPU support bracket positioned under GPU 4
- [ ] Adjusted until GPU level with motherboard
- [ ] GPU does not sag (visual inspection)

#### GPU 3 Installation (Slot 5)

**Installation**:

- [ ] Same installation steps as GPU 4
- [ ] 3-slot spacing from GPU 4 verified (clearance confirmed)
- [ ] PCIe retention clip locked (click heard)
- [ ] PCIe bracket screw installed

**Power Connection**:

- [ ] Secondary PSU 12VHPWR cable connected
- [ ] Full insertion verified (click + no gaps)
- [ ] 35mm+ straight run verified
- [ ] Strain relief verified

**Support Installation**:

- [ ] Support bracket installed (if needed)
- [ ] GPU level verified

#### GPU 2 Installation (Slot 3)

**Installation**:

- [ ] Same installation steps as GPU 4
- [ ] 3-slot spacing from GPU 3 verified
- [ ] PCIe retention clip locked
- [ ] PCIe bracket screw installed

**Power Connection**:

- [ ] Primary PSU 12VHPWR cable connected
- [ ] Full insertion verified
- [ ] 35mm+ straight run verified
- [ ] Strain relief verified

**Support Installation**:

- [ ] Support bracket installed (if needed)
- [ ] GPU level verified

#### GPU 1 Installation (Slot 1 - Top GPU)

**Installation**:

- [ ] Same installation steps as GPU 4
- [ ] Most accessible slot (easiest installation)
- [ ] PCIe retention clip locked
- [ ] PCIe bracket screw installed

**Power Connection**:

- [ ] Primary PSU 12VHPWR cable connected
- [ ] Full insertion verified
- [ ] 35mm+ straight run verified
- [ ] Strain relief verified

**Support Installation**:

- [ ] Support bracket installed (if needed)
- [ ] GPU level verified

### GPU Installation Verification

**All 4 GPUs**:

- [ ] All GPUs fully seated in PCIe slots
- [ ] All PCIe retention clips locked
- [ ] All PCIe bracket screws installed
- [ ] All 12VHPWR cables fully inserted (no gaps)
- [ ] All cables have 35mm+ straight run
- [ ] No sharp bends at power connectors
- [ ] All GPUs level (no excessive sag)
- [ ] Support brackets installed as needed
- [ ] 3-slot spacing between GPUs verified

**CHECKPOINT 8**: All 4 GPUs installed and powered. Ready for storage installation.

---

## Phase 7: Storage Installation (15 minutes)

### M.2 Slot Identification

- [ ] M.2_1 identified (PCIe 5.0 x4) - for 990 PRO OS drive
- [ ] M.2_2 identified (PCIe 5.0 x4) - for T705 model storage
- [ ] M.2_3 identified (PCIe 5.0 x4) - for T705 model storage

### NVMe Drive Installation

#### M.2_1: Samsung 990 PRO 2TB (OS Drive)

**Heatsink Removal**:

- [ ] M.2 heatsink cover removed (1-2 screws)
- [ ] Thermal pad protective film removed (both sides)

**Drive Installation**:

- [ ] Drive notch aligned with M.2 slot key
- [ ] Drive inserted at 30° angle
- [ ] Drive pressed down firmly until flat
- [ ] M.2 mounting screw installed (not over-tightened)

**Heatsink Reinstallation**:

- [ ] Thermal pad applied to drive (if not pre-applied)
- [ ] Heatsink cover installed
- [ ] Heatsink secured with screws

#### M.2_2: Crucial T705 4TB (Model Storage 1)

- [ ] Same installation steps as M.2_1
- [ ] Drive fully seated and secured
- [ ] Heatsink installed

#### M.2_3: Crucial T705 4TB (Model Storage 2)

- [ ] Same installation steps as M.2_1
- [ ] Drive fully seated and secured
- [ ] Heatsink installed

### Storage Installation Verification

- [ ] All 3 NVMe drives installed
- [ ] All heatsinks installed
- [ ] All mounting screws secured (not over-tight)

**CHECKPOINT 9**: All storage drives installed. Ready for network card installation.

---

## Phase 8: Network Card Installation (10 minutes)

### Mellanox ConnectX-4 Lx 25GbE Installation

**Slot Selection**:

- [ ] Open PCIe x16 slot identified (not occupied by GPU)
- [ ] Typically Slot 2, 4, or 6 used
- [ ] Slot number noted: \_\_\_\_\_

**Installation**:

- [ ] PCIe slot cover removed
- [ ] Network card aligned with slot
- [ ] Card pressed firmly until click (retention clip locks)
- [ ] PCIe bracket screw installed
- [ ] Card secure (no movement)
- [ ] No power cables needed (draws power from PCIe)

**CHECKPOINT 10**: Network card installed. Ready for cable management.

---

## Phase 9: Cable Management (30 minutes)

### Behind Motherboard Tray Routing

**Cable Bundling by Type**:

- [ ] Power cables bundled together
- [ ] Data cables bundled together (minimal in this build)
- [ ] Fan cables bundled together

**Cable Tie Application**:

- [ ] Cables tied every 6-8 inches
- [ ] Ties loose enough for 1 finger gap (not crushing cables)
- [ ] No tight bends (minimum 1" radius)
- [ ] 2-3" slack at each connection

### Front of Motherboard Cable Routing

**GPU Power Cables**:

- [ ] All 4 GPU power cables drop vertically (no sharp bends)
- [ ] Cables routed along motherboard edge
- [ ] No cables blocking GPU fans
- [ ] 35mm+ straight run at all 12VHPWR connectors

**Front Panel Cables**:

- [ ] Power button cable connected to motherboard (F_PANEL)
- [ ] Reset button cable connected (if present)
- [ ] Power LED cable connected
- [ ] HDD LED cable connected (if present)
- [ ] Audio cable connected (HD_AUDIO header)
- [ ] USB cables connected (USB3.0 headers)
- [ ] All front panel cables routed to bottom-right

### Final Cable Management Verification

- [ ] All cables secured with ties
- [ ] No cables touching fans (manual spin test)
- [ ] No cables blocking airflow paths
- [ ] Excess cable length tucked behind tray
- [ ] All cables labeled (for future maintenance)

**CHECKPOINT 11**: Cable management complete. Ready for first boot.

---

## Phase 10: Pre-Power-On Final Checks (15 minutes)

### Critical Safety Inspection

**Power System Verification**:

- [ ] All power cables connected (motherboard 24-pin, 2x CPU EPS, 4x GPU 12VHPWR)
- [ ] All PSU power switches OFF
- [ ] Both PSUs plugged into grounded outlets (tested)
- [ ] Add2PSU adapter connections verified
- [ ] No loose cables touching fans or components

**Component Verification**:

- [ ] All 4 GPUs seated and secured
- [ ] All 8 RAM modules installed and locked
- [ ] All 3 NVMe drives installed with heatsinks
- [ ] CPU cooler secure and connected to CPU_FAN
- [ ] All 6 case fans connected and cables clear of blades

**Case Interior Inspection**:

- [ ] No loose screws or tools in case
- [ ] No cables touching fans (manual spin test)
- [ ] All components visually inspected (no damage)
- [ ] Motherboard secure (no flex when gently pressed)

**External Connections**:

- [ ] Monitor connected to GPU 1 (top GPU) DisplayPort/HDMI
- [ ] Keyboard connected (USB)
- [ ] Mouse connected (USB, optional)
- [ ] Network cable connected (optional, for OS install)

**CHECKPOINT 12**: Pre-power-on checks complete. Ready for first boot.

---

## Phase 11: First Boot & BIOS Configuration (30 minutes)

### First Power-On Procedure

**PSU Power-On**:

- [ ] Primary PSU power switch turned ON (rear of PSU)
- [ ] Secondary PSU power switch turned ON
- [ ] Both PSUs turned on simultaneously (Add2PSU sync)
- [ ] Motherboard LED lit up (power indicator)

**System Power-On**:

- [ ] Case power button pressed
- [ ] CPU fan spinning
- [ ] All case fans spinning (6 total)
- [ ] All GPU fans spinning (4 GPUs, 3 fans each = 12 fans)
- [ ] POST beep heard (single beep = success)
- [ ] No continuous beeps (error code)
- [ ] No burning smell detected
- [ ] No unusual sounds (grinding, clicking)

**Display Output**:

- [ ] ASUS splash screen displayed (5-10 seconds)
- [ ] "New CPU Installed" or "Memory Changed" message (normal)
- [ ] **DEL** or **F2** pressed to enter BIOS

**If No Display**:

- [ ] Waited 60 seconds (first boot takes longer)
- [ ] Verified monitor connected to GPU 1 (top GPU)
- [ ] Verified GPU power cables connected
- [ ] Verified monitor power and input selection
- [ ] Consulted POST troubleshooting section if needed

### BIOS Initial Configuration

#### 1. Memory Configuration

- [ ] Navigated to: AI Tweaker / Memory Settings
- [ ] Memory Frequency set: 5600 MHz (DDR5-5600)
- [ ] Memory Timing Mode set: Auto (XMP/EXPO)
- [ ] Memory Channel set: All (enable all 8 channels)
- [ ] **Verified**: 512GB total capacity detected

#### 2. PCIe Configuration

- [ ] Navigated to: Advanced → PCIe Configuration
- [ ] PCIe Slot 1 set: Gen 5, x16 mode
- [ ] PCIe Slot 3 set: Gen 5, x16 mode
- [ ] PCIe Slot 5 set: Gen 5, x16 mode
- [ ] PCIe Slot 7 set: Gen 5, x16 mode
- [ ] Above Board Decoding 4G: Enabled
- [ ] Resizable BAR: Enabled

#### 3. Storage Configuration

- [ ] Navigated to: Advanced → NVMe Configuration
- [ ] M.2_1 Enabled (990 PRO detected)
- [ ] M.2_2 Enabled (T705 #1 detected)
- [ ] M.2_3 Enabled (T705 #2 detected)

#### 4. Boot Configuration

- [ ] Navigated to: Boot → Boot Configuration
- [ ] Fast Boot: Disabled (for initial setup)
- [ ] Boot Logo: Enabled
- [ ] Boot Device Priority: M.2_1 (990 PRO) first

#### 5. Fan Control

- [ ] Navigated to: Monitor → Fan Control
- [ ] CPU Fan: PWM Mode, target 60°C
- [ ] CHA_FAN1: PWM Mode, target 50°C
- [ ] CHA_FAN2: PWM Mode, target 50°C
- [ ] CHA_FAN3: PWM Mode, target 50°C
- [ ] CHA_FAN4: PWM Mode, target 50°C
- [ ] CHA_FAN5: PWM Mode, target 50°C
- [ ] CHA_FAN6: PWM Mode, target 50°C
- [ ] Fan Curve: Aggressive (for industrial fans)

#### 6. Power Management

- [ ] Navigated to: Advanced → Power Management
- [ ] Power On By PCIe: Disabled
- [ ] Restore AC Power Loss: Power Off

#### 7. Security Settings

- [ ] Navigated to: Security
- [ ] Secure Boot: Disabled (for Linux compatibility)
- [ ] CSM: Enabled (legacy boot support)

### Save BIOS Settings

- [ ] **F10** pressed (Save & Exit)
- [ ] Changes confirmed
- [ ] System rebooted

### POST Verification (After Reboot)

- [ ] System booted faster (5-10 seconds to POST)
- [ ] All 8x RAM modules detected (512GB total shown)
- [ ] All 4x GPUs detected (checked PCIe device list)
- [ ] All 3x NVMe drives detected (checked boot device list)
- [ ] CPU temperature <40°C idle (checked in BIOS Monitor)
- [ ] All fan speeds showing (6 case + CPU fans)

**CHECKPOINT 13**: BIOS configured and POST verification complete. Ready for OS installation.

---

## Phase 12: Operating System Installation (30 minutes)

### Ubuntu 22.04 LTS Server Installation

**Bootable USB Creation**:

- [ ] Ubuntu 22.04 LTS Server ISO downloaded
- [ ] Bootable USB created (Rufus/dd)
- [ ] USB inserted into workstation

**Boot from USB**:

- [ ] System powered on
- [ ] **F8** pressed for boot menu
- [ ] USB drive selected
- [ ] Ubuntu installer loaded

**Installation Configuration**:

- [ ] Language selected
- [ ] Keyboard layout selected
- [ ] Network configured (optional, can skip)
- [ ] Install destination: Samsung 990 PRO 2TB (M.2_1)
- [ ] Partitioning scheme selected:
  - [ ] `/boot/efi`: 512MB (EFI System Partition)
  - [ ] `/`: 100GB (root partition)
  - [ ] `/home`: Remaining space
  - [ ] `swap`: 64GB (or none if preferring RAM)
- [ ] Hostname: `ai-workstation` (or custom: \_\_\_\_\_\_\_\_)
- [ ] User created: \_\_\_\_\_\_\_\_ (username)
- [ ] Password set (strong password)
- [ ] SSH server installed (recommended for headless)
- [ ] Installation started

**Post-Installation**:

- [ ] Installation completed successfully
- [ ] USB drive removed
- [ ] System rebooted
- [ ] Logged in via console or SSH

**System Verification**:

- [ ] Command: `lsblk` (verify all drives detected)
  - [ ] 990 PRO (2TB) detected as OS drive
  - [ ] T705 #1 (4TB) detected
  - [ ] T705 #2 (4TB) detected
- [ ] Command: `free -h` (verify 512GB RAM detected)
- [ ] Command: `lscpu` (verify 64 threads detected)

**CHECKPOINT 14**: OS installation complete. Ready for GPU driver installation.

---

## Phase 13: GPU Driver Installation (15 minutes)

### System Update

- [ ] Command: `sudo apt update` (update package lists)
- [ ] Command: `sudo apt upgrade -y` (upgrade packages)
- [ ] Updates installed successfully

### NVIDIA Driver Installation

- [ ] Command: `sudo apt install -y nvidia-driver-550` (or latest)
- [ ] Driver installation completed
- [ ] Command: `sudo apt install -y nvidia-cuda-toolkit` (CUDA)
- [ ] CUDA toolkit installed
- [ ] Command: `sudo reboot` (reboot system)

### GPU Verification (After Reboot)

- [ ] Logged in after reboot
- [ ] Command: `nvidia-smi` executed

**Expected Output Verification**:

- [ ] Driver Version: 550+ (or installed version)
- [ ] CUDA Version: 12.4+ shown
- [ ] GPU 0 detected: NVIDIA GeForce RTX 4090
- [ ] GPU 1 detected: NVIDIA GeForce RTX 4090
- [ ] GPU 2 detected: NVIDIA GeForce RTX 4090
- [ ] GPU 3 detected: NVIDIA GeForce RTX 4090
- [ ] All GPU temperatures <50°C idle
- [ ] No error messages in output

**Additional Verification**:

- [ ] Command: `dmesg | grep -i nvidia` (check for errors)
- [ ] No critical errors found
- [ ] Command: `lspci | grep -i nvidia` (verify PCIe detection)
- [ ] All 4 GPUs listed

**CHECKPOINT 15**: GPU drivers installed and verified. Ready for stress testing.

---

## Phase 14: Stress Testing (60+ minutes)

> **WARNING**: Monitor temperatures continuously during stress testing.

### CPU Stress Test (30 minutes)

**Install Stress Tools**:

- [ ] Command: `sudo apt install -y stress-ng` (stress test tool)
- [ ] Command: `sudo apt install -y lm-sensors` (temperature monitoring)
- [ ] Command: `sudo sensors-detect` (auto-detect sensors, accept defaults)

**Run CPU Stress Test**:

- [ ] Terminal 1: `stress-ng --cpu 64 --timeout 30m --metrics-brief`
- [ ] Terminal 2: `watch -n 1 'sensors | grep -E "CPU|Tdie"'`
- [ ] Stress test started
- [ ] Temperature monitoring active

**CPU Stress Test Results** (After 30 min):

- [ ] Peak CPU temperature: \_\_\_\_\_°C (target: <90°C)
- [ ] Average CPU temperature: \_\_\_\_\_°C (target: <85°C)
- [ ] No throttling observed (clock speeds stable)
- [ ] No system crashes/freezes
- [ ] All 64 threads active (verified with `htop`)

### GPU Stress Test (60 minutes)

**Install GPU Stress Tool**:

- [ ] Command: `sudo apt install -y gpu-burn` (GPU stress test)

**Run GPU Stress Test** (All 4 GPUs Simultaneously):

- [ ] Terminal 1: `CUDA_VISIBLE_DEVICES=0 gpu-burn 3600` (GPU 0, 60 min)
- [ ] Terminal 2: `CUDA_VISIBLE_DEVICES=1 gpu-burn 3600` (GPU 1, 60 min)
- [ ] Terminal 3: `CUDA_VISIBLE_DEVICES=2 gpu-burn 3600` (GPU 2, 60 min)
- [ ] Terminal 4: `CUDA_VISIBLE_DEVICES=3 gpu-burn 3600` (GPU 3, 60 min)
- [ ] Terminal 5: `watch -n 1 nvidia-smi` (monitoring)

**GPU Stress Test Results** (After 60 min):

**GPU 0**:

- [ ] Peak temperature: \_\_\_\_\_°C (target: <85°C)
- [ ] Average temperature: \_\_\_\_\_°C (target: <80°C)
- [ ] Power draw: \_\_\_\_\_W (typical: 400-450W)
- [ ] No throttling (clocks stable)
- [ ] No artifacts or crashes
- [ ] Memory errors: 0 (verified)

**GPU 1**:

- [ ] Same verification as GPU 0

**GPU 2**:

- [ ] Same verification as GPU 0

**GPU 3**:

- [ ] Same verification as GPU 0

**System-Wide Stress Verification**:

- [ ] All 4 GPUs stressed simultaneously
- [ ] Total GPU power draw: \_\_\_\_\_W (expected: 1600-1800W)
- [ ] PSU load within limits (Primary: <1400W, Secondary: <900W)
- [ ] No system crashes or freezes
- [ ] Case exterior cool to touch (<40°C)

### Temperature Summary

- [ ] CPU idle: \_\_\_\_\_°C (target: <40°C)
- [ ] CPU load: \_\_\_\_\_°C (target: <85°C)
- [ ] GPU 0 idle: \_\_\_\_\_°C (target: <50°C)
- [ ] GPU 0 load: \_\_\_\_\_°C (target: <80°C)
- [ ] GPU 1-3 similar to GPU 0
- [ ] Motherboard VRM: \_\_\_\_\_°C (target: <80°C)

**CHECKPOINT 16**: Stress testing complete. System stable under full load.

---

## Phase 15: Final Quality Assurance (30 minutes)

### Hardware Physical Inspection

**Component Security**:

- [ ] All components secured (no loose screws/parts)
- [ ] No visible damage to any components
- [ ] All cables connected and secured
- [ ] Cable management clean (no airflow blocking)
- [ ] GPU support brackets installed (no sag observed)
- [ ] All case panels fit properly (no gaps)

**Power System**:

- [ ] Both PSUs operational under load
- [ ] Add2PSU synchronization working (both PSUs on/off together)
- [ ] All power cables fully inserted (24-pin, EPS, GPU connectors)
- [ ] No burning smell detected
- [ ] No excessive heat from PSUs
- [ ] PSU fans spinning under load

**Cooling System**:

- [ ] All 6 case fans operational (spin test)
- [ ] CPU cooler fan operational
- [ ] All 4 GPU fans operational (12 fans total)
- [ ] Airflow direction correct (front→rear, bottom→top)
- [ ] No fan cables touching fan blades
- [ ] CPU cooler secure (no wobble)

### Software Verification

**BIOS Settings Review**:

- [ ] All 8 memory channels active (512GB total)
- [ ] All PCIe slots configured correctly (x16 mode)
- [ ] Above 4G Decoding enabled
- [ ] Resizable BAR enabled
- [ ] Boot order correct (990 PRO first)
- [ ] Fan curves configured (aggressive for 24/7 operation)

**Operating System**:

- [ ] Ubuntu 22.04 LTS installed and updated
- [ ] All 3 drives mounted and accessible:
  - [ ] / (root) on 990 PRO
  - [ ] /home on 990 PRO
  - [ ] T705 #1 accessible
  - [ ] T705 #2 accessible
- [ ] Network connectivity verified (ping test)
- [ ] SSH access configured and tested (if headless)

**GPU Configuration**:

- [ ] NVIDIA driver installed: Version \_\_\_\_\_
- [ ] CUDA toolkit installed: Version \_\_\_\_\_
- [ ] All 4 GPUs detected in `nvidia-smi`
- [ ] GPU temperatures normal (<50°C idle)
- [ ] No GPU errors in `dmesg | grep -i nvidia`
- [ ] PCIe generation verified: Gen 5 for all GPUs

### Performance Baseline Verification

**Component Performance**:

- [ ] CPU benchmark run (Cinebench R23 or similar)
  - [ ] Multi-core score: \_\_\_\_\_\_\_ (expected: >100,000)
- [ ] GPU benchmark run (3DMark Time Spy or similar)
  - [ ] GPU 0 score: \_\_\_\_\_\_\_
  - [ ] GPU 1 score: \_\_\_\_\_\_\_
  - [ ] GPU 2 score: \_\_\_\_\_\_\_
  - [ ] GPU 3 score: \_\_\_\_\_\_\_
- [ ] Memory bandwidth test (AIDA64 or similar)
  - [ ] Bandwidth: \_\_\_\_\_\_ GB/s (expected: >400 GB/s)
- [ ] Storage performance test (fio or CrystalDiskMark)
  - [ ] 990 PRO read: \_\_\_\_\_\_ MB/s (expected: >7000)
  - [ ] T705 #1 read: \_\_\_\_\_\_ MB/s (expected: >14000)
  - [ ] T705 #2 read: \_\_\_\_\_\_ MB/s (expected: >14000)

**Stress Test Summary**:

- [ ] CPU stress test: 30 min, <90°C, no throttling
- [ ] GPU stress test: 60 min each, <85°C, no errors
- [ ] Combined stress test: All components stable
- [ ] No system crashes or freezes during testing

### Safety & Reliability Verification

**Electrical Safety**:

- [ ] No exposed wiring or connections
- [ ] All ground pins connected (3-prong plugs verified)
- [ ] Power distribution adequate (not overloaded circuits)
- [ ] Surge protection on all power connections

**Thermal Safety**:

- [ ] Case exterior cool to touch (<40°C)
- [ ] No hot spots on case (hand check or IR thermometer)
- [ ] Room ventilation adequate (ambient temp <25°C)
- [ ] Clearance around case (6" minimum all sides maintained)

**Long-Term Reliability Setup**:

- [ ] All firmware updated:
  - [ ] BIOS version: \_\_\_\_\_\_\_ (latest recommended)
  - [ ] GPU firmware: \_\_\_\_\_\_\_
  - [ ] Network card firmware: \_\_\_\_\_\_\_
- [ ] Monitoring software installed:
  - [ ] `lm-sensors` for temperature monitoring
  - [ ] `nvidia-smi` for GPU monitoring
  - [ ] `htop` for CPU/RAM monitoring
- [ ] Backup power solution planned:
  - [ ] UPS model (if applicable): \_\_\_\_\_\_\_
  - [ ] UPS capacity: \_\_\_\_\_W (minimum 2600W recommended)
- [ ] Documentation complete:
  - [ ] Build log saved (photos, notes)
  - [ ] Serial numbers recorded (all components)
  - [ ] Warranty information organized
  - [ ] BIOS settings exported (if possible)

### Final Component Inventory (Serial Numbers)

**Record for Warranty/RMA Purposes**:

- [ ] CPU S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] Motherboard S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] GPU 1 S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] GPU 2 S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] GPU 3 S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] GPU 4 S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] Primary PSU S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] Secondary PSU S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] 990 PRO S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] T705 #1 S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_
- [ ] T705 #2 S/N: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**CHECKPOINT 17**: Final QA complete. System ready for production use.

---

## Build Completion Summary

### Total Build Time

- [ ] Pre-assembly: \_\_\_\_\_ min
- [ ] Phase 1-9 (Hardware): \_\_\_\_\_ min
- [ ] Phase 10-15 (Software/Testing): \_\_\_\_\_ min
- [ ] **Total Time**: \_\_\_\_\_ hours (expected: 6-8 hours)

### System Specifications Achieved

- [ ] **CPU**: AMD Threadripper PRO 7975WX (32C/64T)
- [ ] **Memory**: 512GB DDR5-5600 ECC (8x 64GB)
- [ ] **GPUs**: 4x NVIDIA RTX 4090 24GB (96GB total VRAM)
- [ ] **Storage**: 2TB + 8TB NVMe (10TB total)
- [ ] **Power**: Dual PSU (2600W total capacity)
- [ ] **Network**: 25GbE (Mellanox ConnectX-4 Lx)
- [ ] **OS**: Ubuntu 22.04 LTS Server

### Performance Verification

- [ ] All components detected and functional
- [ ] Temperatures within spec under load
- [ ] No errors during stress testing
- [ ] Benchmark scores within expected range
- [ ] System stable for 24/7 operation

### Documentation Complete

- [ ] Build photos taken (all major steps)
- [ ] Serial numbers recorded
- [ ] BIOS settings documented
- [ ] Benchmark results saved
- [ ] Maintenance schedule established

---

## Post-Build Recommendations

### Immediate Next Steps (First 48 Hours)

- [ ] Run extended burn-in (24+ hours CPU+GPU stress)
- [ ] Monitor temperatures hourly (first 24 hours)
- [ ] Check for any unusual sounds/smells
- [ ] Verify system stability (no random crashes)

### First Week

- [ ] Install AI/ML software stack (vLLM, ExLlamaV2, etc.)
- [ ] Configure monitoring scripts (automate temp/GPU checks)
- [ ] Test actual workload (model inference)
- [ ] Fine-tune fan curves based on actual usage

### First Month

- [ ] Review temperature trends (detect degradation)
- [ ] Clean dust filters (check buildup rate)
- [ ] Verify all components still under warranty
- [ ] Consider UPS installation (if not already)

### Ongoing Maintenance Schedule

- [ ] **Daily**: Automated monitoring (temps, GPU status)
- [ ] **Weekly**: Manual inspection, update check
- [ ] **Monthly**: Dust filter cleaning, cable check
- [ ] **Quarterly**: Deep cleaning, thermal paste check
- [ ] **Annually**: Thermal paste replacement, fan replacement (if needed)

---

## Troubleshooting Quick Reference

### System Won't Power On

1. [ ] Verify both PSU switches ON
2. [ ] Check wall outlet power
3. [ ] Verify Add2PSU connections
4. [ ] Test PSU independently (jumper test)
5. [ ] Check front panel power button connection

### No Display Output

1. [ ] Verify monitor connected to GPU 1 (top)
2. [ ] Check GPU power cables (12VHPWR)
3. [ ] Verify monitor input source
4. [ ] Try different display cable/port
5. [ ] Reseat GPU 1

### Some GPUs Not Detected

1. [ ] Enable "Above 4G Decoding" in BIOS
2. [ ] Verify all GPU power cables connected
3. [ ] Check BIOS PCIe settings (all x16 mode)
4. [ ] Reseat missing GPU(s)
5. [ ] Test GPU in different slot

### High Temperatures

1. [ ] Verify all fans spinning (case, CPU, GPU)
2. [ ] Check fan curves (may need more aggressive)
3. [ ] Verify case airflow (front→rear, bottom→top)
4. [ ] Clean dust filters (front intake)
5. [ ] Check CPU cooler mounting (may need reseat)

### Random Crashes/Freezes

1. [ ] Check memory: `memtest86+` (boot from USB)
2. [ ] Verify PSU capacity sufficient (monitor power draw)
3. [ ] Check system logs: `dmesg` and `/var/log/syslog`
4. [ ] Test GPUs individually (remove 3, test with 1)
5. [ ] Update BIOS firmware (stability improvements)

---

## Emergency Contact Information

**Component Manufacturer Support**:

- **ASUS** (Motherboard): 1-888-678-3688 | support.asus.com
- **AMD** (CPU): 1-877-284-1566 | amd.com/support
- **NVIDIA** (GPUs): 1-800-797-6530 | nvidia.com/support
- **EVGA** (PSUs): 1-888-881-3842 | evga.com/support
- **Samsung** (990 PRO): 1-800-726-7864 | samsung.com/support
- **Crucial** (T705): 1-800-336-8896 | crucial.com/support

**Emergency Shutdown Procedure**:

1. Press and hold power button (5+ seconds)
2. If system doesn't shut down: Switch off both PSUs
3. If smoke/fire: Unplug both PSUs immediately
4. If fire persists: Use Class C fire extinguisher
5. Evacuate area if fire spreads

---

## Build Certification

**I certify that**:

- [ ] All checklist items completed
- [ ] All components installed correctly
- [ ] All safety checks passed
- [ ] System stable under stress testing
- [ ] Documentation complete

**Builder Name**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Build Date**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

**Build Time**: \_\_\_\_\_\_ hours

**Signature**: \_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_\_

---

**END OF ASSEMBLY SEQUENCE CHECKLIST**

_This checklist is designed to be printed and used during assembly. Check off each item as completed. Keep this document with your build documentation for future reference and maintenance._
