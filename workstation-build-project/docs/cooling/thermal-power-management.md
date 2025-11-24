# Thermal & Power Management

## 4x RTX 4090 AI Workstation

**System Profile**: 2200W sustained load, 24/7 operation, datacenter-grade cooling requirements

---

## 1. Power Budget Breakdown

### Total System Power: 2200W Sustained

| Component                   | Power Draw | Notes                         |
| --------------------------- | ---------- | ----------------------------- |
| **4x RTX 4090**             | 1800W      | 450W TDP each at full load    |
| **Threadripper PRO 7975WX** | 350W       | 280W TDP + transient spikes   |
| **Motherboard & VRMs**      | 50W        | ASUS Pro WS WRX90E-SAGE SE    |
| **Memory (512GB DDR5)**     | 80W        | 8x 64GB ECC DIMMs @ 10W each  |
| **Storage (3x NVMe)**       | 30W        | 990 PRO + 2x T705 drives      |
| **Cooling Fans**            | 36W        | 6x Noctua iPPC-3000 @ 6W each |
| **Network/Accessories**     | 25W        | 25GbE NIC, PiKVM, misc        |
| **Motherboard I/O**         | 30W        | USB, audio, lighting, sensors |
| **Total Peak**              | **2401W**  |                               |
| **Sustained 24/7**          | **~2200W** | Average under AI workloads    |

### Power Headroom Analysis

- **Peak Transient**: 2600W (GPU power spikes + CPU boost)
- **Sustained Load**: 2200W (91.7% of dual PSU capacity)
- **Idle Power**: ~250W (GPUs idle, CPU C-states)

---

## 2. Dual PSU Load Balancing

### Configuration

```
Primary PSU: EVGA SuperNOVA 1600 T2 (Titanium)
├─ 2x RTX 4090 (900W)
├─ Motherboard 24-pin + 2x 8-pin EPS (400W)
└─ Storage/Fans (60W)
Total: 1360W (85% load)

Secondary PSU: EVGA SuperNOVA 1000 T2 (Titanium)
├─ 2x RTX 4090 (900W)
└─ Reserve capacity
Total: 900W (90% load)

Synchronization: Add2PSU adapter (starts both PSUs simultaneously)
```

### Load Distribution Strategy

**Primary PSU (1600W)**:

- Motherboard 24-pin ATX power
- 2x 8-pin EPS12V (CPU power)
- GPU 1 & GPU 2: 3x 8-pin PCIe each
- All NVMe drives
- All case fans

**Secondary PSU (1000W)**:

- GPU 3 & GPU 4: 3x 8-pin PCIe each
- No motherboard connections

### PSU Efficiency Curve

```
Load %    | Efficiency | Heat Generated
----------|-----------|----------------
20-30%    | 91-92%    | Low
50-80%    | 94%+      | Optimal (Target Zone)
85-100%   | 92-93%    | Higher heat
```

**Target Operating Point**: 80-85% load for optimal efficiency

### Cable Management for Power

- **18 AWG cables minimum** for GPU power (preferred: 16 AWG)
- **Separate PCIe cables** per GPU (no daisy-chaining)
- **GPU 1-2**: Primary PSU, top PCIe cable runs
- **GPU 3-4**: Secondary PSU, bottom cable runs
- **Cable routing**: Opposite side panel for cleaner airflow

---

## 3. Cooling Architecture

### Case: Phanteks Enthoo Pro 2 Server Edition

**Airflow Design**: Front-to-back positive pressure

```
Front Intake (3x 140mm Noctua iPPC-3000)
    ↓
    ↓  Cold air → GPU Zone 1 (GPU 1-2)
    ↓            GPU Zone 2 (GPU 3-4)
    ↓            CPU Zone
    ↓
Top Exhaust (2x 140mm Noctua iPPC-3000)
    ↑
    ↑  Hot air ← Rises from GPUs/CPU
    ↑
Rear Exhaust (1x 140mm Noctua iPPC-3000)
```

### Fan Specifications: Noctua iPPC-3000 PWM 140mm

| Metric              | Value                |
| ------------------- | -------------------- |
| **Max RPM**         | 3000 RPM             |
| **Airflow**         | 158.5 CFM @ 3000 RPM |
| **Static Pressure** | 7.63 mmH₂O           |
| **Noise**           | 43.5 dBA @ 3000 RPM  |
| **Bearing**         | SSO2 (150,000h MTTF) |
| **Power**           | 6W max per fan       |
| **PWM Range**       | 800-3000 RPM         |

### Total Cooling Capacity

- **Combined Airflow**: 950 CFM (6x 158.5 CFM)
- **Heat Dissipation**: ~2400W thermal capacity
- **Air Changes**: ~80 ACH (air changes per hour)

### Dust Management

- **Magnetic dust filters**: Front intake (clean monthly)
- **Positive pressure**: Prevents dust infiltration
- **Industrial fans**: Built-in dust resistance

---

## 4. Thermal Zones & GPU Thermal Management

### Thermal Zone Mapping

```
┌─────────────────────────────────────┐
│  Front Intake (Cold: 22-25°C)      │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │  GPU 1   │  │  GPU 2   │ Zone 1│
│  │  ~75°C   │  │  ~78°C   │       │
│  └──────────┘  └──────────┘       │
│                                     │
│  ┌──────────┐  ┌──────────┐       │
│  │  GPU 3   │  │  GPU 4   │ Zone 2│
│  │  ~80°C   │  │  ~82°C   │       │
│  └──────────┘  └──────────┘       │
│                                     │
│       CPU Zone (~70°C)              │
│                                     │
│  Top/Rear Exhaust (Hot: 45-55°C)   │
└─────────────────────────────────────┘
```

### GPU Thermal Characteristics

**RTX 4090 Thermal Limits**:

- **TDP**: 450W per GPU
- **Max Junction Temp**: 90°C (thermal throttle point)
- **Target Temp**: 75-83°C under sustained load
- **Idle Temp**: 35-45°C
- **Memory Junction**: 95°C max (GDDR6X runs hot)

### Expected Thermal Gradient

1. **GPU 1** (top front): Coolest, 75-78°C
2. **GPU 2** (top rear): +3°C, 78-81°C
3. **GPU 3** (bottom front): +5°C, 80-83°C
4. **GPU 4** (bottom rear): Hottest, +7°C, 82-85°C

**Reasoning**: Heat rises, rear GPUs receive pre-heated air

### GPU Spacing & Airflow

- **3-slot spacing** between GPUs on motherboard
- **PNY RTX 4090 XLR8**: 2.5-slot design (reference PCB)
- **Airflow gap**: ~30mm between cards
- **Each GPU**: Independent triple-fan cooler

### Thermal Interface Material

- **GPU Die**: Factory thermal paste (do not replace under warranty)
- **Thermal Pad Maintenance**: Check VRAM pads annually
- **Thermal Grizzly Kryonaut**: For CPU cooler mounting

---

## 5. Temperature Monitoring & Fan Curves

### Monitoring Tools

**Hardware Monitoring**:

```bash
# NVIDIA GPUs
nvidia-smi -l 1  # 1-second polling
nvidia-smi -q -d TEMPERATURE,POWER

# CPU/Motherboard
sensors  # lm-sensors package
watch -n1 sensors

# Comprehensive monitoring
btop  # Modern system monitor
```

**Recommended Dashboard**: Prometheus + Grafana

```yaml
Metrics to track:
  - GPU temperature (per GPU)
  - GPU power draw (per GPU)
  - GPU memory temperature
  - CPU temperature (per CCD)
  - Case fan RPM
  - PSU temperature (if supported)
  - Ambient room temperature
```

### Temperature Targets

| Component      | Idle    | Load    | Max Safe | Critical |
| -------------- | ------- | ------- | -------- | -------- |
| **GPU Core**   | 35-45°C | 75-83°C | 87°C     | 90°C     |
| **GPU Memory** | 40-50°C | 85-92°C | 95°C     | 100°C    |
| **CPU (Tctl)** | 40-50°C | 65-75°C | 85°C     | 95°C     |
| **VRM**        | 50-60°C | 70-85°C | 95°C     | 105°C    |
| **NVMe**       | 35-45°C | 55-65°C | 75°C     | 85°C     |
| **Ambient**    | 22-24°C | 24-28°C | 30°C     | 32°C     |

### Fan Curve Configuration

**Conservative 24/7 Profile** (balanced noise/cooling):

```
Case Fans (PWM via motherboard):
  Temp (°C)  | Fan RPM | % Speed | Noise
  -----------|---------|---------|-------
  < 40       | 800     | 27%     | Silent
  40-50      | 1200    | 40%     | Quiet
  50-60      | 1800    | 60%     | Moderate
  60-70      | 2400    | 80%     | Audible
  > 70       | 3000    | 100%    | Loud

Trigger: Max(GPU1, GPU2, GPU3, GPU4) temperature
```

**Performance Profile** (maximum cooling):

```
  Temp (°C)  | Fan RPM | % Speed
  -----------|---------|--------
  < 50       | 1500    | 50%
  50-60      | 2100    | 70%
  > 60       | 3000    | 100%
```

**Quiet Profile** (reduced acoustics):

```
  Temp (°C)  | Fan RPM | % Speed | Max Temp
  -----------|---------|---------|----------
  < 45       | 800     | 27%     | GPUs: 85°C
  45-55      | 1200    | 40%     | (higher temps)
  55-70      | 1800    | 60%     |
  > 70       | 2400    | 80%     |
```

### Fan Control Implementation

**Linux fancontrol setup**:

```bash
# Install pwmconfig
sudo apt install lm-sensors fancontrol

# Detect sensors
sudo sensors-detect

# Configure fan curves
sudo pwmconfig

# Enable service
sudo systemctl enable fancontrol
sudo systemctl start fancontrol
```

**Custom Python script** (advanced):

```python
# /usr/local/bin/thermal-manager.py
import subprocess
import time

def get_max_gpu_temp():
    # Parse nvidia-smi output
    result = subprocess.run(['nvidia-smi', '--query-gpu=temperature.gpu',
                           '--format=csv,noheader'],
                          capture_output=True, text=True)
    temps = [int(t) for t in result.stdout.strip().split('\n')]
    return max(temps)

def set_fan_speed(percent):
    # Set PWM via sysfs
    pwm_value = int(255 * percent / 100)
    with open('/sys/class/hwmon/hwmon2/pwm1', 'w') as f:
        f.write(str(pwm_value))

# Fan curve logic
while True:
    max_temp = get_max_gpu_temp()
    if max_temp < 40:
        set_fan_speed(27)
    elif max_temp < 50:
        set_fan_speed(40)
    elif max_temp < 60:
        set_fan_speed(60)
    elif max_temp < 70:
        set_fan_speed(80)
    else:
        set_fan_speed(100)
    time.sleep(5)
```

### Alert Thresholds

```yaml
Warning Alerts:
  - GPU temp > 85°C
  - CPU temp > 80°C
  - VRM temp > 90°C
  - Any fan RPM = 0 (failure)
  - GPU power throttling detected

Critical Alerts:
  - GPU temp > 88°C (approaching throttle)
  - CPU temp > 90°C
  - Multiple fan failures
  - PSU over-temperature protection triggered
```

---

## 6. UPS Recommendations

### Power Requirements

**UPS Sizing Calculation**:

```
System Load: 2200W sustained
Recommended UPS: 3000VA / 2700W minimum

Runtime Target: 10 minutes (graceful shutdown)
Battery Capacity: ~2.5 kWh minimum
```

### Recommended Models

#### Option 1: APC Smart-UPS SRT 3000VA (Preferred)

- **Model**: SRT3000XLW
- **Capacity**: 3000VA / 2700W
- **Runtime**: ~8 minutes @ 2200W load
- **Features**:
  - Pure sine wave output
  - Network management card (remote monitoring)
  - Hot-swappable batteries
  - LCD display
  - USB/network monitoring
- **Cost**: ~$2,200
- **Battery Expansion**: Add SRT192BP2 for 20+ min runtime (+$2,000)

#### Option 2: CyberPower PR3000LCDRTXL2U

- **Capacity**: 3000VA / 2700W
- **Runtime**: ~10 minutes @ 2200W
- **Features**: Similar to APC, slightly lower cost
- **Cost**: ~$1,600

#### Option 3: Eaton 5PX 3000VA

- **Model**: 5PX3000RT
- **Capacity**: 3000VA / 2700W
- **Runtime**: ~9 minutes @ 2200W
- **Features**: Enterprise-grade, excellent software
- **Cost**: ~$2,000

### UPS Configuration Best Practices

**What to Connect**:

- ✅ Entire workstation (both PSUs)
- ✅ Primary network switch
- ✅ NAS/storage servers (if applicable)
- ❌ Monitor (not critical for headless)
- ❌ Peripherals

**Setup Requirements**:

```bash
# Install UPS monitoring software
sudo apt install apcupsd  # For APC UPS

# Configure auto-shutdown
sudo nano /etc/apcupsd/apcupsd.conf

# Key settings:
BATTERYLEVEL 20      # Shutdown at 20% battery
MINUTES 5            # Or 5 minutes remaining
TIMEOUT 0            # No delay
```

**Shutdown Script** (`/etc/apcupsd/doshutdown`):

```bash
#!/bin/bash
# Graceful AI workload shutdown

# Stop inference services
systemctl stop ollama vllm jupyter

# Save GPU state (if training)
# pkill -SIGTERM python  # Send termination signal

# Wait for processes
sleep 30

# System shutdown
shutdown -h now
```

### Runtime Calculation

**Power Draw Stages During Outage**:

1. **0-30 seconds**: Full 2200W load (normal operation)
2. **30-60 seconds**: 1800W (shutdown initiated, GPUs idle)
3. **60-120 seconds**: 500W (processes terminating)
4. **120+ seconds**: 100W (OS shutdown)

**Effective Runtime**: 10-15 minutes for graceful shutdown

### Alternative: Battery-Free Solutions

**For Stable Power Environments**:

- **High-quality surge protector**: Tripp Lite Isobar 12-outlet
- **Whole-home generator**: For extended outage protection
- **Redundant power feeds**: If datacenter/commercial space

**Risk Assessment**:

- **With UPS**: 99.9% protection against power loss data corruption
- **Without UPS**: Risk of:
  - GPU VRAM corruption during training
  - File system corruption on NVMe drives
  - PSU damage from voltage spikes
  - Loss of unsaved work

### Monitoring & Maintenance

**UPS Health Checks**:

```bash
# Check UPS status
apcaccess status

# Key metrics:
# - Battery voltage
# - Time on battery
# - Load percentage
# - Estimated runtime
```

**Battery Maintenance**:

- **Lifespan**: 3-5 years typical
- **Self-test**: Monthly automatic test
- **Manual test**: Quarterly recommended
- **Replacement**: $300-500 for battery module

**UPS Placement**:

- **Location**: Well-ventilated area
- **Clearance**: 6" on all sides for cooling
- **Temperature**: 20-25°C optimal (battery life)
- **Humidity**: 20-80% non-condensing

---

## 7. Thermal Emergency Procedures

### Overheat Response Protocol

**Tier 1: Warning (GPU > 85°C)**

```bash
# Increase fan speed to 100%
nvidia-smi -pl 400  # Reduce power limit to 400W per GPU

# Monitor for 5 minutes
watch -n1 nvidia-smi
```

**Tier 2: Critical (GPU > 88°C)**

```bash
# Reduce workload immediately
# Stop non-critical inference tasks

# Force power limit reduction
nvidia-smi -pl 350  # 350W per GPU

# Check for cooling failures
sensors  # Verify fans running
```

**Tier 3: Emergency Shutdown (GPU > 90°C)**

```bash
# Immediate graceful shutdown
sudo shutdown -h +1 "Thermal emergency - system cooling down"

# Or force stop GPUs
sudo systemctl stop display-manager
sudo rmmod nvidia_uvm nvidia_drm nvidia_modeset nvidia
```

### Common Thermal Issues & Solutions

| Problem                | Symptom                 | Solution                              |
| ---------------------- | ----------------------- | ------------------------------------- |
| **Fan failure**        | RPM = 0                 | Replace immediately, reduce GPU power |
| **Dust buildup**       | Rising temps over weeks | Clean filters, compressed air         |
| **GPU thermal paste**  | One GPU much hotter     | RMA if under warranty                 |
| **Ambient too hot**    | All temps elevated      | Improve room AC, reduce power         |
| **PCIe spacing issue** | Bottom GPU hot          | Verify 3-slot spacing, check airflow  |
| **PSU overheating**    | System instability      | Check PSU fan, reduce load            |

### Preventive Maintenance Schedule

**Weekly**:

- Monitor temperature trends
- Check fan RPMs

**Monthly**:

- Clean front dust filters
- Verify UPS battery status
- Check GPU thermal throttling logs

**Quarterly**:

- Full system dust cleaning (compressed air)
- Verify thermal paste condition (visual check)
- Test UPS runtime

**Annually**:

- Replace thermal paste (CPU)
- Deep clean case interior
- Inspect all fan bearings
- Consider GPU thermal pad replacement (out of warranty)

---

## 8. Performance Optimization Tips

### Thermal-Aware Workload Scheduling

**Staggered GPU Utilization**:

```python
# Instead of loading all GPUs simultaneously
# Stagger inference requests across GPUs
# Reduces peak thermal load

# Bad: All 4 GPUs spike to 450W instantly
# Good: Gradual ramp-up over 30 seconds
```

**Time-of-Day Considerations**:

- **Night hours**: Lower ambient temp, can push harder
- **Summer afternoons**: Highest ambient, use conservative power limits
- **Weekend vs. weekday**: Adjust for office HVAC schedules

### Power Limit Tuning for Efficiency

**Performance vs. Efficiency**:

```
RTX 4090 Power Scaling:
  450W (100%): 100% performance (1.00 perf/watt)
  400W (89%):  95% performance (1.19 perf/watt) ← Sweet spot
  350W (78%):  88% performance (1.26 perf/watt)
  300W (67%):  78% performance (1.30 perf/watt)
```

**Recommended for 24/7 Operation**:

```bash
# Set all GPUs to 400W for optimal efficiency
nvidia-smi -pl 400

# Persist across reboots
sudo nvidia-persistenced --persistence-mode
```

### Room HVAC Requirements

**Cooling Load Calculation**:

```
System Heat Output: 2200W = 7,500 BTU/hr

Room AC Requirements:
- Dedicated AC: 12,000 BTU/hr minimum (1-ton unit)
- For 10x12 room: 18,000 BTU/hr recommended (1.5-ton)
- Commercial space: Ensure datacenter-grade HVAC
```

**Ideal Room Conditions**:

- **Temperature**: 20-24°C (68-75°F)
- **Humidity**: 30-50% RH
- **Air circulation**: Ceiling fan or room exhaust

---

## Quick Reference Card

```
SYSTEM POWER PROFILE
────────────────────────────────────
Total Power:      2200W sustained
Peak Power:       2600W transient
Idle Power:       250W
Cooling Capacity: 2400W thermal

GPU TEMPERATURE TARGETS
────────────────────────────────────
Normal:    75-83°C
Warning:   85-87°C
Critical:  88°C+
Throttle:  90°C

FAN SPEEDS (Conservative Profile)
────────────────────────────────────
<40°C:  800 RPM  (27% / Silent)
40-50°C: 1200 RPM (40% / Quiet)
50-60°C: 1800 RPM (60% / Moderate)
60-70°C: 2400 RPM (80% / Loud)
>70°C:  3000 RPM (100% / Max)

UPS RECOMMENDATIONS
────────────────────────────────────
Minimum:  3000VA / 2700W
Runtime:  10 minutes
Models:   APC SRT3000XLW ($2,200)
          CyberPower PR3000LCDRTXL2U ($1,600)

EMERGENCY COMMANDS
────────────────────────────────────
GPU Status:       nvidia-smi
Reduce GPU Power: nvidia-smi -pl 350
Monitor Temps:    watch -n1 sensors
Fan Control:      pwmconfig
Emergency Stop:   shutdown -h +1
```

---

## Appendix: Thermal Calculations

### Heat Dissipation Math

```
Q = m × c × ΔT

Where:
Q = Heat energy (Watts)
m = Mass flow rate of air (kg/s)
c = Specific heat of air (1005 J/kg·K)
ΔT = Temperature rise (K)

For 2200W heat load:
2200W = m × 1005 × ΔT

With 950 CFM (0.448 m³/s) airflow:
m = 0.448 m³/s × 1.2 kg/m³ = 0.538 kg/s

Temperature rise:
ΔT = 2200 / (0.538 × 1005) = 4.07°C

Exhaust air: Ambient + 4°C (theoretical)
Actual: ~20-30°C rise due to local hot spots
```

### CFM Requirements

```
Rule of thumb: 1W = 3.16 CFM (with 10°F rise)

For 2200W:
Required CFM = 2200 × 3.16 = 6,952 CFM

Actual fans: 950 CFM (6x 158.5)

Gap explanation:
- GPUs have local coolers (not counted)
- Case fans are supplementary
- Positive pressure design (lower effective CFM)
```

---

**Document Version**: 1.0
**Last Updated**: 2025-11-02
**Author**: Thermal & Power Management Engineer
**System Configuration**: 4x RTX 4090, Threadripper PRO 7975WX, Dual PSU
