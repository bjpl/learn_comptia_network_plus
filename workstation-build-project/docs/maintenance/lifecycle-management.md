# Workstation Lifecycle Management Guide

**Document Version:** 1.0
**Last Updated:** 2025-11-02
**Target Lifespan:** 5+ Years (24/7 Operation)
**System Type:** High-Performance Workstation (AMD Ryzen 9 9950X, RTX 4090)

---

## Table of Contents

1. [Maintenance Schedules](#maintenance-schedules)
2. [Component Health Monitoring](#component-health-monitoring)
3. [Firmware & Driver Management](#firmware--driver-management)
4. [Storage Health & Longevity](#storage-health--longevity)
5. [Thermal Management](#thermal-management)
6. [Physical Maintenance](#physical-maintenance)
7. [Performance Monitoring](#performance-monitoring)
8. [Upgrade Paths](#upgrade-paths)
9. [Technology Refresh Timeline](#technology-refresh-timeline)
10. [Spare Parts & Inventory](#spare-parts--inventory)
11. [Troubleshooting Decision Trees](#troubleshooting-decision-trees)
12. [Common Failure Modes](#common-failure-modes)
13. [Disaster Recovery](#disaster-recovery)
14. [End-of-Life Planning](#end-of-life-planning)

---

## 1. Maintenance Schedules

### Daily Maintenance (Automated)

**Time Required:** 5 minutes

| Task                 | Description                                | Tools                     | Acceptance Criteria                                    |
| -------------------- | ------------------------------------------ | ------------------------- | ------------------------------------------------------ |
| Temperature Check    | Monitor CPU/GPU temps during idle and load | HWiNFO64, MSI Afterburner | CPU <45°C idle, <85°C load; GPU <50°C idle, <80°C load |
| Storage Health       | Quick SMART check for critical errors      | CrystalDiskInfo           | No warnings or errors                                  |
| Memory Error Check   | Review Windows Event Log for memory errors | Event Viewer              | No Kernel-Power or Memory errors                       |
| Network Connectivity | Verify all NICs operational                | Windows Network Status    | All adapters connected                                 |
| Backup Verification  | Confirm last backup completed              | Backup software logs      | Backup <24hrs old                                      |

**Automation Script (PowerShell):**

```powershell
# Save as: C:\Maintenance\Scripts\daily-health-check.ps1
# Schedule via Task Scheduler: Daily at 2:00 AM

param(
    [string]$LogPath = "C:\Maintenance\Logs\daily-checks.log"
)

$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
$report = @()

# Temperature Check (requires HWiNFO64 with shared memory)
$cpuTemp = (Get-WmiObject -Namespace "root\OpenHardwareMonitor" -Class Sensor |
            Where-Object {$_.SensorType -eq "Temperature" -and $_.Name -like "*CPU*"}).Value
$gpuTemp = (Get-WmiObject -Namespace "root\OpenHardwareMonitor" -Class Sensor |
            Where-Object {$_.SensorType -eq "Temperature" -and $_.Name -like "*GPU*"}).Value

if ($cpuTemp -gt 45) { $report += "WARNING: CPU temp elevated: $cpuTemp°C" }
if ($gpuTemp -gt 50) { $report += "WARNING: GPU temp elevated: $gpuTemp°C" }

# Storage SMART Check
$disks = Get-PhysicalDisk
foreach ($disk in $disks) {
    $health = Get-StorageReliabilityCounter -PhysicalDisk $disk
    if ($health.Temperature -gt 60) {
        $report += "WARNING: $($disk.FriendlyName) temp: $($health.Temperature)°C"
    }
}

# Memory Error Check
$memErrors = Get-EventLog -LogName System -After (Get-Date).AddDays(-1) |
             Where-Object {$_.Source -like "*Memory*" -or $_.EventID -eq 41}
if ($memErrors.Count -gt 0) {
    $report += "ERROR: $($memErrors.Count) memory-related events detected"
}

# Network Check
$nics = Get-NetAdapter | Where-Object {$_.Status -ne "Up"}
if ($nics.Count -gt 0) {
    $report += "WARNING: $($nics.Count) network adapters down"
}

# Log Results
$logEntry = "$timestamp - Daily Check: " +
            $(if ($report.Count -eq 0) {"PASS"} else {"FAIL - " + ($report -join "; ")})
Add-Content -Path $LogPath -Value $logEntry

# Email Alert on Failure (optional)
if ($report.Count -gt 0) {
    Send-MailMessage -To "admin@example.com" -From "workstation@example.com" `
                     -Subject "Workstation Health Alert" -Body ($report -join "`n") `
                     -SmtpServer "smtp.example.com"
}
```

### Weekly Maintenance

**Time Required:** 15-20 minutes
**Schedule:** Sunday at 3:00 AM

| Task                 | Description                           | Tools                     | Action Required                     |
| -------------------- | ------------------------------------- | ------------------------- | ----------------------------------- |
| Full SMART Analysis  | Detailed storage health report        | CrystalDiskInfo, smartctl | Review all parameters, log trends   |
| Fan Speed Check      | Verify all fans operating within spec | HWiNFO64, BIOS            | All fans >500 RPM under load        |
| Performance Baseline | Run quick benchmark suite             | Cinebench R23, 3DMark     | Compare to baseline (±5% tolerance) |
| Windows Updates      | Install critical and security updates | Windows Update            | Install all critical updates        |
| Driver Verification  | Check for stability issues            | Device Manager            | No yellow exclamation marks         |
| Cable Inspection     | Visual check for loose connections    | Flashlight                | All cables secure                   |
| Dust Filter Check    | Inspect intake filters                | Visual inspection         | Clean if >20% blocked               |

**Weekly Checklist Script:**

```powershell
# Save as: C:\Maintenance\Scripts\weekly-maintenance.ps1

# SMART Analysis
Get-PhysicalDisk | ForEach-Object {
    $smart = Get-StorageReliabilityCounter -PhysicalDisk $_
    [PSCustomObject]@{
        Disk = $_.FriendlyName
        Temperature = $smart.Temperature
        ReadErrorsTotal = $smart.ReadErrorsTotal
        WriteErrorsTotal = $smart.WriteErrorsTotal
        PowerOnHours = $smart.PowerOnHours
        Wear = $smart.Wear
    }
} | Export-Csv "C:\Maintenance\Logs\weekly-smart-$(Get-Date -Format 'yyyy-MM-dd').csv"

# Fan Speed Report
$fans = Get-WmiObject -Namespace "root\OpenHardwareMonitor" -Class Sensor |
        Where-Object {$_.SensorType -eq "Fan"}
$fans | Select-Object Name, Value |
        Export-Csv "C:\Maintenance\Logs\weekly-fans-$(Get-Date -Format 'yyyy-MM-dd').csv"

# Performance Baseline (requires Cinebench CLI)
& "C:\Program Files\Cinebench\Cinebench.exe" /run /silent
Copy-Item "C:\Users\*\Documents\Cinebench\results.xml" `
          "C:\Maintenance\Logs\weekly-bench-$(Get-Date -Format 'yyyy-MM-dd').xml"

# Windows Update Check
$updates = (New-Object -ComObject Microsoft.Update.Session).CreateUpdateSearcher().Search("IsInstalled=0")
if ($updates.Updates.Count -gt 0) {
    Write-Warning "$($updates.Updates.Count) updates available"
}
```

### Monthly Maintenance

**Time Required:** 1-2 hours
**Schedule:** First Sunday of month at 1:00 AM

| Task                    | Description                                  | Tools                                | Action Required                      |
| ----------------------- | -------------------------------------------- | ------------------------------------ | ------------------------------------ |
| Deep Clean              | Remove dust from all components              | Compressed air, ESD-safe vacuum      | All components dust-free             |
| Thermal Monitoring      | Log thermal performance under sustained load | HWiNFO64 (1hr stress test)           | Document max temps                   |
| RAM Test                | Full memory diagnostic                       | Windows Memory Diagnostic, MemTest86 | Zero errors                          |
| Storage Benchmark       | Measure drive performance degradation        | CrystalDiskMark                      | Compare to baseline                  |
| GPU Stress Test         | Verify graphics stability                    | FurMark, 3DMark                      | No artifacts, crashes, or throttling |
| BIOS Battery Check      | Verify CMOS battery voltage                  | BIOS/UEFI                            | >2.7V (replace <2.5V)                |
| Backup Restoration Test | Verify backups are recoverable               | Backup software                      | Successful test restore              |
| Security Scan           | Malware and vulnerability scan               | Windows Defender, Malwarebytes       | Clean scan                           |
| Cable Management        | Re-route cables, check for wear              | Cable ties                           | Improved airflow, no fraying         |

**Monthly Deep Clean Procedure:**

1. **Preparation (10 min)**
   - Shut down system gracefully
   - Disconnect power (wait 30 seconds)
   - Ground yourself (ESD wrist strap)
   - Photograph cable routing before disconnection

2. **Component Removal (15 min)**
   - Remove side panels
   - Remove GPU (if accessible)
   - Remove PSU fan filter (if accessible)
   - Remove all case fans for deep cleaning

3. **Cleaning (30 min)**
   - Compressed air: Short bursts, 6" distance
   - Focus areas:
     - CPU heatsink fins
     - GPU heatsink/shroud
     - Case fan blades (both sides)
     - PSU intake/exhaust
     - Motherboard VRM heatsinks
     - RAM slots
     - PCIe slots
   - ESD-safe vacuum: Large dust accumulations
   - Microfiber cloth: Dust filters, glass panels

4. **Inspection (15 min)**
   - Thermal paste condition (CPU/GPU - look for pump-out)
   - Capacitor bulging (motherboard, GPU, PSU)
   - Cable insulation damage
   - Fan bearing noise (spin by hand)
   - Connector corrosion
   - Screw tightness

5. **Reassembly (15 min)**
   - Reinstall components in reverse order
   - Verify all power connectors seated
   - Cable management improvements
   - Replace panels

6. **Post-Clean Testing (10 min)**
   - Power on, verify POST
   - Check BIOS fan speeds
   - Boot to Windows
   - Run HWiNFO64 for 10 minutes
   - Compare temperatures to baseline

### Quarterly Maintenance

**Time Required:** 2-4 hours
**Schedule:** January, April, July, October

| Task                     | Description                               | Tools                                 | Action Required                    |
| ------------------------ | ----------------------------------------- | ------------------------------------- | ---------------------------------- |
| Firmware Updates         | BIOS, GPU vBIOS, NIC firmware             | Vendor utilities                      | Update if stable version available |
| Driver Updates           | GPU, chipset, network, storage            | DDU, vendor sites                     | Clean install recommended          |
| Thermal Paste Inspection | Check for pump-out or degradation         | Visual inspection, thermal camera     | Replace if temps elevated >5°C     |
| Storage Optimization     | TRIM, defrag (HDD), firmware updates      | Windows Optimize Drives, vendor tools | Complete optimization              |
| Fan Bearing Check        | Listen for grinding or clicking           | Stethoscope (optional)                | Replace if noisy                   |
| Power Supply Test        | Verify voltage rails under load           | Multimeter, PSU tester                | All rails within ±5% spec          |
| Performance Regression   | Full benchmark suite, compare to baseline | Multiple benchmark tools              | Investigate if >10% degradation    |
| Backup Strategy Review   | Verify backup coverage and retention      | Backup software                       | Update strategy as needed          |
| Documentation Update     | Update maintenance logs and observations  | This document                         | Record all changes                 |

### Annual Maintenance

**Time Required:** 4-8 hours
**Schedule:** System anniversary date

| Task                          | Description                             | Tools                               | Action Required                   |
| ----------------------------- | --------------------------------------- | ----------------------------------- | --------------------------------- |
| **Complete System Teardown**  | Full disassembly for inspection         | Full toolkit                        | Deep inspection of all components |
| **Thermal Paste Replacement** | CPU and GPU repaste                     | High-quality TIM, isopropyl alcohol | Fresh application                 |
| **Thermal Pad Inspection**    | Check GPU memory/VRM pads               | Calipers, replacement pads          | Replace if compressed >50%        |
| **Storage Migration**         | Move data off aging drives              | Cloning software                    | Proactive replacement             |
| **Capacity Planning**         | Review storage/RAM utilization trends   | Performance Monitor                 | Plan upgrades                     |
| **Warranty Review**           | Check component warranty status         | Purchase records                    | Plan replacements                 |
| **Technology Assessment**     | Review upgrade opportunities            | Industry news, benchmarks           | Plan refresh cycle                |
| **Disaster Recovery Test**    | Full system restore from backup         | Backup media, spare drive           | Verify DR plan                    |
| **Security Hardening**        | Update security policies, review access | Security audit tools                | Implement improvements            |
| **Financial Review**          | Calculate total cost of ownership       | Expense logs                        | Budget for next year              |

---

## 2. Component Health Monitoring

### Monitoring Stack

**Primary Tools:**

- **HWiNFO64** (v7.40+): Real-time monitoring, logging, alerts
- **CrystalDiskInfo** (v9.0+): Storage SMART monitoring
- **GPU-Z** (v2.50+): Graphics card monitoring
- **MSI Afterburner** (v4.6+): GPU overclocking and monitoring
- **AIDA64 Engineer** (Trial/Paid): Comprehensive diagnostics
- **Open Hardware Monitor**: Open-source alternative

**Configuration:**

1. **HWiNFO64 Setup**
   - Enable "Sensors-only" mode on startup
   - Configure logging: `Settings > Logging > Enable`
   - Log interval: 10 seconds (balance detail vs. file size)
   - Log location: `C:\Maintenance\Logs\HWiNFO\`
   - Enable alerts:
     - CPU temp >85°C
     - GPU temp >80°C
     - VRM temp >100°C
     - Fan speed <500 RPM
     - PSU voltage deviation >5%

2. **CrystalDiskInfo Setup**
   - Enable resident mode (system tray)
   - Alert threshold: 50°C for SSDs, 45°C for HDDs
   - Sound alert on health status change
   - Auto-refresh: 10 minutes

3. **Windows Performance Monitor**
   - Create Data Collector Set: "Workstation Baseline"
   - Counters:
     - Processor: % Processor Time, Temperature (if available)
     - Memory: Available MBytes, Pages/sec
     - PhysicalDisk: Avg. Disk Queue Length, % Idle Time
     - Network Interface: Bytes Total/sec
   - Sample interval: 15 seconds
   - Duration: Continuous (100MB max, circular logging)

### Health Metrics & Thresholds

#### CPU (AMD Ryzen 9 9950X)

| Metric           | Optimal    | Acceptable   | Warning            | Critical            |
| ---------------- | ---------- | ------------ | ------------------ | ------------------- |
| Idle Temp        | 30-40°C    | 40-50°C      | 50-60°C            | >60°C               |
| Load Temp (AVX2) | 60-75°C    | 75-85°C      | 85-90°C            | >90°C               |
| VCore            | 1.1-1.35V  | 1.35-1.45V   | 1.45-1.5V          | >1.5V               |
| SoC Voltage      | 1.0-1.2V   | 1.2-1.3V     | 1.3-1.4V           | >1.4V               |
| Package Power    | 120-170W   | 170-200W     | 200-230W           | >230W               |
| Clock Speed      | 3.0-5.7GHz | Per workload | Throttling <3.0GHz | Constant throttling |

#### GPU (NVIDIA RTX 4090)

| Metric        | Optimal    | Acceptable          | Warning   | Critical       |
| ------------- | ---------- | ------------------- | --------- | -------------- |
| Idle Temp     | 30-45°C    | 45-55°C             | 55-65°C   | >65°C          |
| Load Temp     | 60-75°C    | 75-82°C             | 82-88°C   | >88°C          |
| Hot Spot Temp | +10°C avg  | +15°C avg           | +20°C avg | >+25°C avg     |
| Memory Temp   | 60-80°C    | 80-90°C             | 90-95°C   | >95°C          |
| Power Draw    | 300-400W   | 400-450W            | 450-480W  | >480W          |
| Fan Speed     | 30-50%     | 50-70%              | 70-90%    | >90% sustained |
| Core Clock    | 2.3-2.7GHz | Per boost algorithm | <2.0GHz   | Throttling     |

#### Memory (DDR5)

| Metric             | Optimal    | Acceptable | Warning   | Critical       |
| ------------------ | ---------- | ---------- | --------- | -------------- |
| Temperature        | <45°C      | 45-55°C    | 55-65°C   | >65°C          |
| Voltage            | 1.25-1.35V | 1.35-1.45V | 1.45-1.5V | >1.5V          |
| Errors (MemTest86) | 0          | 0          | >0        | Any errors     |
| Utilization        | <80%       | 80-90%     | 90-95%    | >95% sustained |

#### Storage (NVMe Gen 4/5)

| Metric              | Optimal   | Acceptable | Warning     | Critical  | Action              |
| ------------------- | --------- | ---------- | ----------- | --------- | ------------------- |
| Temperature         | <50°C     | 50-65°C    | 65-75°C     | >75°C     | Add cooling         |
| Read Speed          | >5000MB/s | >3000MB/s  | >1000MB/s   | <1000MB/s | Check throttling    |
| Write Speed         | >4000MB/s | >2000MB/s  | >500MB/s    | <500MB/s  | Check wear          |
| TBW Remaining       | >80%      | 50-80%     | 20-50%      | <20%      | Plan replacement    |
| Reallocated Sectors | 0         | 0          | 1-10        | >10       | Replace immediately |
| Power-On Hours      | <8760     | 8760-17520 | 17520-26280 | >26280    | Monitor closely     |
| SMART Health        | Good      | Good       | Caution     | Bad       | Replace immediately |

#### Cooling System

| Metric             | Optimal          | Acceptable   | Warning     | Critical     |
| ------------------ | ---------------- | ------------ | ----------- | ------------ |
| Case Intake Fans   | 800-1200 RPM     | 600-800 RPM  | 400-600 RPM | <400 RPM     |
| Case Exhaust Fans  | 900-1300 RPM     | 700-900 RPM  | 500-700 RPM | <500 RPM     |
| CPU Cooler Fans    | 1000-1800 RPM    | 800-1000 RPM | 600-800 RPM | <600 RPM     |
| GPU Fans (idle)    | 0 RPM (zero fan) | 0-30%        | 30-50%      | >50% at idle |
| GPU Fans (load)    | 40-70%           | 70-85%       | 85-95%      | >95%         |
| Coolant Temp (AIO) | 25-35°C          | 35-45°C      | 45-55°C     | >55°C        |

#### Power Supply (850W-1000W 80+ Platinum/Titanium)

| Rail  | Nominal | Acceptable        | Warning                                | Critical           |
| ----- | ------- | ----------------- | -------------------------------------- | ------------------ |
| +12V  | 12.00V  | 11.88-12.12V      | 11.76-11.88V or 12.12-12.24V           | <11.76V or >12.24V |
| +5V   | 5.00V   | 4.95-5.05V        | 4.90-4.95V or 5.05-5.10V               | <4.90V or >5.10V   |
| +3.3V | 3.30V   | 3.27-3.33V        | 3.24-3.27V or 3.33-3.36V               | <3.24V or >3.36V   |
| -12V  | -12.00V | -11.88 to -12.12V | -11.76 to -11.88V or -12.12 to -12.24V | Outside range      |
| +5VSB | 5.00V   | 4.95-5.05V        | 4.90-4.95V or 5.05-5.10V               | <4.90V or >5.10V   |

### Alert Configuration

**Email Alert Setup (PowerShell):**

```powershell
# Configure SMTP settings
$smtpServer = "smtp.gmail.com"
$smtpPort = 587
$smtpUser = "workstation@example.com"
$smtpPass = ConvertTo-SecureString "your-password" -AsPlainText -Force
$credential = New-Object System.Management.Automation.PSCredential($smtpUser, $smtpPass)

function Send-HealthAlert {
    param(
        [string]$Component,
        [string]$Metric,
        [string]$Value,
        [string]$Threshold,
        [string]$Severity
    )

    $subject = "[$Severity] Workstation Health Alert: $Component"
    $body = @"
Component: $Component
Metric: $Metric
Current Value: $Value
Threshold: $Threshold
Severity: $Severity
Timestamp: $(Get-Date)

Please investigate immediately.
"@

    Send-MailMessage -To "admin@example.com" -From $smtpUser `
                     -Subject $subject -Body $body `
                     -SmtpServer $smtpServer -Port $smtpPort `
                     -UseSsl -Credential $credential
}

# Example: Monitor CPU temperature
$cpuTemp = 92  # Example value from HWiNFO64
if ($cpuTemp -gt 90) {
    Send-HealthAlert -Component "CPU" -Metric "Temperature" `
                     -Value "$cpuTemp°C" -Threshold "90°C" -Severity "CRITICAL"
}
```

---

## 3. Firmware & Driver Management

### Firmware Update Strategy

**Philosophy:** **Stability over novelty** - Only update firmware when:

1. Critical security vulnerability addressed
2. Major performance improvement (>5%)
3. Bug fix for issue you're experiencing
4. Required for hardware upgrade compatibility

**NEVER update firmware:**

- Immediately upon release (wait 2-4 weeks for community feedback)
- Before critical work deadlines
- Without full backup
- Without bootable recovery media

### BIOS/UEFI Firmware

**Current Platform:** AMD AM5 (X670E/B650 chipset)

**Update Frequency:** Quarterly review, update only if needed

**Pre-Update Checklist:**

- [ ] Full system backup completed
- [ ] BIOS settings documented (screenshots or export)
- [ ] UPS connected (prevent power loss during flash)
- [ ] BIOS recovery method confirmed (BIOS Flashback, Q-Flash, etc.)
- [ ] Download BIOS from official motherboard manufacturer only
- [ ] Verify checksum (SHA-256) against manufacturer's website
- [ ] Read release notes for known issues

**Update Procedure:**

1. **Preparation**

   ```powershell
   # Document current BIOS version
   Get-WmiObject -Class Win32_BIOS | Select-Object SMBIOSBIOSVersion, ReleaseDate

   # Export to file
   Get-WmiObject -Class Win32_BIOS | Out-File "C:\Maintenance\BIOS\pre-update-$(Get-Date -Format 'yyyy-MM-dd').txt"
   ```

2. **Download & Verify**
   - Motherboard manufacturer website only
   - Verify SHA-256 hash:
     ```powershell
     Get-FileHash "C:\Downloads\BIOS_UPDATE.zip" -Algorithm SHA256
     ```
   - Extract to FAT32-formatted USB drive (root directory)

3. **Update Methods (in order of preference)**

   **Method A: BIOS Flashback (safest - no POST required)**
   - Insert USB with BIOS file (renamed per manual, e.g., `MB.CAP`)
   - Power off, switch off PSU
   - Press BIOS Flashback button (hold 3-5 seconds)
   - LED will flash - DO NOT interrupt
   - Wait for solid light or LED off (5-10 minutes)
   - Power on normally

   **Method B: BIOS/UEFI Interface (safe - within BIOS)**
   - Boot to BIOS (Delete/F2 key)
   - Navigate to update utility (M-Flash, Q-Flash, EZ Flash)
   - Select BIOS file from USB
   - Confirm update - DO NOT interrupt
   - System will reboot automatically

   **Method C: Windows Utility (least preferred)**
   - Use only if manufacturer provides Windows updater
   - Close all applications
   - Disable antivirus temporarily
   - Run as Administrator
   - Do not use computer during update

4. **Post-Update Verification**
   - Verify version in BIOS/UEFI
   - Load optimized defaults
   - Reconfigure settings from documentation:
     - XMP/EXPO profile
     - Boot order
     - Secure Boot
     - TPM settings
     - Fan curves
     - PCIe Gen settings
     - Resizable BAR
   - Boot to Windows
   - Run stability test (Cinebench R23 - 10 minute run)
   - Monitor for 24 hours before considering stable

**BIOS Settings to Document:**

| Category   | Settings                                     |
| ---------- | -------------------------------------------- |
| CPU        | PBO limits, Curve Optimizer, boost behavior  |
| Memory     | XMP/EXPO profile, timings, voltages          |
| Boot       | Boot order, Fast Boot, CSM, Secure Boot      |
| Power      | Power limits, C-states, idle behavior        |
| PCIe       | Gen 4/5 settings, Resizable BAR, bifurcation |
| Storage    | SATA mode, NVMe configuration                |
| Security   | TPM 2.0, Secure Boot keys, passwords         |
| Monitoring | Fan curves, temperature limits               |

### GPU Firmware (vBIOS)

**Update Frequency:** Rarely (major issues only)

**Risk Level:** HIGH - Can brick GPU if interrupted

**When to Update:**

- NVIDIA recommends update for specific issue
- Resizable BAR support added
- Power limit issues
- Display output problems

**Procedure:**

1. **Backup Current vBIOS**

   ```cmd
   # Using GPU-Z
   1. Open GPU-Z
   2. Click BIOS version dropdown arrow
   3. Save to File: C:\Maintenance\GPU\vbios-backup-YYYYMMDD.rom
   ```

2. **Download vBIOS**
   - Source: TechPowerUp VGA BIOS Database or manufacturer
   - Match exact model and variant
   - Verify checksum

3. **Flash vBIOS**

   ```cmd
   # NVIDIA NVFlash (use at own risk)
   nvflash64.exe --save current-vbios.rom
   nvflash64.exe --protectoff
   nvflash64.exe -6 new-vbios.rom

   # Reboot required
   ```

**Warning:** vBIOS flashing can permanently damage GPU. Only proceed if manufacturer recommends.

### Network Adapter Firmware

**Intel I225-V / I226-V (2.5GbE):**

**Update Frequency:** Semi-annually or when issues arise

**Common Issues Addressed:**

- Packet loss under sustained load
- Connection drops
- Performance degradation
- Wake-on-LAN issues

**Update Procedure:**

1. **Check Current Version**

   ```powershell
   Get-NetAdapter | Select-Object Name, DriverVersion, DriverDate
   ```

2. **Download Intel PROSet**
   - Source: Intel Download Center
   - Product: Intel Ethernet Adapter Complete Driver Pack
   - OS: Windows 10/11 x64

3. **Install**
   - Run installer as Administrator
   - Select "Intel PROSet Adapter Configuration Utility"
   - Reboot after installation

4. **Update Firmware**
   - Open Intel PROSet
   - Advanced > Adapter Settings > Firmware
   - Click "Update Firmware"
   - Reboot

### Storage Firmware

**NVMe SSDs (Samsung, WD, Crucial, etc.):**

**Update Frequency:** Quarterly review

**Benefits:**

- Performance improvements
- Power efficiency
- Stability fixes
- Data integrity enhancements

**Procedure (Samsung SSD example):**

1. **Backup Data First**
   - Full system backup recommended
   - Firmware updates should be non-destructive, but always backup

2. **Download Samsung Magician**
   - Source: Samsung.com
   - Install and run

3. **Check for Updates**
   - Open Samsung Magician
   - Select drive
   - Click "Firmware Update" if available
   - Follow prompts - do not interrupt

4. **Alternative: Manual Update**
   ```cmd
   # Using Samsung Portable SSD Software or bootable ISO
   1. Create bootable USB with firmware update ISO
   2. Boot from USB
   3. Follow on-screen instructions
   4. Reboot
   ```

**Other Brands:**

- **Western Digital:** WD Dashboard
- **Crucial:** Crucial Storage Executive
- **Corsair:** Corsair SSD Toolbox
- **Sabrent:** Sabrent Rocket Control Panel

---

## 4. Driver Update Strategy

### Driver Update Philosophy

**Tier 1 (Update Promptly):** Security & Critical Fixes

- GPU drivers with security patches
- Chipset drivers with vulnerability fixes
- Network drivers with security updates

**Tier 2 (Update Quarterly):** Stability & Performance

- GPU drivers (after 2-week community validation)
- Chipset drivers
- Audio drivers

**Tier 3 (If It Ain't Broke...):** Convenience Features

- RGB control software
- Peripheral drivers
- Utility software

### GPU Driver Management (NVIDIA)

**Update Frequency:** Monthly (Game Ready) or Quarterly (Studio Drivers)

**Driver Types:**

- **Game Ready Drivers:** Latest game optimizations, update monthly
- **Studio Drivers:** Tested for stability, update quarterly
- **Recommendation for workstation:** Studio Drivers

**Clean Installation Procedure:**

1. **Uninstall Existing Drivers**

   ```powershell
   # Download Display Driver Uninstaller (DDU)
   # Boot to Safe Mode:
   shutdown /r /o /f /t 00

   # In Safe Mode:
   1. Run DDU
   2. Select NVIDIA
   3. Choose "Clean and restart"
   ```

2. **Install New Drivers**
   - Download from NVIDIA website (never Windows Update)
   - Run installer
   - Select "Custom" installation
   - Check "Perform clean installation"
   - Uncheck unwanted components:
     - GeForce Experience (optional)
     - HD Audio Driver (if not using HDMI audio)
     - 3D Vision (deprecated)

3. **Post-Installation Configuration**
   - NVIDIA Control Panel settings:
     - Power Management: Prefer Maximum Performance
     - Low Latency Mode: On (for gaming) or Off (for productivity)
     - G-SYNC: Configure per monitor
   - MSI Afterburner: Reapply overclock profile
   - Fan curve: Reapply custom curve

4. **Stability Testing**

   ```powershell
   # Run 3DMark stress test
   & "C:\Program Files\UL\3DMark\3dmark.exe" --stress-test --duration 20

   # Monitor for:
   # - Driver crashes
   # - Artifacts
   # - Temperature spikes
   # - Performance regression
   ```

**Rollback Procedure:**

```powershell
# If new drivers cause issues:
1. Device Manager > Display Adapters > NVIDIA GPU
2. Right-click > Properties > Driver > Roll Back Driver
# OR repeat DDU process and install previous driver version
```

### Chipset Drivers (AMD)

**Update Frequency:** Quarterly

**Components:**

- USB drivers
- SATA/NVMe drivers
- PCIe drivers
- Power management
- GPIO drivers

**Installation:**

1. Download AMD Chipset Drivers from AMD.com
2. Run installer as Administrator
3. Recommended: Full installation (not minimal)
4. Reboot required

**Post-Update:**

- Verify USB devices functional
- Check power plan (Ryzen Balanced or High Performance)
- Monitor idle power consumption

### Audio Drivers

**Realtek/ALC Codecs:**

- Update frequency: Semi-annually
- Source: Motherboard manufacturer website
- Alternative: Realtek website for generic drivers

**Procedure:**

1. Uninstall current driver (Device Manager)
2. Reboot
3. Install new driver from manufacturer
4. Reboot
5. Reconfigure audio enhancements if applicable

### Network Drivers

**Update Frequency:** Quarterly or as-needed

**Intel Ethernet:**

```powershell
# Check current version
Get-NetAdapter | Select-Object Name, DriverVersion, DriverDate, DriverProvider

# Download from Intel.com: PROSet
# Install, reboot, verify network connectivity
```

**Wi-Fi (if applicable):**

- Update via Windows Update or manufacturer site
- Test connectivity after update

### Storage Controller Drivers

**NVMe Drivers:**

- **Microsoft Standard NVMe Driver:** Usually sufficient
- **Vendor-specific:** Samsung, WD (optional for features)

**Update via Device Manager:**

1. Device Manager > Storage Controllers > NVMe Controller
2. Right-click > Update Driver
3. Search automatically for drivers
4. Reboot if required

### Driver Version Tracking

**Create Driver Inventory:**

```powershell
# Save as: C:\Maintenance\Scripts\driver-inventory.ps1
Get-WmiObject Win32_PnPSignedDriver |
    Select-Object DeviceName, DriverVersion, DriverDate, Manufacturer, DeviceID |
    Export-Csv "C:\Maintenance\Logs\drivers-$(Get-Date -Format 'yyyy-MM-dd').csv"
```

**Compare Before/After Updates:**

```powershell
# Before update:
.\driver-inventory.ps1

# After update:
.\driver-inventory.ps1

# Compare:
$before = Import-Csv "C:\Maintenance\Logs\drivers-2025-01-15.csv"
$after = Import-Csv "C:\Maintenance\Logs\drivers-2025-01-16.csv"
Compare-Object $before $after -Property DeviceName, DriverVersion
```

---

## 5. Storage Health & Longevity

### SSD Wear Leveling & Lifespan

**TBW (Terabytes Written) Ratings:**

| Drive Type     | Typical TBW (1TB) | Expected Lifespan (100GB/day writes) |
| -------------- | ----------------- | ------------------------------------ |
| QLC Consumer   | 200-400 TBW       | 5-11 years                           |
| TLC Consumer   | 600-1200 TBW      | 16-33 years                          |
| TLC Pro/Plus   | 1200-2400 TBW     | 33-65 years                          |
| MLC Enterprise | 3000-10000 TBW    | 82-274 years                         |

**Daily Write Calculation:**

```powershell
# Monitor writes over 24 hours
$before = (Get-PhysicalDisk -FriendlyName "Samsung SSD 990 PRO 2TB" |
           Get-StorageReliabilityCounter).WriteCommandsTotal

Start-Sleep -Seconds 86400  # 24 hours

$after = (Get-PhysicalDisk -FriendlyName "Samsung SSD 990 PRO 2TB" |
          Get-StorageReliabilityCounter).WriteCommandsTotal

$writesPerDay = ($after - $before) * 512 / 1GB  # Assuming 512-byte sectors
Write-Output "Daily writes: $writesPerDay GB"
```

**Wear Reduction Strategies:**

1. **Disable Unnecessary Writes**

   ```powershell
   # Disable Superfetch/Prefetch (SSD-optimized systems)
   Set-Service -Name SysMain -StartupType Disabled
   Stop-Service -Name SysMain

   # Disable Hibernation (if not needed - saves disk space)
   powercfg /hibernate off

   # Reduce page file size (if 64GB+ RAM)
   # System Properties > Advanced > Performance > Advanced > Virtual Memory
   # Set custom size: 4096MB-8192MB
   ```

2. **Move Temporary Files**

   ```powershell
   # Move TEMP to RAMDisk or HDD (if available)
   # Create RAMDisk using ImDisk or Dataram RAMDisk

   # Set environment variables:
   [Environment]::SetEnvironmentVariable("TEMP", "R:\Temp", "Machine")
   [Environment]::SetEnvironmentVariable("TMP", "R:\Temp", "Machine")
   ```

3. **Browser Cache Relocation**
   - Chrome: `chrome://settings/` > Advanced > Downloads > Change location
   - Firefox: `about:config` > `browser.cache.disk.parent_directory`
   - Edge: Settings > Downloads > Change location

4. **Optimize Write Patterns**
   - Schedule large file operations during off-hours
   - Use compression for archival data
   - Implement tiered storage (NVMe for active, SATA for archive)

### SMART Monitoring

**Critical SMART Attributes:**

| ID  | Attribute                    | Description               | Threshold | Action                 |
| --- | ---------------------------- | ------------------------- | --------- | ---------------------- |
| 05  | Reallocated Sectors Count    | Bad sectors remapped      | >0        | Monitor; >10 = Replace |
| 09  | Power-On Hours               | Drive runtime             | N/A       | Informational          |
| 0C  | Power Cycle Count            | Number of power cycles    | N/A       | Informational          |
| C2  | Temperature                  | Current drive temp        | >65°C     | Improve cooling        |
| C5  | Current Pending Sector Count | Sectors waiting for remap | >0        | Immediate backup       |
| C6  | Uncorrectable Sector Count   | Unrecoverable sectors     | >0        | Replace immediately    |
| C7  | UltraDMA CRC Error Count     | Interface errors          | >100      | Check cable            |
| E7  | SSD Wear Leveling Count      | Remaining lifespan        | <20%      | Plan replacement       |
| E8  | Available Spare              | Reserved spare blocks     | <10%      | Replace soon           |
| E9  | Media Wear Indicator         | Percentage used           | >80%      | Monitor closely        |

**Automated SMART Monitoring:**

```powershell
# Save as: C:\Maintenance\Scripts\smart-monitor.ps1
# Schedule: Daily at 2:00 AM

$drives = Get-PhysicalDisk
$alerts = @()

foreach ($drive in $drives) {
    $smart = Get-StorageReliabilityCounter -PhysicalDisk $drive

    # Check temperature
    if ($smart.Temperature -gt 65) {
        $alerts += "WARNING: $($drive.FriendlyName) temperature: $($smart.Temperature)°C"
    }

    # Check wear (if available)
    if ($smart.Wear -gt 80) {
        $alerts += "CAUTION: $($drive.FriendlyName) wear: $($smart.Wear)%"
    }

    # Check errors
    if ($smart.ReadErrorsTotal -gt 0 -or $smart.WriteErrorsTotal -gt 0) {
        $alerts += "ERROR: $($drive.FriendlyName) has read/write errors"
    }

    # Log to file
    $logEntry = [PSCustomObject]@{
        Date = Get-Date
        Drive = $drive.FriendlyName
        Temperature = $smart.Temperature
        Wear = $smart.Wear
        ReadErrors = $smart.ReadErrorsTotal
        WriteErrors = $smart.WriteErrorsTotal
        PowerOnHours = $smart.PowerOnHours
    }
    $logEntry | Export-Csv "C:\Maintenance\Logs\smart-history.csv" -Append
}

# Send alerts if any issues
if ($alerts.Count -gt 0) {
    $body = $alerts -join "`n"
    Send-MailMessage -To "admin@example.com" -From "workstation@example.com" `
                     -Subject "Storage Health Alert" -Body $body `
                     -SmtpServer "smtp.example.com"
}
```

### Storage Temperature Management

**Cooling Solutions:**

1. **Active Cooling**
   - NVMe heatsinks with fans
   - M.2 coolers (e.g., EKWB, Thermalright)
   - Case-mounted SSD coolers

2. **Passive Cooling**
   - Motherboard integrated heatsinks
   - Aftermarket aluminum heatsinks
   - Thermal pads (6-8 W/mK recommended)

3. **Thermal Throttling Detection**

   ```powershell
   # Monitor NVMe temperature during benchmark
   # If speed drops significantly when temp >75°C, throttling is occurring

   # Run CrystalDiskMark while logging temps:
   Start-Job {
       while ($true) {
           $temp = (Get-PhysicalDisk | Get-StorageReliabilityCounter).Temperature
           Add-Content "C:\Maintenance\Logs\nvme-thermal-test.txt" "$(Get-Date): $temp°C"
           Start-Sleep 5
       }
   }

   # Run benchmark
   & "C:\Program Files\CrystalDiskMark\DiskMark64.exe"

   # Stop logging
   Get-Job | Stop-Job
   ```

### Backup Strategy

**3-2-1 Backup Rule:**

- **3** copies of data
- **2** different media types
- **1** off-site copy

**Implementation:**

1. **Primary Backup (Daily - Incremental)**
   - Target: Local NAS or external HDD
   - Tools: Windows Backup, Veeam Agent, Macrium Reflect
   - Schedule: Daily at 2:00 AM (incremental)
   - Retention: 30 days of incrementals

2. **Secondary Backup (Weekly - Full)**
   - Target: External USB HDD (rotated)
   - Tools: Macrium Reflect, Acronis True Image
   - Schedule: Weekly (Sunday 3:00 AM)
   - Retention: 4 weekly backups

3. **Off-Site Backup (Monthly - Cloud)**
   - Target: Cloud storage (Backblaze, AWS S3, Azure)
   - Tools: Duplicati, Cloudberry Backup, Backblaze client
   - Schedule: Monthly on 1st
   - Retention: 12 monthly backups
   - Encryption: AES-256 before upload

**Critical Data Identification:**

- Documents: `C:\Users\[Username]\Documents`
- Projects: `C:\Projects`, `D:\Work`
- Databases: Application data folders
- Configuration: `C:\Maintenance`, `C:\ProgramData`
- User profiles: `C:\Users\[Username]`

**Backup Verification:**

```powershell
# Monthly backup restoration test
# Test procedure:
# 1. Mount backup image to virtual drive
# 2. Verify random file integrity
# 3. Test database restoration (if applicable)
# 4. Document results

$backupImage = "\\NAS\Backups\Workstation\latest.mrimg"
$mountPoint = "V:\"

# Mount backup (Macrium Reflect example)
& "C:\Program Files\Macrium\Reflect\MountAll.exe" /image:$backupImage /drive:V

# Verify files
$testFiles = @(
    "$mountPoint\Users\User\Documents\important.docx",
    "$mountPoint\Projects\current\config.json"
)

$results = @()
foreach ($file in $testFiles) {
    if (Test-Path $file) {
        $hash = Get-FileHash $file -Algorithm SHA256
        $results += [PSCustomObject]@{
            File = $file
            Status = "OK"
            SHA256 = $hash.Hash
        }
    } else {
        $results += [PSCustomObject]@{
            File = $file
            Status = "MISSING"
            SHA256 = "N/A"
        }
    }
}

$results | Export-Csv "C:\Maintenance\Logs\backup-verification-$(Get-Date -Format 'yyyy-MM-dd').csv"

# Unmount
& "C:\Program Files\Macrium\Reflect\UnmountAll.exe"
```

---

## 6. Thermal Management

### Thermal Paste Lifecycle

**Replacement Schedule:**

| Paste Type                         | Lifespan (24/7 use) | Replacement Interval |
| ---------------------------------- | ------------------- | -------------------- |
| Stock (OEM)                        | 1-2 years           | 12-18 months         |
| Budget (Arctic MX-4)               | 2-3 years           | 24 months            |
| Premium (Thermal Grizzly Kryonaut) | 2-4 years           | 24-36 months         |
| Premium (Noctua NT-H2)             | 3-5 years           | 36-48 months         |
| Liquid Metal (Conductonaut)        | 5+ years            | 48-60 months         |

**Signs of Degraded Paste:**

- CPU/GPU temps increased >5°C from baseline
- Pump-out visible (paste squeezed beyond IHS)
- Dry, cracked, or separated paste
- Uneven contact pattern

**Replacement Procedure (CPU):**

1. **Preparation**
   - Tools: Isopropyl alcohol (90%+), lint-free cloths, plastic spatula
   - New paste: 0.5-1g for AM5, 1-2g for LGA1700
   - Thermal pads (if GPU repaste)

2. **Disassembly**
   - Shutdown, disconnect power
   - Remove GPU (for better access)
   - Remove CPU cooler (twist slightly to break seal)
   - Unlock cooler mounting mechanism

3. **Cleaning**
   - Remove old paste with plastic spatula (gentle)
   - Wipe with isopropyl alcohol until no residue
   - Clean CPU IHS and cooler cold plate
   - Allow 5 minutes to fully evaporate

4. **Application Methods**

   **Pea Method (Recommended for most pastes):**
   - Small pea-sized dot in center of IHS
   - Cooler pressure spreads paste evenly

   **Line Method (For rectangular dies):**
   - Thin line across center of IHS
   - Good for Threadripper, server CPUs

   **Spread Method (For liquid metal only):**
   - Use included applicator to spread thin, even layer
   - Cover entire IHS including edges
   - Use electrical tape on SMD components near socket

5. **Reassembly**
   - Align cooler carefully (do not slide)
   - Tighten screws in cross pattern (even pressure)
   - Tighten to firm but not excessive force
   - Reconnect power cables

6. **Testing**
   - Boot to BIOS, check CPU temperature (should be <40°C)
   - Boot to Windows
   - Run Cinebench R23 (10-minute all-core)
   - Monitor temps: Should be ≤85°C for Ryzen 9 9950X
   - If temps >90°C, remount cooler

**Thermal Paste Recommendations:**

| Use Case           | Product                                     | Performance | Longevity | Price |
| ------------------ | ------------------------------------------- | ----------- | --------- | ----- |
| Budget             | Arctic MX-4                                 | Good        | 2-3 years | $     |
| High Performance   | Thermal Grizzly Kryonaut                    | Excellent   | 2-4 years | $$    |
| Workstation        | Noctua NT-H2                                | Excellent   | 3-5 years | $$    |
| Extreme (Advanced) | Thermal Grizzly Conductonaut (Liquid Metal) | Best        | 5+ years  | $$$   |

**GPU Thermal Paste/Pad Replacement:**

**Warning:** GPU disassembly voids warranty. Only proceed if out of warranty or comfortable with risk.

1. **Preparation**
   - Research teardown guide for exact GPU model
   - Order replacement thermal pads (measure existing or check guide)
   - Thermal paste for GPU die
   - Document screw locations (take photos)

2. **Disassembly**
   - Remove GPU from system
   - Remove shroud screws (save in labeled containers)
   - Disconnect fan connectors
   - Remove heatsink screws (spring-loaded, loosen in star pattern)
   - Carefully separate heatsink from PCB

3. **Cleaning**
   - Clean GPU die with isopropyl alcohol
   - Clean heatsink contact area
   - Remove old thermal pads from memory, VRM

4. **Replacement**
   - Apply new thermal paste to GPU die (pea method)
   - Apply new thermal pads to memory chips, VRM
   - Ensure correct thickness (0.5mm, 1mm, 1.5mm typical)

5. **Reassembly**
   - Align heatsink carefully
   - Tighten screws in cross pattern (even pressure)
   - Reconnect fan cables
   - Reattach shroud

6. **Testing**
   - Install in system
   - Boot, check for display output
   - Run FurMark or 3DMark stress test
   - Monitor temps: RTX 4090 should be <80°C under load

### AIO Liquid Cooler Maintenance

**Lifespan:** 5-7 years (pump/motor failure or permeation)

**Maintenance Schedule:**

| Interval  | Task                      | Description                                  |
| --------- | ------------------------- | -------------------------------------------- |
| Monthly   | Visual Inspection         | Check for leaks, listen for pump noise       |
| Quarterly | Radiator Cleaning         | Dust removal from fins                       |
| Annually  | Permeation Check          | Monitor coolant level (if visible reservoir) |
| 3-5 years | Replacement Consideration | Plan for AIO replacement                     |

**Warning Signs:**

- Increased pump noise (grinding, clicking)
- CPU temps elevated >10°C from baseline
- Visible coolant leakage
- Pump not detected in BIOS/software
- Bubbling/gurgling sounds (air in loop)

**AIO Replacement Procedure:**

- Follow new installation guide
- Clean CPU, apply fresh thermal paste
- Test pump operation before final assembly
- Monitor temps for first 24 hours

---

## 7. Physical Maintenance

### Fan Maintenance

**Fan Bearing Types & Lifespan:**

| Bearing Type        | Lifespan (24/7)             | Noise Level | Cost | Common Use  |
| ------------------- | --------------------------- | ----------- | ---- | ----------- |
| Sleeve              | 20,000-30,000 hrs (2-3 yrs) | Moderate    | $    | Budget fans |
| Rifle               | 40,000-50,000 hrs (4-5 yrs) | Low         | $$   | Mid-range   |
| Fluid Dynamic (FDB) | 60,000-80,000 hrs (6-9 yrs) | Very Low    | $$$  | Premium     |
| Magnetic Levitation | 100,000+ hrs (11+ yrs)      | Ultra Low   | $$$$ | High-end    |

**Cleaning Procedure:**

1. **Dust Removal (Monthly)**
   - Compressed air (short bursts, 6" distance)
   - Hold fan blades to prevent over-spinning
   - Clean both sides of blades
   - Remove dust from motor housing

2. **Deep Cleaning (Quarterly)**
   - Remove fan from case
   - Disassemble if possible (remove blades)
   - Wash blades with mild soap and water
   - Dry completely before reassembly
   - Lubrication (if sleeve bearing):
     - Remove center sticker
     - Add 1-2 drops of light machine oil (3-in-1, sewing machine oil)
     - Reseal with sticker

**Replacement Criteria:**

- Noise >40 dBA at normal speed
- Bearing grinding/clicking sounds
- RPM unstable or <50% expected speed
- Excessive vibration
- Age >5 years (preventative)

**Fan Inventory:**

| Location       | Size  | Model         | RPM Range | Installed Date | Next Replacement |
| -------------- | ----- | ------------- | --------- | -------------- | ---------------- |
| Front Intake 1 | 140mm | Noctua NF-A14 | 300-1500  | 2025-01-15     | 2030-01-15       |
| Front Intake 2 | 140mm | Noctua NF-A14 | 300-1500  | 2025-01-15     | 2030-01-15       |
| Rear Exhaust   | 120mm | Noctua NF-F12 | 300-1500  | 2025-01-15     | 2030-01-15       |
| Top Exhaust 1  | 140mm | Noctua NF-A14 | 300-1500  | 2025-01-15     | 2030-01-15       |
| CPU Cooler 1   | 140mm | Noctua NF-A15 | 300-1500  | 2025-01-15     | 2030-01-15       |
| CPU Cooler 2   | 140mm | Noctua NF-A15 | 300-1500  | 2025-01-15     | 2030-01-15       |

### Cable Management & Inspection

**Inspection Frequency:** Quarterly

**Check List:**

1. **Power Cables**
   - [ ] No exposed copper or fraying
   - [ ] Connectors fully seated (24-pin, 8-pin CPU, PCIe)
   - [ ] No excessive bending near connectors
   - [ ] Cable combs intact (if used)
   - [ ] No cables touching hot components (VRM, GPU backplate)

2. **Data Cables**
   - [ ] SATA cables clicked in place
   - [ ] No sharp bends (>90 degrees)
   - [ ] USB headers secure
   - [ ] Fan headers fully connected

3. **Airflow Optimization**
   - [ ] Cables routed behind motherboard tray
   - [ ] Minimal obstruction to intake/exhaust paths
   - [ ] Cable ties not over-tightened (restrict expansion)

**Replacement Criteria:**

- Any visible damage to insulation
- Discoloration near connectors (heat damage)
- Bent pins in connectors
- Loose/damaged locking clips

### Dust Filter Maintenance

**Cleaning Schedule:**

- **Light Use (normal home):** Monthly
- **Moderate Use (pets, carpet):** Bi-weekly
- **Heavy Use (workshop, dusty environment):** Weekly

**Procedure:**

1. **Removal**
   - Front panel filters (magnetic or slide-out)
   - Bottom PSU filter (slide-out)
   - Top filter (if equipped)

2. **Cleaning**
   - **Dry Method:** Compressed air, vacuum (outside case)
   - **Wet Method:** Warm water + mild detergent
   - Rinse thoroughly
   - Air dry completely (24 hours) before reinstalling

3. **Inspection**
   - Tears or damage to mesh
   - Frame cracks
   - Magnetic strips intact
   - Replace if damaged (custom cut filters available)

### Case Exterior Cleaning

**Frequency:** Monthly

- Glass panels: Glass cleaner, microfiber cloth
- Metal panels: Damp cloth, mild detergent
- RGB strips: Dry microfiber only (avoid liquids)
- Ports: Compressed air (USB, audio jacks)

---

## 8. Performance Monitoring

### Baseline Establishment

**Initial Baseline (After Build Completion):**

Run comprehensive benchmark suite and record results. This becomes the reference for detecting performance degradation.

**Benchmark Suite:**

1. **CPU Benchmarks**
   - **Cinebench R23:**
     - Multi-core score: ****\_****
     - Single-core score: ****\_****
     - Multi-core temp (avg): **\_**°C
   - **Geekbench 6:**
     - Multi-core: ****\_****
     - Single-core: ****\_****
   - **7-Zip Benchmark:**
     - Compression: **\_\_\_** GIPS
     - Decompression: **\_\_\_** GIPS

2. **GPU Benchmarks**
   - **3DMark Time Spy:**
     - Graphics Score: ****\_****
     - CPU Score: ****\_****
   - **Unigine Superposition (4K Optimized):**
     - FPS: ****\_****
     - Score: ****\_****
   - **Blender Benchmark:**
     - Monster: **\_\_\_** seconds
     - Junkshop: **\_\_\_** seconds

3. **Memory Benchmarks**
   - **AIDA64 Memory Benchmark:**
     - Read: **\_\_\_** MB/s
     - Write: **\_\_\_** MB/s
     - Copy: **\_\_\_** MB/s
     - Latency: **\_\_\_** ns

4. **Storage Benchmarks**
   - **CrystalDiskMark (NVMe):**
     - Sequential Read (Q8T1): **\_\_\_** MB/s
     - Sequential Write (Q8T1): **\_\_\_** MB/s
     - Random 4K Read (Q32T16): **\_\_\_** MB/s
     - Random 4K Write (Q32T16): **\_\_\_** MB/s

5. **System Stability**
   - **Prime95 (1 hour):** PASS / FAIL
   - **MemTest86 (4 passes):** PASS / FAIL
   - **FurMark (30 minutes):** PASS / FAIL

**Baseline Recording Script:**

```powershell
# Save as: C:\Maintenance\Scripts\baseline-benchmark.ps1

$baselineDate = Get-Date -Format "yyyy-MM-dd"
$reportPath = "C:\Maintenance\Baselines\baseline-$baselineDate.txt"

# System Info
$systemInfo = @"
=== System Baseline Report ===
Date: $baselineDate
CPU: $(Get-WmiObject Win32_Processor | Select-Object -ExpandProperty Name)
RAM: $([math]::Round((Get-WmiObject Win32_ComputerSystem).TotalPhysicalMemory / 1GB))GB
GPU: $(Get-WmiObject Win32_VideoController | Select-Object -ExpandProperty Name)
OS: $(Get-WmiObject Win32_OperatingSystem | Select-Object -ExpandProperty Caption)

=== Benchmarks ===
Run benchmarks manually and record here:
- Cinebench R23 Multi:
- Cinebench R23 Single:
- 3DMark Time Spy Graphics:
- CrystalDiskMark Seq Read:

=== Thermal Baseline ===
"@

# Add thermal data
$systemInfo += Get-WmiObject -Namespace "root\OpenHardwareMonitor" -Class Sensor |
               Where-Object {$_.SensorType -eq "Temperature"} |
               Select-Object Name, Value |
               Format-Table -AutoSize |
               Out-String

$systemInfo | Out-File $reportPath
Write-Output "Baseline saved to $reportPath"
```

### Performance Degradation Detection

**Automated Quarterly Benchmarking:**

```powershell
# Save as: C:\Maintenance\Scripts\quarterly-benchmark.ps1
# Schedule: First Sunday of each quarter

# Run benchmarks
$currentDate = Get-Date -Format "yyyy-MM-dd"
$resultsPath = "C:\Maintenance\Benchmarks\results-$currentDate.csv"

# Example: Cinebench R23 (requires automation or manual entry)
# Example: CrystalDiskMark (command line version)
& "C:\Program Files\CrystalDiskMark\DiskMarkCmd.exe" /s1 /m3 /d0 /o"$resultsPath"

# Compare to baseline
$baseline = Import-Csv "C:\Maintenance\Baselines\baseline-2025-01-15.csv"
$current = Import-Csv $resultsPath

# Calculate degradation
$seqReadBaseline = $baseline | Where-Object {$_.Test -eq "Seq Read Q8T1"} | Select-Object -ExpandProperty Result
$seqReadCurrent = $current | Where-Object {$_.Test -eq "Seq Read Q8T1"} | Select-Object -ExpandProperty Result
$degradation = (($seqReadBaseline - $seqReadCurrent) / $seqReadBaseline) * 100

if ($degradation -gt 10) {
    Send-MailMessage -To "admin@example.com" -From "workstation@example.com" `
                     -Subject "Performance Degradation Alert" `
                     -Body "Storage performance degraded by $degradation%" `
                     -SmtpServer "smtp.example.com"
}
```

**Degradation Thresholds:**

| Component | Acceptable Degradation | Investigation Required | Action Required |
| --------- | ---------------------- | ---------------------- | --------------- |
| CPU       | <5%                    | 5-10%                  | >10%            |
| GPU       | <5%                    | 5-10%                  | >10%            |
| RAM       | <3%                    | 3-7%                   | >7%             |
| NVMe SSD  | <10%                   | 10-20%                 | >20%            |
| SATA SSD  | <15%                   | 15-25%                 | >25%            |

**Investigation Steps:**

1. **<5% Degradation:** Normal variance
   - No action required
   - Continue monitoring

2. **5-10% Degradation:** Early warning
   - Review maintenance logs
   - Check temperatures
   - Update drivers
   - Run diagnostics

3. **>10% Degradation:** Action required
   - Deep clean system
   - Replace thermal paste
   - Check for firmware updates
   - Run stress tests
   - Consider component replacement

---

## 9. Upgrade Paths

### CPU Upgrade Path (AM5 Platform)

**Current:** AMD Ryzen 9 9950X (Zen 5, 16C/32T)

**Future Compatibility:** AM5 socket through 2027+ (AMD commitment)

| Timeframe | Upgrade Option                | Benefit                            | Cost Estimate |
| --------- | ----------------------------- | ---------------------------------- | ------------- |
| 2025-2026 | Ryzen 9 9950X3D (if released) | 15-25% gaming/cache-intensive perf | $500-700      |
| 2026-2027 | Zen 6 Flagship (AM5)          | 10-15% IPC improvement             | $600-800      |
| 2027-2028 | Zen 7 Flagship (AM5)          | 10-20% IPC improvement             | $700-900      |

**Upgrade Justification:**

- Current CPU >5 years old
- Workload requires >16 cores
- New architecture offers >20% improvement
- Platform compatibility ending

**Upgrade Procedure:**

1. Update BIOS to latest (for new CPU support)
2. Remove old CPU (clean thermal paste)
3. Install new CPU (apply fresh paste)
4. Boot to BIOS, verify detection
5. Boot to Windows (may require reactivation)
6. Update chipset drivers
7. Run stability tests

### GPU Upgrade Path

**Current:** NVIDIA RTX 4090 (24GB GDDR6X)

**Future Options:**

| Timeframe   | Upgrade Option                 | Benefit                        | Cost Estimate | Power Requirement |
| ----------- | ------------------------------ | ------------------------------ | ------------- | ----------------- |
| 2025 Q4     | RTX 5090 (Blackwell)           | 20-30% faster, lower power     | $1800-2200    | 450W (rumored)    |
| 2026-2027   | RTX 6080/6090 (Next-gen)       | 25-40% faster, AI improvements | $1500-2000    | 400-500W          |
| Alternative | Workstation GPU (RTX 6000 Ada) | ECC memory, pro drivers        | $6000-8000    | 300W              |

**Upgrade Justification:**

- VRAM limitation (24GB insufficient for workload)
- New architecture offers >30% performance
- Power efficiency improvement >20%
- Workflow requires professional features (ECC, pro drivers)

**Pre-Upgrade Checklist:**

- [ ] PSU adequate for new GPU power draw
- [ ] Case clearance (length, height)
- [ ] PCIe 4.0/5.0 support
- [ ] Display connectors compatible (DP 2.1, HDMI 2.1)
- [ ] Driver compatibility (uninstall old with DDU)

**Installation:**

1. Uninstall old GPU drivers (DDU in safe mode)
2. Shutdown, disconnect power
3. Remove old GPU
4. Install new GPU (ensure PCIe power connected)
5. Boot, install latest drivers
6. Run stress tests, monitor temps

### Memory Upgrade Path

**Current:** 64GB DDR5-6000 CL30 (2x32GB)

**Upgrade Options:**

| Scenario         | Configuration            | Benefit                       | Cost Estimate |
| ---------------- | ------------------------ | ----------------------------- | ------------- |
| Capacity Upgrade | 128GB (2x64GB) DDR5-6000 | 2x capacity, same speed       | $400-600      |
| Capacity Upgrade | 192GB (4x48GB) DDR5-6000 | 3x capacity, may reduce speed | $700-900      |
| Speed Upgrade    | 64GB DDR5-7200 CL34      | 20% faster, same capacity     | $300-450      |
| Mixed Upgrade    | 128GB DDR5-6400 CL32     | 2x capacity, 7% faster        | $500-700      |

**Considerations:**

- **4-DIMM configurations:** May reduce max speed (check motherboard QVL)
- **Dual vs. Quad Channel:** AM5 is dual-channel; 4 DIMMs still dual-channel
- **Workload:** RAM-intensive tasks (VMs, large datasets) benefit from capacity
- **Speed vs. Capacity:** For productivity, capacity > speed

**Upgrade Procedure:**

1. Document current XMP/EXPO profile
2. Shutdown, disconnect power
3. Ground yourself
4. Remove old RAM
5. Install new RAM (populate slots per manual - A2/B2 first)
6. Boot to BIOS
7. Enable XMP/EXPO profile
8. Save and reboot
9. Run MemTest86 (4 passes minimum)
10. Stress test with Prime95 or AIDA64

### Storage Upgrade Path

**Current:** 2TB NVMe Gen 4 (Primary) + 1TB NVMe Gen 4 (Secondary)

**Upgrade Options:**

| Timeframe | Upgrade Option                                | Benefit                          | Cost Estimate     |
| --------- | --------------------------------------------- | -------------------------------- | ----------------- |
| 2025      | Add 4TB NVMe Gen 4                            | More storage, same speed         | $250-400          |
| 2025-2026 | Upgrade to PCIe Gen 5 (Samsung 990 Pro, etc.) | 2x sequential speed              | $300-500 (2TB)    |
| 2026      | Add 8TB NVMe Gen 4                            | Massive storage                  | $600-900          |
| 2025+     | Add NAS for bulk storage                      | Off-system backup, shared access | $800-1500 (4-bay) |

**PCIe Gen 5 Considerations:**

- **Speed:** 10,000+ MB/s sequential (vs. 7,000 MB/s Gen 4)
- **Heat:** Requires robust cooling (active recommended)
- **Real-world benefit:** Minimal for most workloads (large file transfers benefit)
- **Recommendation:** Wait for Gen 5 maturity and price reduction

**Storage Tiering Strategy:**

1. **Tier 0 (Hot):** NVMe Gen 4/5 - Active projects, OS, applications
2. **Tier 1 (Warm):** SATA SSD - Recent projects, archives
3. **Tier 2 (Cold):** HDD or NAS - Long-term archives, backups
4. **Tier 3 (Offline):** External HDD - Off-site backups, disaster recovery

**Migration Procedure:**

1. Clone existing drive to new drive (Macrium Reflect, Samsung Data Migration)
2. Verify clone integrity
3. Swap boot drive in BIOS
4. Test boot from new drive
5. Repurpose old drive as secondary or backup

### Network Upgrade Path

**Current:** Onboard 2.5GbE Intel I225-V/I226-V

**Upgrade Options:**

| Timeframe | Upgrade Option                         | Benefit                     | Cost Estimate |
| --------- | -------------------------------------- | --------------------------- | ------------- |
| 2025      | 10GbE PCIe Card (Intel X550, Aquantia) | 4x speed for NAS, backups   | $150-300      |
| 2025-2026 | Wi-Fi 7 PCIe Card (BE19000)            | Latest wireless standard    | $100-200      |
| 2026+     | 25GbE (if workload demands)            | 10x speed, datacenter-grade | $400-800      |

**10GbE Requirements:**

- **Switch:** 10GbE managed switch ($200-500)
- **Cabling:** Cat6a or Cat7 (or fiber)
- **NAS:** 10GbE NAS or upgrade existing
- **Justification:** Large file transfers (>100GB daily), NAS-based workflows

**Installation:**

1. Install PCIe card in available slot (x4 or x8)
2. Boot to Windows
3. Install drivers from manufacturer
4. Configure static IP or DHCP
5. Test throughput with iperf3

---

## 10. Technology Refresh Timeline (5-Year Plan)

### Year 1 (2025): Establishment & Optimization

**Q1:**

- [ ] Complete initial build and baseline benchmarks
- [ ] Establish monitoring and logging infrastructure
- [ ] Implement backup strategy (3-2-1 rule)
- [ ] Document all configurations

**Q2:**

- [ ] First BIOS/firmware updates (if stable releases available)
- [ ] Optimize fan curves based on thermal data
- [ ] Evaluate workload patterns for future upgrades
- [ ] Review warranty coverage

**Q3:**

- [ ] First GPU driver major update (Studio Driver)
- [ ] Storage health review and optimization
- [ ] Consider minor upgrades (fans, cables) if issues arise

**Q4:**

- [ ] Annual deep clean and thermal paste check
- [ ] Review year 1 maintenance logs
- [ ] Plan year 2 upgrades (if needed)
- [ ] Evaluate backup strategy effectiveness

### Year 2 (2026): Minor Upgrades & Refinement

**Potential Upgrades:**

- [ ] Additional storage (if >80% capacity)
- [ ] Memory upgrade to 128GB (if RAM-limited workloads identified)
- [ ] Network upgrade to 10GbE (if large file transfer needs)
- [ ] Fan replacements (if any sleeve bearing fans failing)

**Maintenance Focus:**

- BIOS/firmware stability (update only if needed)
- Driver maturity (avoid bleeding edge)
- Storage migration planning (if any drives >2 years old)

### Year 3 (2027): Mid-Life Assessment

**Major Decision Point:**

- Evaluate GPU upgrade (RTX 5090 or 6000 series availability)
- Consider CPU upgrade if new AM5 generation offers >20% improvement
- Storage technology assessment (PCIe Gen 5 maturity)

**Scheduled Maintenance:**

- [ ] Mandatory thermal paste replacement (CPU, GPU)
- [ ] AIO liquid cooler assessment (replacement if >5 years old or signs of wear)
- [ ] PSU health check (ripple test, efficiency measurement)
- [ ] Complete teardown and inspection

**Technology Refresh Candidates:**

- **High Priority:** GPU (if new generation released and workload demands)
- **Medium Priority:** Storage (expand capacity, migrate to Gen 5)
- **Low Priority:** CPU (only if AM5 platform near EOL)

### Year 4 (2028): Strategic Upgrades

**Platform Assessment:**

- AM5 socket end-of-life approaching (AMD typically 5-year support)
- DDR5 maturity and price reduction
- PCIe Gen 6 emerging (for next-gen GPUs, storage)

**Recommended Upgrades:**

- [ ] GPU upgrade to latest generation (if skipped Year 3)
- [ ] Storage: Migrate to larger, faster Gen 5 drives
- [ ] Memory: Upgrade to 192GB if needed, or faster speed (DDR5-7200+)
- [ ] Network: Evaluate multi-gigabit needs (10GbE, Wi-Fi 7)

**Maintenance:**

- [ ] Second thermal paste replacement
- [ ] Fan replacements (preventative, even if functional)
- [ ] Cable management review and replacement (any fraying)

### Year 5 (2029): End-of-Life Planning

**Platform Transition Decision:**

**Option A: Complete Platform Refresh (Recommended if >5 years)**

- New motherboard (AM6 or next-gen platform)
- New CPU (latest architecture)
- New RAM (DDR6 or mature DDR5)
- Keep GPU, storage, PSU, case (if still adequate)
- Estimated cost: $1500-2500

**Option B: Extended Service (If workload still adequate)**

- Final CPU upgrade to latest AM5 (if available)
- GPU upgrade to maximize platform
- Storage expansion
- Continue for 1-2 more years
- Estimated cost: $500-1500

**Decommission Planning:**

- Repurpose old components:
  - Old CPU/Mobo/RAM: Secondary workstation, server, NAS
  - Old GPU: Media server, machine learning test bed
  - Old storage: External backup drives
- Secure data disposal (DBAN, physical destruction for sensitive data)
- Recycle or donate non-functional components

**Decision Matrix:**

| Factor           | Platform Refresh                         | Extended Service                      |
| ---------------- | ---------------------------------------- | ------------------------------------- |
| Performance Need | High (new workloads)                     | Moderate (current workloads adequate) |
| Budget Available | $2000+                                   | <$1500                                |
| Platform Support | AM5 EOL imminent                         | AM5 still supported                   |
| Component Health | Failures emerging                        | All components healthy                |
| Technology Gap   | New features required (PCIe Gen 6, DDR6) | Current tech sufficient               |

---

## 11. Spare Parts & Inventory

### Critical Spare Parts

**Tier 1 (Keep on Hand):**

| Part                     | Quantity | Cost | Reason                  |
| ------------------------ | -------- | ---- | ----------------------- |
| SATA cables              | 4        | $10  | Cheap, prevent downtime |
| Fan splitters/extenders  | 2        | $10  | Fan failures            |
| Thermal paste (premium)  | 1 tube   | $15  | Emergency repaste       |
| CMOS battery (CR2032)    | 2        | $5   | BIOS settings loss      |
| Zip ties/cable ties      | 1 pack   | $5   | Cable management        |
| Compressed air           | 2 cans   | $15  | Regular cleaning        |
| Isopropyl alcohol (90%+) | 1 bottle | $10  | Cleaning                |
| Lint-free cloths         | 1 pack   | $10  | Cleaning                |

**Tier 2 (Source within 24 hours):**

| Part                     | Backup Plan                   | Reason                        |
| ------------------------ | ----------------------------- | ----------------------------- |
| Case fans (140mm, 120mm) | Amazon Prime, local store     | 24-48 hour replacement        |
| RAM (same model)         | Keep purchase link bookmarked | RMA can take weeks            |
| PSU cables (modular)     | Manufacturer direct           | Prevent cable damage downtime |
| M.2 NVMe drive (1TB)     | Amazon Prime                  | Emergency OS reinstall        |

**Tier 3 (RMA/Warranty):**

| Part        | Warranty Period        | RMA Process          |
| ----------- | ---------------------- | -------------------- |
| CPU         | 3 years (AMD)          | AMD RMA portal       |
| Motherboard | 3 years (Manufacturer) | Manufacturer RMA     |
| GPU         | 3 years (Manufacturer) | EVGA/ASUS/MSI RMA    |
| RAM         | Lifetime (most brands) | Contact manufacturer |
| PSU         | 7-10 years (Premium)   | Manufacturer RMA     |
| Storage     | 5 years (Samsung Pro)  | Samsung RMA          |

### Spare Parts Procurement

**Pre-Approved Vendors:**

- **Amazon:** Fast shipping, easy returns
- **Newegg:** Tech-specific, reliable
- **Micro Center:** Local pickup (if available)
- **B&H Photo:** Professional equipment, good stock

**Emergency Parts Kit:**

Create a labeled container with:

- SATA cables (x4)
- Fan splitters (x2)
- Thermal paste (1 tube Noctua NT-H2)
- CMOS battery (x2)
- Cable ties (50 pack)
- Anti-static wrist strap
- Screwdriver set (Phillips, Torx)
- Flashlight
- Multimeter (basic)

**Storage:**

- Cool, dry location
- ESD-safe bags for electronics
- Label with purchase date and expiration (thermal paste)

---

## 12. Troubleshooting Decision Trees

### System Won't POST

```
System won't POST (no display, no beep codes)
│
├─ No power (fans don't spin)?
│  ├─ YES → Check PSU switch, power cable, wall outlet
│  │        Test with PSU tester or multimeter
│  │        Replace PSU if failed
│  └─ NO → Continue to next check
│
├─ Fans spin but no display?
│  ├─ Check motherboard beep codes or debug LED
│  │  ├─ CPU error → Reseat CPU, check for bent pins
│  │  ├─ RAM error → Reseat RAM, try one stick at a time
│  │  ├─ VGA error → Reseat GPU, try onboard graphics (if available)
│  │  └─ No code → Check 24-pin, 8-pin CPU power
│  │
│  ├─ Clear CMOS (remove battery 5 min or use jumper)
│  ├─ Remove all non-essential components (extra RAM, GPU, drives)
│  ├─ Try minimal configuration (CPU, 1 RAM stick, onboard graphics)
│  └─ If still no POST → RMA motherboard or CPU
│
└─ Display shows something but stops?
   ├─ BIOS screen freeze → Update BIOS via Flashback
   ├─ Windows boot error → Boot to safe mode, check drivers
   └─ Kernel panic → Run memory test, check storage
```

### Thermal Issues

```
High Temperatures (CPU/GPU >90°C)
│
├─ Check monitoring software accuracy
│  └─ Verify with multiple tools (HWiNFO64, BIOS)
│
├─ Inspect cooling system
│  ├─ Fans spinning?
│  │  ├─ NO → Check fan connections, replace fan
│  │  └─ YES → Check fan speed (should increase with temp)
│  │
│  ├─ Heatsink/AIO mounted correctly?
│  │  ├─ Loose → Remount with fresh thermal paste
│  │  └─ Tight → Check for plastic peel (if new build)
│  │
│  ├─ Thermal paste application
│  │  ├─ Reapply thermal paste (pea method)
│  │  └─ Check for pump-out or drying
│  │
│  └─ Airflow obstructions?
│     ├─ Clean dust filters
│     ├─ Remove dust from heatsinks
│     └─ Improve cable management
│
├─ Check thermal throttling
│  ├─ CPU frequency dropping? → Thermal paste, cooler upgrade
│  └─ GPU frequency dropping? → Improve case airflow, repaste GPU
│
└─ If all else fails
   ├─ Upgrade cooler (better TDP rating)
   ├─ Add case fans (improve intake/exhaust)
   └─ Consider undervolting (reduce heat without major perf loss)
```

### Storage Issues

```
Storage Performance Degradation
│
├─ Check SMART health
│  ├─ CrystalDiskInfo shows warnings/errors
│  │  ├─ Reallocated sectors >0 → Backup immediately, plan replacement
│  │  ├─ Temperature >70°C → Add cooling (heatsink, fan)
│  │  └─ Wear >90% → Plan replacement soon
│  │
│  └─ SMART clean → Continue troubleshooting
│
├─ Run benchmark (CrystalDiskMark)
│  ├─ Sequential speed >50% lower than baseline?
│  │  ├─ Check thermal throttling (monitor temp during benchmark)
│  │  ├─ Verify PCIe Gen 4/5 mode (HWiNFO64, Device Manager)
│  │  └─ Update SSD firmware
│  │
│  └─ Random 4K speed degraded?
│     ├─ Run TRIM (Optimize Drives in Windows)
│     ├─ Check drive capacity (>80% full impacts performance)
│     └─ Defragment if HDD (never defrag SSD!)
│
├─ Check drive errors
│  ├─ Run CHKDSK: chkdsk /f /r D:
│  └─ Review Event Viewer for disk errors
│
└─ If unresolved
   ├─ Clone to new drive
   ├─ RMA if under warranty
   └─ Replace if out of warranty
```

### Network Connectivity Issues

```
Network Connection Problems
│
├─ Physical layer
│  ├─ Cable connected?
│  ├─ Link light on NIC and switch?
│  ├─ Try different cable
│  └─ Try different switch port
│
├─ Driver issues
│  ├─ Device Manager: Yellow exclamation?
│  │  └─ Update or rollback driver
│  ├─ Uninstall and reinstall driver
│  └─ Download latest from Intel/Realtek site
│
├─ Configuration
│  ├─ IP address obtained?
│  │  ├─ ipconfig /all
│  │  └─ ipconfig /release && ipconfig /renew
│  ├─ Ping gateway
│  │  └─ ping 192.168.1.1 (adjust for your network)
│  └─ DNS resolution working?
│     └─ nslookup google.com
│
├─ Firewall/Security
│  ├─ Temporarily disable Windows Firewall (test only)
│  └─ Check for VPN conflicts
│
└─ Hardware failure
   ├─ Test with USB Ethernet adapter
   ├─ Update NIC firmware
   └─ RMA motherboard if onboard NIC
```

---

## 13. Common Failure Modes

### Component-Specific Failures

#### CPU Failure (Rare)

**Symptoms:**

- System won't POST
- Random reboots under load
- WHEA errors in Event Viewer
- Calculation errors (Prime95 fails consistently)

**Diagnosis:**

1. Reseat CPU (check for bent pins on AM5 socket)
2. Test with known-good motherboard (if available)
3. Run Prime95 Small FFTs (if boots)
4. Check for overheating (>95°C)

**Resolution:**

- RMA CPU (AMD 3-year warranty)
- In-place replacement (usually no Windows reactivation needed)

**Prevention:**

- Avoid excessive voltage (>1.5V vCore)
- Monitor temperatures
- Use quality PSU (prevent voltage spikes)

#### Motherboard Failure (Moderate Risk)

**Symptoms:**

- No POST (most common)
- USB ports stop working
- Audio issues
- NIC failures
- BIOS corruption
- Capacitor bulging/leaking

**Diagnosis:**

1. Visual inspection (capacitors, burn marks)
2. Test with minimal configuration
3. Clear CMOS
4. BIOS Flashback to latest version
5. Test components in different motherboard

**Resolution:**

- RMA motherboard
- In-place replacement requires Windows reinstall (usually)

**Prevention:**

- Use UPS (prevent power surges)
- Avoid static discharge
- Don't overtighten CPU cooler
- Keep BIOS updated (stability fixes)

#### GPU Failure (Moderate Risk - High Power GPUs)

**Symptoms:**

- No display output
- Artifacts (colored dots, lines, corruption)
- Driver crashes (TDR errors)
- Fan failure (100% speed or 0% speed)
- Thermal throttling (memory junction >110°C)

**Diagnosis:**

1. Test in different PCIe slot
2. Test with different PSU cables
3. Test in different system (if possible)
4. Monitor temps with GPU-Z
5. Stress test with FurMark

**Resolution:**

- RMA GPU (3-year warranty typical)
- Thermal pad replacement (memory overheating)
- Fan replacement (if out of warranty)

**Prevention:**

- Ensure adequate PSU (850W+ for RTX 4090)
- Use separate PCIe power cables (not daisy-chain)
- Monitor memory junction temp (<95°C)
- Don't exceed power limit excessively

#### RAM Failure (Low Risk - Lifetime Warranty)

**Symptoms:**

- Random BSODs (MEMORY_MANAGEMENT, PAGE_FAULT_IN_NONPAGED_AREA)
- MemTest86 errors
- System instability
- Applications crashing

**Diagnosis:**

1. Run Windows Memory Diagnostic
2. Run MemTest86 (4+ passes)
3. Test one stick at a time
4. Try different DIMM slots

**Resolution:**

- RMA RAM (lifetime warranty on most brands)
- Continue using non-faulty sticks

**Prevention:**

- Don't exceed 1.5V VDIMM
- Ensure good case airflow (RAM temps <65°C)
- Use QVL-validated RAM

#### Storage Failure (Moderate Risk - Wear Item)

**Symptoms:**

- SMART warnings
- Slow performance
- Disappearing from BIOS
- File corruption
- Clicking sounds (HDD)
- System freezes during disk access

**Diagnosis:**

1. Check SMART (CrystalDiskInfo)
2. Run manufacturer diagnostic tool
3. Check Event Viewer for disk errors
4. Benchmark performance

**Resolution:**

- Immediate backup if any SMART warnings
- Clone to new drive
- RMA if under warranty

**Prevention:**

- Monitor SMART weekly
- Keep under 80% capacity
- Maintain <65°C temperature
- Use UPS (prevent power loss during writes)

#### PSU Failure (Low-Moderate Risk)

**Symptoms:**

- System won't power on
- Random shutdowns under load
- Voltage rail instability
- Coil whine (capacitor aging)
- Burning smell

**Diagnosis:**

1. Test with PSU tester
2. Measure voltages with multimeter
3. Test with known-good PSU
4. Check for bulging capacitors

**Resolution:**

- RMA PSU (7-10 year warranty on premium units)
- Replace immediately if burning smell

**Prevention:**

- Use quality 80+ Platinum/Titanium PSU
- Don't exceed 80% of rated wattage continuously
- Ensure good ventilation

#### AIO Liquid Cooler Failure (Moderate Risk)

**Symptoms:**

- Pump noise (grinding, clicking)
- CPU temps elevated >10°C
- Pump not detected in BIOS
- Visible leakage

**Diagnosis:**

1. Check pump RPM in BIOS/software
2. Feel pump vibration (should be subtle)
3. Listen for bubbling (air in loop)
4. Visual inspection for leaks

**Resolution:**

- RMA if under warranty
- Replace with new AIO or air cooler

**Prevention:**

- Mount radiator properly (hoses at bottom if top-mounted)
- Keep pump header connected to CPU_FAN or AIO_PUMP
- Monitor pump RPM weekly

---

## 14. Disaster Recovery

### Data Loss Scenarios

#### Scenario 1: Primary Drive Failure

**Impact:** OS won't boot, data inaccessible

**Recovery Procedure:**

1. **Immediate Actions**
   - Power off system
   - Do NOT attempt repairs if clicking/grinding sounds (HDD)
   - Assess data criticality

2. **Data Recovery (if no backup)**
   - Option A: Professional recovery service ($500-3000)
   - Option B: DIY recovery tools (TestDisk, Recuva, R-Studio)
   - Option C: Drive freezer method (last resort, unreliable)

3. **System Restoration**
   - Install new drive
   - Restore from backup (Macrium, Veeam, Windows Backup)
   - Alternative: Clean Windows install + data restore
   - Restore applications and configurations

4. **Post-Recovery**
   - Verify all data accessible
   - Update backup strategy (if failed)
   - Test restoration procedure

**Prevention:**

- Implement 3-2-1 backup rule
- Monitor SMART weekly
- Replace drives proactively (>5 years)

#### Scenario 2: Ransomware Attack

**Impact:** Files encrypted, system potentially compromised

**Recovery Procedure:**

1. **Isolation**
   - Immediately disconnect from network
   - Power off system
   - Do NOT pay ransom

2. **Assessment**
   - Identify ransomware variant (ID Ransomware tool)
   - Check for decryption tools (No More Ransom project)
   - Assess backup availability

3. **Recovery**
   - Wipe and reinstall OS (do NOT trust "cleaned" system)
   - Restore from pre-infection backup
   - Verify backup files not encrypted
   - Scan restored files with antivirus

4. **Post-Recovery Hardening**
   - Enable Controlled Folder Access (Windows)
   - Implement application whitelisting
   - Review email/download security practices
   - Enable offline/immutable backups

#### Scenario 3: Hardware Failure (Motherboard, PSU)

**Impact:** System inoperable, components potentially damaged

**Recovery Procedure:**

1. **Damage Assessment**
   - Visual inspection for burn marks, capacitor leakage
   - Test PSU with tester or multimeter
   - Identify failed component

2. **Component Testing**
   - Test other components in known-good system (if available)
   - Check for collateral damage (PSU failure can damage mobo, GPU)

3. **Replacement**
   - Order replacement part (RMA or purchase)
   - Install replacement
   - Test before connecting all components

4. **System Restoration**
   - If motherboard replaced: Windows may require reactivation
   - Update drivers (chipset, network, etc.)
   - Reconfigure BIOS settings
   - Stability test (24 hours)

#### Scenario 4: Fire/Flood/Theft

**Impact:** Complete system loss

**Recovery Procedure:**

1. **Insurance Claim**
   - Document all components (photos, receipts)
   - File claim with homeowner's/renter's insurance
   - Provide proof of value (purchase receipts, current market prices)

2. **Data Recovery**
   - Restore from off-site backup (cloud, external at different location)
   - If no off-site backup: Data loss is permanent

3. **System Rebuild**
   - Purchase equivalent or upgraded components
   - Rebuild following documented configuration
   - Restore OS and data from backups

**Prevention:**

- Maintain off-site backups (cloud, bank safe deposit box)
- Document system with photos and receipts
- Consider insurance rider for high-value systems

### Disaster Recovery Checklist

**Pre-Disaster Preparation:**

- [ ] 3-2-1 backup rule implemented
- [ ] Off-site backup tested monthly
- [ ] System documentation current (BIOS settings, drive layout, etc.)
- [ ] Purchase receipts stored safely
- [ ] Recovery media created (Windows USB, Linux live USB)
- [ ] Critical passwords stored in password manager (with offline backup)
- [ ] Spare parts inventory (see Section 11)

**Post-Disaster Recovery:**

- [ ] Assess damage and data loss
- [ ] Isolate failed components
- [ ] Test remaining components
- [ ] Order replacements
- [ ] Restore from backups
- [ ] Verify data integrity
- [ ] Update documentation
- [ ] Review and improve DR plan

---

## 15. End-of-Life Planning

### Component End-of-Life Indicators

| Component         | EOL Indicators                                                 | Typical Lifespan                  | Replacement Trigger                               |
| ----------------- | -------------------------------------------------------------- | --------------------------------- | ------------------------------------------------- |
| **CPU**           | Performance inadequate for workload, platform obsolescence     | 5-7 years                         | New platform offers >30% improvement              |
| **Motherboard**   | Capacitor aging, USB/SATA failures, BIOS updates ceased        | 5-7 years                         | Hardware failures, platform upgrade               |
| **GPU**           | VRAM limitation, driver support ended, fan failure             | 3-5 years                         | Workload demands, new gen offers >40% improvement |
| **RAM**           | Capacity insufficient, speed bottleneck, failures              | 7-10 years                        | Capacity needs, platform upgrade                  |
| **Storage (SSD)** | TBW >80%, SMART warnings, performance degradation              | 5-10 years                        | SMART warnings, capacity needs                    |
| **PSU**           | Coil whine, voltage instability, capacitor aging               | 7-10 years                        | Efficiency loss, inadequate wattage               |
| **Case**          | Damage, outdated I/O, poor airflow                             | 10+ years                         | Aesthetics, airflow needs                         |
| **Cooling**       | Pump failure (AIO), fan bearing noise, performance degradation | 5-7 years (AIO), 5-10 years (air) | Noise, thermal performance                        |

### Decommissioning Procedure

**1. Data Security (Critical)**

```powershell
# Secure data erasure (before disposal or resale)

# Option A: DBAN (Darik's Boot and Nuke) - HDD/SSD
# - Create bootable USB with DBAN
# - Boot from USB
# - Select DoD 5220.22-M (3 passes) or higher
# - WARNING: IRREVERSIBLE

# Option B: ATA Secure Erase (SSD - fastest, most effective)
# Using hdparm (Linux live USB)
hdparm --user-master u --security-set-pass password /dev/sdX
hdparm --user-master u --security-erase password /dev/sdX

# Option C: Manufacturer tool (Samsung, Intel, etc.)
# Samsung Magician: Drive Details > Secure Erase

# Option D: Physical destruction (most secure for sensitive data)
# - Remove platters from HDD, physically destroy
# - Drill holes through SSD NAND chips
# - Use professional shredding service
```

**2. Component Repurposing**

**Workstation Components:**

- **CPU/Mobo/RAM:** Build secondary workstation, home server, NAS
- **GPU:** Media server, machine learning test bed, mining rig
- **Storage:** External backup drives (USB enclosures)
- **PSU:** Reuse in new build if <5 years old and adequate wattage
- **Case:** Reuse for new build or donate
- **Cooling:** Reuse if functional, donate otherwise

**Example: Budget NAS Build from Old Components**

- Motherboard: X670E (repurposed)
- CPU: Ryzen 9 9950X (repurposed)
- RAM: 64GB DDR5 (repurposed)
- Storage: New 4x 4TB HDDs (RAID 5/6)
- PSU: Repurposed or new efficient unit
- Case: Fractal Design Define R7 (new, optimized for quiet NAS)
- OS: TrueNAS SCALE, Unraid, or OpenMediaVault

**3. Donation/Recycling**

**Donation Options:**

- Schools, libraries, non-profits
- Local computer refurbishers
- Goodwill, Salvation Army (ensure data wiped!)

**Recycling Options:**

- Best Buy (free electronics recycling)
- Local e-waste recycling centers
- Manufacturer take-back programs (Dell, HP)

**Hazardous Materials:**

- Batteries (CMOS, UPS)
- CRTs/monitors (contain lead)
- Dispose at hazardous waste facilities

### Platform Migration Planning

**When to Migrate:**

- Current platform >5 years old
- Motherboard BIOS updates ceased
- New platform offers >30% performance improvement
- Current platform limits upgrades (RAM speed, PCIe Gen, etc.)

**Migration Checklist:**

**3-6 Months Before:**

- [ ] Research next-gen platforms (AMD Zen 6/7, Intel Arrow Lake/Lunar Lake)
- [ ] Monitor component prices and availability
- [ ] Plan budget ($1500-3000 for CPU/Mobo/RAM)
- [ ] Decide on component reuse (GPU, storage, PSU, case)

**1 Month Before:**

- [ ] Purchase new components during sales (Black Friday, Prime Day)
- [ ] Download all necessary drivers and software
- [ ] Create full system backup
- [ ] Document current system configuration

**Migration Week:**

- [ ] Clone primary drive to new drive (fresh start recommended)
- [ ] Disassemble old system (careful labeling for repurposing)
- [ ] Assemble new system (following best practices)
- [ ] Install OS and restore data
- [ ] Migrate software licenses (if transferable)
- [ ] Run stability tests (48 hours)

**Post-Migration:**

- [ ] Repurpose or dispose of old components
- [ ] Update documentation
- [ ] Establish new baselines (benchmarks, thermals)
- [ ] Review and update backup strategy

---

## Appendix A: Maintenance Log Template

**System Information:**

- Build Date: ******\_\_\_******
- CPU: ******\_\_\_******
- Motherboard: ******\_\_\_******
- GPU: ******\_\_\_******
- RAM: ******\_\_\_******
- Storage: ******\_\_\_******
- PSU: ******\_\_\_******
- Cooling: ******\_\_\_******

**Maintenance History:**

| Date       | Task          | Notes                        | Next Due   |
| ---------- | ------------- | ---------------------------- | ---------- |
| 2025-01-15 | Initial build | Baseline benchmarks recorded | 2025-02-15 |
|            |               |                              |            |
|            |               |                              |            |

**Performance Baselines:**

| Benchmark                | Initial | Q1  | Q2  | Q3  | Q4  |
| ------------------------ | ------- | --- | --- | --- | --- |
| Cinebench R23 Multi      |         |     |     |     |     |
| Cinebench R23 Single     |         |     |     |     |     |
| 3DMark Time Spy          |         |     |     |     |     |
| CrystalDiskMark Seq Read |         |     |     |     |     |

**Component Replacement History:**

| Date | Component | Reason | Cost |
| ---- | --------- | ------ | ---- |
|      |           |        |      |

---

## Appendix B: Emergency Contact List

**Technical Support:**

- AMD CPU Support: https://www.amd.com/en/support
- Motherboard Manufacturer: [Insert link]
- GPU Manufacturer: [Insert link]
- PSU Manufacturer: [Insert link]

**RMA Portals:**

- AMD: https://www.amd.com/en/support/kb/warranty-information
- ASUS: https://www.asus.com/support/
- MSI: https://www.msi.com/support
- EVGA: https://www.evga.com/support/

**Data Recovery:**

- DriveSavers: 1-800-440-1904 (Professional recovery)
- Ontrack: 1-800-872-2599 (Professional recovery)

**Insurance:**

- Homeowner's/Renter's Insurance: [Insert contact]

---

## Appendix C: Useful Commands & Scripts

### Windows Performance Monitoring

```powershell
# System Health Summary
Get-ComputerInfo | Select-Object CsName, WindowsVersion, OsArchitecture, CsTotalPhysicalMemory

# Temperature Monitoring (requires Open Hardware Monitor WMI)
Get-WmiObject -Namespace "root\OpenHardwareMonitor" -Class Sensor |
    Where-Object {$_.SensorType -eq "Temperature"} |
    Select-Object Name, Value

# Storage Health
Get-PhysicalDisk | Get-StorageReliabilityCounter |
    Select-Object DeviceID, Temperature, Wear, ReadErrorsTotal, WriteErrorsTotal

# Network Performance
Get-NetAdapterStatistics | Select-Object Name, ReceivedBytes, SentBytes, ReceivedUnicastPackets, SentUnicastPackets
```

### Automated Backup Script

```powershell
# Weekly Full Backup to NAS
$source = "C:\Users\$env:USERNAME"
$destination = "\\NAS\Backups\Workstation\$(Get-Date -Format 'yyyy-MM-dd')"
$logPath = "C:\Maintenance\Logs\backup-log.txt"

# Create backup using Robocopy
robocopy $source $destination /MIR /R:3 /W:5 /LOG:$logPath /NP /NDL

# Verify backup
if ($LASTEXITCODE -le 7) {
    Add-Content "C:\Maintenance\Logs\backup-status.txt" "$(Get-Date): Backup SUCCESS"
} else {
    Add-Content "C:\Maintenance\Logs\backup-status.txt" "$(Get-Date): Backup FAILED (Exit Code: $LASTEXITCODE)"
    # Send email alert
}
```

---

## Document Revision History

| Version | Date       | Changes          | Author                 |
| ------- | ---------- | ---------------- | ---------------------- |
| 1.0     | 2025-11-02 | Initial creation | Maintenance Specialist |

---

**END OF DOCUMENT**

_This lifecycle management guide should be reviewed and updated annually to reflect technological changes, component updates, and lessons learned from operational experience._
