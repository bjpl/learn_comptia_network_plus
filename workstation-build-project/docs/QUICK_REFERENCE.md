# Quick Reference Guide

## 4x RTX 4090 AI Workstation Build

**Last Updated:** 2025-11-02
**Project Budget:** $17,972
**Estimated Build Time:** 6-8 hours

---

## 📋 Component Summary

| Component            | Model                                 | Qty | Price  |
| -------------------- | ------------------------------------- | --- | ------ |
| **CPU**              | AMD Threadripper PRO 7975WX (32C/64T) | 1   | $3,899 |
| **Motherboard**      | ASUS Pro WS WRX90E-SAGE SE            | 1   | $1,299 |
| **RAM**              | Kingston 64GB DDR5-5600 ECC           | 8   | $3,200 |
| **GPU**              | PNY RTX 4090 24GB XLR8                | 4   | $7,200 |
| **PSU Primary**      | EVGA SuperNOVA 1600 T2 Titanium       | 1   | $599   |
| **PSU Secondary**    | EVGA SuperNOVA 1000 T2 Titanium       | 1   | $300   |
| **Storage (OS)**     | Samsung 990 PRO 2TB NVMe              | 1   | $150   |
| **Storage (Models)** | Crucial T705 4TB NVMe PCIe 5.0        | 2   | $700   |
| **Case**             | Phanteks Enthoo Pro 2 Server          | 1   | $250   |
| **Cooling**          | Noctua iPPC-3000 140mm Fans           | 6   | $180   |
| **Network**          | Mellanox ConnectX-4 Lx 25GbE          | 1   | $200   |
| **Remote**           | PiKVM v4                              | 1   | $75    |
| **Misc**             | Cables, paste, Add2PSU adapter        | -   | $120   |

---

## ⚡ Power & Thermal Specs

**Total System Power:**

- GPUs: 1800W (4x 450W)
- CPU: 350W
- System: 50W
- **Total Peak:** 2200W
- **PSU Capacity:** 2600W (18% headroom)

**Thermal Output:**

- 7,500 BTU/hr sustained
- **Room AC Required:** 12,000-18,000 BTU/hr

**Temperature Targets:**

- CPU: 60-75°C load
- GPU: 75-85°C load (gradient across 4 cards)
- Memory Junction (GPU): <95°C
- Storage: <60°C

---

## 🔌 PCIe Lane Allocation (128 Total)

| Slot   | Device                   | Lanes | Speed    |
| ------ | ------------------------ | ----- | -------- |
| PCIE1  | RTX 4090 #1              | x16   | PCIe 5.0 |
| PCIE2  | RTX 4090 #2              | x16   | PCIe 5.0 |
| PCIE3  | RTX 4090 #3              | x16   | PCIe 5.0 |
| PCIE4  | RTX 4090 #4              | x16   | PCIe 5.0 |
| PCIE5  | Samsung 990 PRO (OS)     | x4    | PCIe 4.0 |
| PCIE6  | Crucial T705 #1 (Models) | x4    | PCIe 5.0 |
| PCIE7  | Crucial T705 #2 (Models) | x4    | PCIe 5.0 |
| Slot 8 | Mellanox 25GbE           | x8    | PCIe 3.0 |

**Remaining:** 68 lanes available for expansion

---

## 💾 Memory Configuration

**8-Channel DDR5-5600 ECC**

- Total: 512GB (8x 64GB)
- Bandwidth: 358 GB/s
- Configuration: All 8 channels populated
- Timings: Follow motherboard QVL recommendations

**Population Order:**

1. A1, B1, C1, D1, E1, F1, G1, H1 (first)
2. Verify boot
3. Optimal for 8-channel operation

---

## 🌐 Network Configuration

**Interfaces:**

- **10GbE (onboard):** Management, general traffic
- **25GbE #1 (Mellanox):** High-speed data, model downloads
- **25GbE #2 (Mellanox):** RDMA, distributed computing
- **1GbE (IPMI):** Out-of-band management

**Expected Performance:**

- 10GbE: ~9.4 Gbps (1.2 GB/s)
- 25GbE: ~23 Gbps (2.9 GB/s)
- RDMA: 1-3 μs latency

---

## 💿 Storage Configuration

**OS Drive (M.2 #1):**

- Samsung 990 PRO 2TB
- PCIe 4.0 x4
- 7,450 MB/s reads
- Use: Ubuntu, CUDA, frameworks

**Model Storage (M.2 #2 + #3 - RAID 0):**

- 2x Crucial T705 4TB
- PCIe 5.0 x4 each
- 14,500 MB/s per drive
- **RAID 0:** 29 GB/s combined
- Use: Model files, datasets

**405B Model Loading Time:**

- File size: ~200GB
- Expected: 7-10 seconds (RAID 0)

---

## 🖥️ Software Stack

**Operating System:**

- Ubuntu 22.04 LTS Server (headless)

**Core Software:**

- NVIDIA Driver: 550+
- CUDA Toolkit: 12.4
- Docker + NVIDIA Container Toolkit

**Inference Frameworks:**

- **vLLM:** Distributed inference with PagedAttention
- **ExLlamaV2:** Quantized model acceleration
- **Ollama:** Simple model management
- **TGI:** Production inference server

**Monitoring:**

- Prometheus + Grafana
- nvidia-smi + DCGM
- System dashboards

---

## 🛠️ Assembly Sequence

**Phase 1: Preparation (60 min)**

1. Unpack and inventory all components
2. Set up ESD-safe workspace
3. Install fans in case
4. Prepare tools

**Phase 2: Outside-Case Build (90 min)**

1. Install CPU on motherboard
2. Install 8x 64GB RAM modules
3. Install CPU cooler
4. Test POST outside case

**Phase 3: Case Installation (60 min)**

1. Install motherboard in case
2. Install both PSUs (bottom + mid chamber)
3. Connect Add2PSU adapter
4. Route motherboard power cables

**Phase 4: Storage & Network (30 min)**

1. Install 3x NVMe drives
2. Install Mellanox 25GbE card
3. Cable management

**Phase 5: GPU Installation (90 min)**

1. Install GPU #1 (bottom slot, PCIE1)
2. Install GPU #2 (PCIE2)
3. Install GPU #3 (PCIE3)
4. Install GPU #4 (top slot, PCIE4)
5. Connect all 12VHPWR power cables

**Phase 6: Final Assembly (30 min)**

1. Cable management and zip ties
2. Final inspection
3. Close case panels

**Phase 7: BIOS & OS (60 min)**

1. Configure BIOS settings
2. Install Ubuntu 22.04 LTS
3. Initial boot verification

**Phase 8: Testing (120 min)**

1. GPU recognition test
2. Memory stress test (30 min)
3. GPU stress test (60 min)
4. Storage benchmark
5. Network speed test

**Total Time:** 6-8 hours

---

## 🔧 Critical BIOS Settings

**Memory:**

- Enable all 8 channels
- XMP/EXPO Profile: Enabled
- Memory Clock: 5600 MHz
- ECC: Enabled

**PCIe:**

- Bifurcation: Auto (or manual x16/x16/x16/x16)
- PCIe Speed: Gen 5 (or Auto)
- Above 4G Decoding: Enabled
- Resizable BAR: Enabled

**CPU:**

- PBO (Precision Boost): Auto
- SMT: Enabled
- Core Performance Boost: Enabled

**Cooling:**

- Fan Control: PWM
- CPU Fan: 40% idle, 80% at 75°C
- Chassis Fans: 30% idle, 70% at 50°C

**Boot:**

- Fast Boot: Disabled (during setup)
- CSM: Disabled
- Secure Boot: Optional

---

## 🧪 Testing Checklist

**Hardware Verification:**

- [ ] All 4 GPUs detected (`nvidia-smi`)
- [ ] 512GB RAM recognized
- [ ] All NVMe drives detected
- [ ] 25GbE network interfaces up
- [ ] IPMI accessible
- [ ] All fans spinning

**Stress Testing:**

- [ ] CPU: Prime95 (30 min, temps <85°C)
- [ ] RAM: memtest86+ (1 pass minimum)
- [ ] GPUs: gpu-burn (60 min each, temps <90°C)
- [ ] Storage: fio benchmark (>20 GB/s RAID)
- [ ] Network: iperf3 (>20 Gbps on 25GbE)

**Software Verification:**

- [ ] CUDA toolkit installed (`nvcc --version`)
- [ ] Docker running (`docker ps`)
- [ ] Multi-GPU available (`nvidia-smi topo -m`)
- [ ] vLLM installed and functional
- [ ] Monitoring stack operational

---

## 📊 Performance Expectations

**Compute:**

- **FP32:** 330 TFLOPS combined
- **Tensor (FP16):** 2640 TFLOPS combined
- **VRAM:** 96GB total

**Inference Performance:**

- 70B model: ~40 tokens/sec (FP16)
- 405B model: ~8-12 tokens/sec (quantized)
- Stable Diffusion XL: ~2.5 sec/image per GPU

**Data Throughput:**

- Storage: 29 GB/s (RAID 0 reads)
- Network: 2.9 GB/s (25GbE)
- Memory: 358 GB/s (DDR5)
- GPU: 4 TB/s combined (VRAM bandwidth)

**Model Loading:**

- 70B (~140GB): 5 seconds
- 405B (~200GB): 7-10 seconds

---

## 🚨 Safety & Warnings

**Electrical:**

- ⚠️ **2200W load** - Requires dedicated 20A circuit
- ⚠️ **Dual PSU** - Must use Add2PSU adapter for sync
- ⚠️ **12VHPWR** - Ensure full connector seating (RTX 4090 fire risk)

**Thermal:**

- ⚠️ **7,500 BTU/hr** - Room AC mandatory for sustained loads
- ⚠️ **GPU Memory Junction** - Monitor <95°C (GDDR6X thermal limit)
- ⚠️ **Airflow** - Maintain front-to-back, no obstructions

**ESD:**

- ⚠️ **$17K+ components** - Always use ESD wrist strap
- ⚠️ **GPUs are sensitive** - Handle by bracket only

**Mechanical:**

- ⚠️ **GPU Weight** - 4x RTX 4090s = ~10 lbs, use support brackets
- ⚠️ **Clearance** - Verify 3-slot spacing before installing

---

## 🆘 Troubleshooting Quick Reference

**System Won't POST:**

1. Verify 24-pin + dual 8-pin EPS connected
2. Check RAM seated properly (8-channel config)
3. Remove all GPUs, test with iGPU or single GPU
4. Clear CMOS, retry

**GPU Not Detected:**

1. Verify 12VHPWR fully seated (hear click)
2. Check PCIe bifurcation in BIOS
3. Reseat GPU in slot
4. Test GPU in known-working slot

**High Temperatures:**

1. Verify all fans spinning (6x chassis + GPU fans)
2. Check fan curves in BIOS
3. Verify thermal paste application
4. Check room ambient temperature
5. Clean dust filters

**Network Slow:**

1. Check MTU 9000 (jumbo frames)
2. Verify 25GbE link speed (`ethtool`)
3. Check switch configuration
4. Test with iperf3

**Storage Slow:**

1. Verify PCIe 5.0 negotiation (`lspci -vv`)
2. Check RAID 0 configuration
3. Run fio benchmark for baseline
4. Monitor SMART data for issues

---

## 📞 Support Resources

**Motherboard:**

- ASUS Support: https://www.asus.com/support/
- Manual: Download from ASUS website

**GPUs:**

- NVIDIA Driver Downloads: https://www.nvidia.com/drivers
- CUDA Toolkit: https://developer.nvidia.com/cuda-toolkit

**Software:**

- Ubuntu Documentation: https://ubuntu.com/server/docs
- vLLM Docs: https://docs.vllm.ai/
- Docker: https://docs.docker.com/

**Community:**

- r/homelab (Reddit)
- r/LocalLLaMA (Reddit)
- ServeTheHome Forums

---

## 📝 Maintenance Schedule

**Daily:**

- Monitor temperatures via Grafana
- Check system logs for errors

**Weekly:**

- Review GPU utilization metrics
- Verify all fans operational
- Check storage health (SMART)

**Monthly:**

- Clean front dust filters
- Verify backup integrity
- Update monitoring dashboards

**Quarterly:**

- Deep clean case interior
- Update firmware (BIOS, GPU vBIOS)
- Review and update software stack
- Performance regression testing

**Annually:**

- Replace thermal paste
- Inspect and replace any worn fans
- Review and test disaster recovery plan
- Plan hardware refresh

---

## 💰 Cost vs Cloud Comparison

**System Cost:** $17,972
**AWS p4d.24xlarge equivalent:** $32.77/hour

**Break-Even Analysis:**

- Hours to ROI: 548 hours (~23 days of 24/7 use)
- Monthly savings (24/7): ~$22,600
- Annual savings: ~$271,000

**Note:** System pays for itself in less than 1 month of continuous use.

---

## 🎯 Next Steps After Build

1. **Week 1:** System burn-in and baseline testing
2. **Week 2:** Production workload validation
3. **Week 3:** Optimization and tuning
4. **Week 4:** Monitoring and alerting refinement
5. **Ongoing:** Regular maintenance and upgrades

---

## 📁 Full Documentation Links

For complete details, see:

- **Hardware:** `/docs/hardware/architecture-specification.md`
- **Software:** `/docs/software/stack-configuration.md`
- **Assembly:** `/docs/assembly/build-guide.md`
- **Network:** `/docs/network/infrastructure-architecture.md`
- **Cooling:** `/docs/cooling/thermal-power-management.md`
- **Maintenance:** `/docs/maintenance/lifecycle-management.md`
- **Checklists:** `/checklists/assembly-sequence.md`

---

**Project Status:** ✅ Design Complete - Ready for Procurement
