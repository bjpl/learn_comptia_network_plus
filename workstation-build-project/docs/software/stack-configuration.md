# AI Workstation Software Stack Configuration Guide

**System Specifications**: Ubuntu 22.04 LTS Server | 4x RTX 4090 | AMD Threadripper PRO 7975WX | 512GB DDR5 ECC | 25GbE Networking

---

## Table of Contents

1. [OS Installation](#1-os-installation)
2. [CUDA Toolkit Setup](#2-cuda-toolkit-setup)
3. [NVIDIA Driver Installation](#3-nvidia-driver-installation)
4. [Docker & Container Runtime](#4-docker--container-runtime)
5. [Inference Framework Setup](#5-inference-framework-setup)
6. [Network Optimization](#6-network-optimization)
7. [Storage Optimization](#7-storage-optimization)
8. [Security Hardening](#8-security-hardening)
9. [Monitoring Setup](#9-monitoring-setup)
10. [Automation Scripts](#10-automation-scripts)
11. [Backup & Disaster Recovery](#11-backup--disaster-recovery)
12. [Performance Tuning](#12-performance-tuning)

---

## 1. OS Installation

### 1.1 Ubuntu 22.04 LTS Server Installation

**Download ISO**:

```bash
# From another machine, download Ubuntu 22.04 LTS Server
wget https://releases.ubuntu.com/22.04/ubuntu-22.04.5-live-server-amd64.iso

# Verify checksum
sha256sum ubuntu-22.04.5-live-server-amd64.iso
```

**Create Bootable USB**:

```bash
# Linux
sudo dd if=ubuntu-22.04.5-live-server-amd64.iso of=/dev/sdX bs=4M status=progress && sync

# Windows (use Rufus or balenaEtcher)
```

### 1.2 Installation Steps

1. **Boot from USB** and select "Install Ubuntu Server"
2. **Language**: English
3. **Keyboard Layout**: US
4. **Network Configuration**:
   - Configure 10GbE onboard NIC with static IP
   - Example: `192.168.1.100/24`, Gateway: `192.168.1.1`
   - DNS: `1.1.1.1, 8.8.8.8`
5. **Proxy**: Leave blank (unless required)
6. **Mirror**: Default Ubuntu mirror
7. **Storage Configuration**: Custom layout

### 1.3 Storage Layout

**Disk Partitioning Scheme**:

```bash
# Disk 1: 2TB Samsung 990 PRO (OS/Software)
/dev/nvme0n1p1: 1GB    EFI System Partition
/dev/nvme0n1p2: 4GB    /boot (ext4)
/dev/nvme0n1p3: 100GB  / (ext4)
/dev/nvme0n1p4: 64GB   swap
/dev/nvme0n1p5: 1.8TB  /var (ext4) - Docker, logs, temp

# Disk 2 & 3: 2x 4TB Crucial T705 (Model Storage - RAID 0)
# Configure after OS installation
```

**Installation Selections**:

- Profile: `admin` / (secure password)
- Hostname: `ai-workstation-01`
- Install OpenSSH Server: **Yes**
- Import SSH identity: (optional, from GitHub)
- Featured Server Snaps: **None** (install manually later)

### 1.4 Post-Installation First Boot

```bash
# SSH into system
ssh admin@192.168.1.100

# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y \
    build-essential \
    git \
    wget \
    curl \
    vim \
    htop \
    tmux \
    net-tools \
    sysstat \
    iotop \
    nvme-cli \
    lm-sensors \
    smartmontools

# Set timezone
sudo timedatectl set-timezone America/New_York

# Configure hostname
sudo hostnamectl set-hostname ai-workstation-01
```

---

## 2. CUDA Toolkit Setup

### 2.1 CUDA 12.4 Installation

**Prerequisites**:

```bash
# Verify kernel version
uname -r  # Should be 5.15+ for Ubuntu 22.04

# Install kernel headers
sudo apt install -y linux-headers-$(uname -r)
```

**Download and Install CUDA**:

```bash
# Add NVIDIA CUDA repository
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update

# Install CUDA Toolkit 12.4
sudo apt install -y cuda-toolkit-12-4

# Install CUDA development tools
sudo apt install -y cuda-compiler-12-4 cuda-libraries-dev-12-4
```

### 2.2 Environment Configuration

**Add to ~/.bashrc**:

```bash
# CUDA Configuration
export CUDA_HOME=/usr/local/cuda-12.4
export PATH=$CUDA_HOME/bin:$PATH
export LD_LIBRARY_PATH=$CUDA_HOME/lib64:$LD_LIBRARY_PATH
export CUDA_VISIBLE_DEVICES=0,1,2,3

# cuDNN Configuration (if installed)
export CUDNN_PATH=/usr/local/cuda-12.4
```

**Apply changes**:

```bash
source ~/.bashrc

# Verify CUDA installation
nvcc --version
# Expected: Cuda compilation tools, release 12.4
```

### 2.3 cuDNN Installation (Optional for Deep Learning)

```bash
# Download cuDNN from NVIDIA (requires account)
# https://developer.nvidia.com/cudnn

# Example installation (update version as needed)
tar -xzvf cudnn-linux-x86_64-8.9.7.29_cuda12-archive.tar.xz
sudo cp cudnn-*-archive/include/cudnn*.h /usr/local/cuda-12.4/include
sudo cp -P cudnn-*-archive/lib/libcudnn* /usr/local/cuda-12.4/lib64
sudo chmod a+r /usr/local/cuda-12.4/include/cudnn*.h /usr/local/cuda-12.4/lib64/libcudnn*
```

---

## 3. NVIDIA Driver Installation

### 3.1 Install NVIDIA Drivers

```bash
# Remove any existing NVIDIA drivers
sudo apt remove --purge -y nvidia-* libnvidia-*
sudo apt autoremove -y

# Add NVIDIA driver repository
sudo add-apt-repository ppa:graphics-drivers/ppa -y
sudo apt update

# Install NVIDIA driver 545+ (required for CUDA 12.4)
sudo apt install -y nvidia-driver-550

# Reboot system
sudo reboot
```

### 3.2 Verify Driver Installation

```bash
# Check NVIDIA driver
nvidia-smi

# Expected output:
# +-----------------------------------------------------------------------------------------+
# | NVIDIA-SMI 550.xx.xx              Driver Version: 550.xx.xx       CUDA Version: 12.4   |
# |---------|-------------------------|-------------------------|-------------------------|
# | GPU  Name                  TCC/WDDM  | Bus-Id        Disp.A | Volatile Uncorr. ECC    |
# | Fan  Temp  Perf            Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M.  |
# |===============================+======================+======================|
# |   0  NVIDIA GeForce RTX 4090    Off | 00000000:01:00.0 Off |                  Off    |
# | 30%   35C    P8                25W / 450W |      0MiB / 24564MiB |      0%      Default  |
# |   1  NVIDIA GeForce RTX 4090    Off | 00000000:02:00.0 Off |                  Off    |
# |   2  NVIDIA GeForce RTX 4090    Off | 00000000:03:00.0 Off |                  Off    |
# |   3  NVIDIA GeForce RTX 4090    Off | 00000000:04:00.0 Off |                  Off    |
# +-----------------------------------------------------------------------------------------+
```

### 3.3 Multi-GPU Configuration

**Verify PCIe Topology**:

```bash
nvidia-smi topo -m

# Expected: Each GPU should show direct PCIe connection to CPU
# Example output:
#         GPU0    GPU1    GPU2    GPU3    CPU Affinity    NUMA Affinity
# GPU0     X      SYS     SYS     SYS     0-31,64-95     0
# GPU1    SYS      X      SYS     SYS     32-63,96-127   1
# GPU2    SYS     SYS      X      SYS     0-31,64-95     0
# GPU3    SYS     SYS     SYS      X      32-63,96-127   1
```

**GPU Persistence Mode**:

```bash
# Enable persistence mode (faster startup, lower latency)
sudo nvidia-smi -pm 1

# Make persistent across reboots
sudo systemctl enable nvidia-persistenced
sudo systemctl start nvidia-persistenced
```

**Power Management**:

```bash
# Set maximum power limit (optional, for stability)
sudo nvidia-smi -pl 400  # 400W per GPU (down from 450W default)

# Disable auto boost (for consistent performance)
sudo nvidia-smi -ac 10501,2520  # Memory,Graphics clocks
```

### 3.4 Create Persistence Script

**Create /etc/systemd/system/nvidia-gpu-config.service**:

```ini
[Unit]
Description=NVIDIA GPU Configuration
After=nvidia-persistenced.service

[Service]
Type=oneshot
ExecStart=/usr/bin/nvidia-smi -pm 1
ExecStart=/usr/bin/nvidia-smi -pl 400
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
```

**Enable service**:

```bash
sudo systemctl daemon-reload
sudo systemctl enable nvidia-gpu-config.service
sudo systemctl start nvidia-gpu-config.service
```

---

## 4. Docker & Container Runtime

### 4.1 Docker Installation

```bash
# Remove old Docker versions
sudo apt remove -y docker docker-engine docker.io containerd runc

# Install dependencies
sudo apt install -y \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Add Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker

# Verify Docker installation
docker --version
docker run hello-world
```

### 4.2 NVIDIA Container Toolkit

```bash
# Add NVIDIA Container Toolkit repository
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list

# Install NVIDIA Container Toolkit
sudo apt update
sudo apt install -y nvidia-container-toolkit

# Configure Docker to use NVIDIA runtime
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Verify GPU access in containers
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi
```

### 4.3 Docker Configuration Optimization

**Edit /etc/docker/daemon.json**:

```json
{
  "runtimes": {
    "nvidia": {
      "path": "nvidia-container-runtime",
      "runtimeArgs": []
    }
  },
  "default-runtime": "nvidia",
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m",
    "max-file": "5"
  },
  "storage-driver": "overlay2",
  "storage-opts": ["overlay2.override_kernel_check=true"],
  "data-root": "/var/lib/docker",
  "exec-opts": ["native.cgroupdriver=systemd"],
  "live-restore": true,
  "userland-proxy": false,
  "no-new-privileges": true,
  "icc": false,
  "default-ulimits": {
    "nofile": {
      "Name": "nofile",
      "Hard": 64000,
      "Soft": 64000
    }
  }
}
```

**Restart Docker**:

```bash
sudo systemctl restart docker
sudo systemctl status docker
```

---

## 5. Inference Framework Setup

### 5.1 vLLM (Distributed Inference)

**Installation**:

```bash
# Create virtual environment
python3 -m venv ~/venv/vllm
source ~/venv/vllm/bin/activate

# Install vLLM
pip install vllm==0.5.0

# Verify installation
python -c "import vllm; print(vllm.__version__)"
```

**Docker Deployment**:

```bash
# Pull vLLM image
docker pull vllm/vllm-openai:latest

# Run vLLM server (4x GPU)
docker run -d \
    --name vllm-server \
    --gpus all \
    -p 8000:8000 \
    -v ~/.cache/huggingface:/root/.cache/huggingface \
    -e CUDA_VISIBLE_DEVICES=0,1,2,3 \
    vllm/vllm-openai:latest \
    --model meta-llama/Llama-3.1-405B-Instruct \
    --tensor-parallel-size 4 \
    --max-model-len 8192 \
    --gpu-memory-utilization 0.95
```

**vLLM Configuration File** (~/.vllm/config.yaml):

```yaml
model: meta-llama/Llama-3.1-405B-Instruct
tensor_parallel_size: 4
pipeline_parallel_size: 1
max_model_len: 8192
gpu_memory_utilization: 0.95
trust_remote_code: true
download_dir: /models
dtype: auto
max_num_batched_tokens: 16384
max_num_seqs: 256
```

### 5.2 ExLlamaV2 (Quantized Models)

**Installation**:

```bash
# Create virtual environment
python3 -m venv ~/venv/exllamav2
source ~/venv/exllamav2/bin/activate

# Install ExLlamaV2
pip install exllamav2

# Clone repository for examples
git clone https://github.com/turboderp/exllamav2 ~/exllamav2
cd ~/exllamav2
```

**Run ExLlamaV2 Server**:

```bash
# Single GPU example (for smaller models)
python examples/server.py \
    --model /models/Llama-3.1-70B-Instruct-exl2 \
    --host 0.0.0.0 \
    --port 5000 \
    --gpu-split 24

# Multi-GPU example (4x GPUs)
python examples/server.py \
    --model /models/Llama-3.1-405B-Instruct-exl2 \
    --host 0.0.0.0 \
    --port 5000 \
    --gpu-split 24,24,24,24
```

### 5.3 Ollama (Simple Management)

**Installation**:

```bash
# Install Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Verify installation
ollama --version

# Start Ollama service
sudo systemctl start ollama
sudo systemctl enable ollama
```

**Configure Ollama** (/etc/systemd/system/ollama.service.d/override.conf):

```ini
[Service]
Environment="OLLAMA_HOST=0.0.0.0:11434"
Environment="OLLAMA_NUM_PARALLEL=4"
Environment="OLLAMA_MAX_LOADED_MODELS=2"
Environment="OLLAMA_KEEP_ALIVE=24h"
Environment="CUDA_VISIBLE_DEVICES=0,1,2,3"
```

**Reload and restart**:

```bash
sudo systemctl daemon-reload
sudo systemctl restart ollama
```

**Pull and run models**:

```bash
# Pull Llama 3.1 70B
ollama pull llama3.1:70b

# Run model
ollama run llama3.1:70b

# API endpoint available at http://localhost:11434
```

### 5.4 Text Generation Inference (TGI)

**Docker Installation**:

```bash
# Pull TGI image
docker pull ghcr.io/huggingface/text-generation-inference:latest

# Run TGI with 4 GPUs
docker run -d \
    --name tgi-server \
    --gpus all \
    -p 8080:80 \
    -v /models:/data \
    -e NUM_SHARD=4 \
    -e CUDA_VISIBLE_DEVICES=0,1,2,3 \
    -e MAX_INPUT_LENGTH=8192 \
    -e MAX_TOTAL_TOKENS=16384 \
    ghcr.io/huggingface/text-generation-inference:latest \
    --model-id meta-llama/Llama-3.1-405B-Instruct \
    --num-shard 4 \
    --max-input-length 8192 \
    --max-total-tokens 16384
```

### 5.5 Model Storage Setup

**Create model directories**:

```bash
sudo mkdir -p /models/{vllm,exllamav2,ollama,tgi}
sudo chown -R $USER:$USER /models
```

**Configure Hugging Face cache**:

```bash
# Add to ~/.bashrc
export HF_HOME=/models/huggingface
export TRANSFORMERS_CACHE=/models/huggingface/transformers
export HF_DATASETS_CACHE=/models/huggingface/datasets

# Create directories
mkdir -p $HF_HOME/{transformers,datasets}
```

---

## 6. Network Optimization

### 6.1 Mellanox ConnectX-4 Lx 25GbE Setup

**Install Mellanox OFED drivers**:

```bash
# Download MLNX_OFED
wget https://www.mellanox.com/downloads/ofed/MLNX_OFED-5.9-0.5.6.0/MLNX_OFED_LINUX-5.9-0.5.6.0-ubuntu22.04-x86_64.tgz

# Extract and install
tar -xvf MLNX_OFED_LINUX-5.9-0.5.6.0-ubuntu22.04-x86_64.tgz
cd MLNX_OFED_LINUX-5.9-0.5.6.0-ubuntu22.04-x86_64
sudo ./mlnxofedinstall --all

# Restart driver
sudo /etc/init.d/openibd restart
```

**Verify installation**:

```bash
# Check driver
ibv_devices

# Check link status
ibstat

# Check interface
ip link show
```

### 6.2 Network Interface Configuration

**Configure 25GbE interface** (/etc/netplan/01-netcfg.yaml):

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    # 10GbE onboard (management)
    eno1:
      addresses:
        - 192.168.1.100/24
      gateway4: 192.168.1.1
      nameservers:
        addresses:
          - 1.1.1.1
          - 8.8.8.8
      dhcp4: no

    # 25GbE Mellanox (data)
    enp1s0:
      addresses:
        - 192.168.10.100/24
      mtu: 9000
      dhcp4: no
      optional: true
```

**Apply configuration**:

```bash
sudo netplan apply
```

### 6.3 Network Tuning

**Edit /etc/sysctl.conf** (add these lines):

```bash
# Network performance tuning for 25GbE

# Increase TCP buffer sizes
net.core.rmem_max = 536870912
net.core.wmem_max = 536870912
net.core.rmem_default = 16777216
net.core.wmem_default = 16777216
net.ipv4.tcp_rmem = 4096 87380 536870912
net.ipv4.tcp_wmem = 4096 65536 536870912

# Increase network device backlog
net.core.netdev_max_backlog = 250000

# Enable TCP window scaling
net.ipv4.tcp_window_scaling = 1

# Increase TCP max buffer size
net.ipv4.tcp_max_syn_backlog = 8192

# Enable TCP timestamps
net.ipv4.tcp_timestamps = 1

# Enable TCP selective acknowledgments
net.ipv4.tcp_sack = 1

# Increase the maximum number of connections
net.core.somaxconn = 4096

# Reduce TIME_WAIT socket recycling
net.ipv4.tcp_tw_reuse = 1

# Increase local port range
net.ipv4.ip_local_port_range = 1024 65535

# Disable IPv6 (if not used)
net.ipv6.conf.all.disable_ipv6 = 1
net.ipv6.conf.default.disable_ipv6 = 1

# Enable jumbo frames support
net.core.optmem_max = 81920
```

**Apply settings**:

```bash
sudo sysctl -p
```

### 6.4 RDMA Configuration (Optional)

**Enable RDMA**:

```bash
# Install RDMA packages
sudo apt install -y rdma-core ibverbs-utils perftest

# Test RDMA performance (requires 2 nodes)
# Server: ib_write_bw
# Client: ib_write_bw <server-ip>
```

---

## 7. Storage Optimization

### 7.1 NVMe RAID 0 Configuration

**Install mdadm**:

```bash
sudo apt install -y mdadm
```

**Create RAID 0 array** (2x 4TB Crucial T705):

```bash
# Identify NVMe drives
lsblk -o NAME,SIZE,MODEL

# Expected output:
# nvme0n1  2TB   Samsung 990 PRO (OS drive)
# nvme1n1  4TB   Crucial T705
# nvme2n1  4TB   Crucial T705

# Create RAID 0 array
sudo mdadm --create --verbose /dev/md0 \
    --level=0 \
    --raid-devices=2 \
    /dev/nvme1n1 /dev/nvme2n1

# Save RAID configuration
sudo mdadm --detail --scan | sudo tee -a /etc/mdadm/mdadm.conf
sudo update-initramfs -u
```

**Format and mount RAID array**:

```bash
# Create ext4 filesystem
sudo mkfs.ext4 -F -E lazy_itable_init=0,lazy_journal_init=0 /dev/md0

# Create mount point
sudo mkdir /models

# Get UUID
sudo blkid /dev/md0

# Add to /etc/fstab (replace UUID with actual value)
echo "UUID=<your-uuid> /models ext4 defaults,noatime,nodiratime 0 2" | sudo tee -a /etc/fstab

# Mount
sudo mount -a
sudo chown -R $USER:$USER /models
```

### 7.2 Filesystem Tuning

**Optimize ext4 for large files**:

```bash
# Remount with optimizations
sudo tune2fs -O large_file,huge_file /dev/md0

# Set reserved blocks to 1% (more usable space)
sudo tune2fs -m 1 /dev/md0

# Enable write barriers for data integrity
sudo tune2fs -o journal_data_writeback /dev/md0
```

**Update /etc/fstab mount options**:

```bash
UUID=<your-uuid> /models ext4 defaults,noatime,nodiratime,data=writeback,barrier=0,commit=60 0 2
```

### 7.3 I/O Scheduler Optimization

**Set I/O scheduler for NVMe**:

```bash
# Check current scheduler
cat /sys/block/nvme0n1/queue/scheduler

# Set to 'none' for NVMe (best performance)
echo none | sudo tee /sys/block/nvme0n1/queue/scheduler
echo none | sudo tee /sys/block/nvme1n1/queue/scheduler
echo none | sudo tee /sys/block/nvme2n1/queue/scheduler

# Make persistent - create udev rule
echo 'ACTION=="add|change", KERNEL=="nvme[0-9]*", ATTR{queue/scheduler}="none"' | \
    sudo tee /etc/udev/rules.d/60-nvme-scheduler.rules
```

### 7.4 fstrim for SSD Health

**Enable weekly trim**:

```bash
# Enable fstrim timer
sudo systemctl enable fstrim.timer
sudo systemctl start fstrim.timer

# Check status
sudo systemctl status fstrim.timer
```

---

## 8. Security Hardening

### 8.1 Firewall Configuration

**Setup UFW (Uncomplicated Firewall)**:

```bash
# Install UFW
sudo apt install -y ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow 22/tcp

# Allow API endpoints
sudo ufw allow 8000/tcp   # vLLM
sudo ufw allow 5000/tcp   # ExLlamaV2
sudo ufw allow 11434/tcp  # Ollama
sudo ufw allow 8080/tcp   # TGI

# Allow monitoring
sudo ufw allow 9090/tcp   # Prometheus
sudo ufw allow 3000/tcp   # Grafana

# Enable firewall
sudo ufw enable
sudo ufw status verbose
```

### 8.2 SSH Hardening

**Edit /etc/ssh/sshd_config**:

```bash
# Security settings
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
ClientAliveInterval 300
ClientAliveCountMax 2
MaxAuthTries 3
MaxSessions 10
```

**Restart SSH**:

```bash
sudo systemctl restart sshd
```

### 8.3 Fail2ban Setup

**Install and configure**:

```bash
# Install fail2ban
sudo apt install -y fail2ban

# Create local configuration
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

**Add to jail.local**:

```ini
[sshd]
enabled = true
port = ssh
logpath = %(sshd_log)s
backend = %(sshd_backend)s
maxretry = 3
bantime = 3600
findtime = 600
```

**Start fail2ban**:

```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
sudo fail2ban-client status
```

### 8.4 System Updates and Automatic Security Patches

**Configure unattended-upgrades**:

```bash
# Install
sudo apt install -y unattended-upgrades apt-listchanges

# Enable
sudo dpkg-reconfigure -plow unattended-upgrades

# Edit /etc/apt/apt.conf.d/50unattended-upgrades
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

**Configure automatic security updates**:

```bash
Unattended-Upgrade::Allowed-Origins {
    "${distro_id}:${distro_codename}";
    "${distro_id}:${distro_codename}-security";
    "${distro_id}ESMApps:${distro_codename}-apps-security";
    "${distro_id}ESM:${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "03:00";
```

### 8.5 User Access Control

**Create service account for AI workloads**:

```bash
# Create ai-service user (no login)
sudo useradd -r -s /bin/false ai-service

# Add to docker group
sudo usermod -aG docker ai-service
```

**Setup sudo for admin user**:

```bash
# Add admin to sudoers with NOPASSWD for specific commands
echo "admin ALL=(ALL) NOPASSWD: /usr/bin/docker, /usr/bin/nvidia-smi, /usr/bin/systemctl" | \
    sudo tee /etc/sudoers.d/admin-docker
sudo chmod 440 /etc/sudoers.d/admin-docker
```

---

## 9. Monitoring Setup

### 9.1 NVIDIA DCGM Installation

**Install NVIDIA Data Center GPU Manager**:

```bash
# Add NVIDIA repository
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -s -L https://nvidia.github.io/nvidia-docker/gpgkey | sudo apt-key add -
curl -s -L https://nvidia.github.io/nvidia-docker/$distribution/nvidia-docker.list | \
    sudo tee /etc/apt/sources.list.d/nvidia-docker.list

# Install DCGM
sudo apt update
sudo apt install -y datacenter-gpu-manager

# Start DCGM
sudo systemctl --now enable nvidia-dcgm
sudo systemctl status nvidia-dcgm
```

### 9.2 Prometheus Installation

**Install Prometheus**:

```bash
# Create prometheus user
sudo useradd --no-create-home --shell /bin/false prometheus

# Download Prometheus
cd /tmp
wget https://github.com/prometheus/prometheus/releases/download/v2.47.0/prometheus-2.47.0.linux-amd64.tar.gz
tar -xvf prometheus-2.47.0.linux-amd64.tar.gz

# Move binaries
sudo cp prometheus-2.47.0.linux-amd64/prometheus /usr/local/bin/
sudo cp prometheus-2.47.0.linux-amd64/promtool /usr/local/bin/

# Create directories
sudo mkdir -p /etc/prometheus /var/lib/prometheus

# Copy configuration
sudo cp -r prometheus-2.47.0.linux-amd64/consoles /etc/prometheus
sudo cp -r prometheus-2.47.0.linux-amd64/console_libraries /etc/prometheus

# Set ownership
sudo chown -R prometheus:prometheus /etc/prometheus /var/lib/prometheus
sudo chown prometheus:prometheus /usr/local/bin/prometheus /usr/local/bin/promtool
```

**Create /etc/prometheus/prometheus.yml**:

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['localhost:9100']

  - job_name: 'nvidia_dcgm'
    static_configs:
      - targets: ['localhost:9400']

  - job_name: 'vllm'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'
```

**Create systemd service** (/etc/systemd/system/prometheus.service):

```ini
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
    --config.file=/etc/prometheus/prometheus.yml \
    --storage.tsdb.path=/var/lib/prometheus/ \
    --web.console.templates=/etc/prometheus/consoles \
    --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
```

**Start Prometheus**:

```bash
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
sudo systemctl status prometheus
```

### 9.3 Node Exporter Installation

**Install Node Exporter**:

```bash
# Download
cd /tmp
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar -xvf node_exporter-1.6.1.linux-amd64.tar.gz

# Move binary
sudo cp node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/

# Create user
sudo useradd --no-create-home --shell /bin/false node_exporter
sudo chown node_exporter:node_exporter /usr/local/bin/node_exporter
```

**Create systemd service** (/etc/systemd/system/node_exporter.service):

```ini
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
User=node_exporter
Group=node_exporter
Type=simple
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
```

**Start Node Exporter**:

```bash
sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl start node_exporter
```

### 9.4 NVIDIA DCGM Exporter

**Install DCGM Exporter**:

```bash
# Run as Docker container
docker run -d \
    --name dcgm-exporter \
    --restart unless-stopped \
    --gpus all \
    -p 9400:9400 \
    nvcr.io/nvidia/k8s/dcgm-exporter:3.1.7-3.1.4-ubuntu22.04
```

### 9.5 Grafana Installation

**Install Grafana**:

```bash
# Add GPG key
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -

# Add repository
echo "deb https://packages.grafana.com/oss/deb stable main" | \
    sudo tee /etc/apt/sources.list.d/grafana.list

# Install
sudo apt update
sudo apt install -y grafana

# Start Grafana
sudo systemctl daemon-reload
sudo systemctl enable grafana-server
sudo systemctl start grafana-server
```

**Access Grafana**: http://192.168.1.100:3000

- Default credentials: admin/admin

**Add Prometheus data source**:

1. Configuration > Data Sources > Add data source
2. Select Prometheus
3. URL: http://localhost:9090
4. Save & Test

**Import NVIDIA GPU Dashboard**:

1. Dashboards > Import
2. Dashboard ID: 12239 (NVIDIA DCGM Exporter Dashboard)
3. Select Prometheus data source
4. Import

### 9.6 Custom Monitoring Scripts

**Create /usr/local/bin/gpu-monitor.sh**:

```bash
#!/bin/bash
# GPU Monitoring Script

while true; do
    clear
    echo "=== GPU Status ==="
    nvidia-smi --query-gpu=index,name,temperature.gpu,utilization.gpu,utilization.memory,memory.used,memory.total,power.draw --format=csv,noheader,nounits
    echo ""
    echo "=== GPU Processes ==="
    nvidia-smi pmon -c 1
    sleep 5
done
```

**Make executable**:

```bash
sudo chmod +x /usr/local/bin/gpu-monitor.sh
```

---

## 10. Automation Scripts

### 10.1 System Deployment Script

**Create /usr/local/bin/deploy-ai-stack.sh**:

```bash
#!/bin/bash
# AI Stack Deployment Script

set -e

echo "=== AI Workstation Stack Deployment ==="

# Update system
echo "Updating system..."
sudo apt update && sudo apt upgrade -y

# Install NVIDIA drivers
echo "Installing NVIDIA drivers..."
sudo apt install -y nvidia-driver-550

# Install CUDA
echo "Installing CUDA 12.4..."
wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.1-1_all.deb
sudo dpkg -i cuda-keyring_1.1-1_all.deb
sudo apt update
sudo apt install -y cuda-toolkit-12-4

# Install Docker
echo "Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install NVIDIA Container Toolkit
echo "Installing NVIDIA Container Toolkit..."
distribution=$(. /etc/os-release;echo $ID$VERSION_ID)
curl -fsSL https://nvidia.github.io/libnvidia-container/gpgkey | sudo gpg --dearmor -o /usr/share/keyrings/nvidia-container-toolkit-keyring.gpg
curl -s -L https://nvidia.github.io/libnvidia-container/$distribution/libnvidia-container.list | \
    sed 's#deb https://#deb [signed-by=/usr/share/keyrings/nvidia-container-toolkit-keyring.gpg] https://#g' | \
    sudo tee /etc/apt/sources.list.d/nvidia-container-toolkit.list
sudo apt update
sudo apt install -y nvidia-container-toolkit
sudo nvidia-ctk runtime configure --runtime=docker
sudo systemctl restart docker

# Install Ollama
echo "Installing Ollama..."
curl -fsSL https://ollama.ai/install.sh | sh

# Setup monitoring
echo "Setting up monitoring..."
# Install Prometheus
cd /tmp
wget https://github.com/prometheus/prometheus/releases/download/v2.47.0/prometheus-2.47.0.linux-amd64.tar.gz
tar -xvf prometheus-2.47.0.linux-amd64.tar.gz
sudo cp prometheus-2.47.0.linux-amd64/prometheus /usr/local/bin/
sudo cp prometheus-2.47.0.linux-amd64/promtool /usr/local/bin/

# Install Grafana
wget -q -O - https://packages.grafana.com/gpg.key | sudo apt-key add -
echo "deb https://packages.grafana.com/oss/deb stable main" | sudo tee /etc/apt/sources.list.d/grafana.list
sudo apt update
sudo apt install -y grafana
sudo systemctl enable grafana-server
sudo systemctl start grafana-server

echo "=== Deployment Complete ==="
echo "Please reboot the system: sudo reboot"
```

**Make executable**:

```bash
sudo chmod +x /usr/local/bin/deploy-ai-stack.sh
```

### 10.2 Model Download Script

**Create /usr/local/bin/download-model.sh**:

```bash
#!/bin/bash
# Model Download Script with Progress Tracking

MODEL_REPO=$1
MODEL_DIR="/models/huggingface/transformers"

if [ -z "$MODEL_REPO" ]; then
    echo "Usage: $0 <huggingface-model-repo>"
    echo "Example: $0 meta-llama/Llama-3.1-70B-Instruct"
    exit 1
fi

echo "Downloading model: $MODEL_REPO"
echo "Target directory: $MODEL_DIR"

# Install huggingface-cli if not present
if ! command -v huggingface-cli &> /dev/null; then
    pip install -U "huggingface_hub[cli]"
fi

# Download model with progress
huggingface-cli download "$MODEL_REPO" \
    --local-dir "$MODEL_DIR/$(basename $MODEL_REPO)" \
    --resume-download \
    --local-dir-use-symlinks False

echo "Download complete!"
echo "Model location: $MODEL_DIR/$(basename $MODEL_REPO)"
```

**Make executable**:

```bash
sudo chmod +x /usr/local/bin/download-model.sh
```

### 10.3 GPU Health Check Script

**Create /usr/local/bin/gpu-health-check.sh**:

```bash
#!/bin/bash
# GPU Health Check Script

LOG_FILE="/var/log/gpu-health.log"

# Function to log with timestamp
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

log "=== GPU Health Check Started ==="

# Check NVIDIA driver
if ! nvidia-smi &> /dev/null; then
    log "ERROR: NVIDIA driver not responding!"
    exit 1
fi

# Check each GPU
GPU_COUNT=$(nvidia-smi --query-gpu=count --format=csv,noheader | head -n1)
log "Found $GPU_COUNT GPUs"

for i in $(seq 0 $((GPU_COUNT-1))); do
    # Get GPU stats
    TEMP=$(nvidia-smi -i $i --query-gpu=temperature.gpu --format=csv,noheader,nounits)
    POWER=$(nvidia-smi -i $i --query-gpu=power.draw --format=csv,noheader,nounits)
    MEM_USED=$(nvidia-smi -i $i --query-gpu=memory.used --format=csv,noheader,nounits)
    MEM_TOTAL=$(nvidia-smi -i $i --query-gpu=memory.total --format=csv,noheader,nounits)

    log "GPU $i: Temp=${TEMP}C, Power=${POWER}W, Memory=${MEM_USED}/${MEM_TOTAL}MB"

    # Check for issues
    if [ "$TEMP" -gt 85 ]; then
        log "WARNING: GPU $i temperature high: ${TEMP}C"
    fi

    if [ "$POWER" -gt 450 ]; then
        log "WARNING: GPU $i power draw high: ${POWER}W"
    fi
done

# Check for GPU errors
ERRORS=$(nvidia-smi --query-gpu=gpu_bus_id,ecc.errors.corrected.volatile.total --format=csv,noheader)
if [ ! -z "$ERRORS" ]; then
    log "GPU Errors detected: $ERRORS"
fi

log "=== GPU Health Check Completed ==="
```

**Make executable and add to cron**:

```bash
sudo chmod +x /usr/local/bin/gpu-health-check.sh

# Add to crontab (every 15 minutes)
(crontab -l 2>/dev/null; echo "*/15 * * * * /usr/local/bin/gpu-health-check.sh") | crontab -
```

### 10.4 Service Start/Stop Script

**Create /usr/local/bin/ai-services.sh**:

```bash
#!/bin/bash
# AI Services Management Script

ACTION=$1

start_services() {
    echo "Starting AI services..."

    # Start vLLM
    docker start vllm-server 2>/dev/null || \
    docker run -d \
        --name vllm-server \
        --gpus all \
        -p 8000:8000 \
        -v ~/.cache/huggingface:/root/.cache/huggingface \
        vllm/vllm-openai:latest

    # Start TGI
    docker start tgi-server 2>/dev/null || \
    docker run -d \
        --name tgi-server \
        --gpus all \
        -p 8080:80 \
        -v /models:/data \
        ghcr.io/huggingface/text-generation-inference:latest

    # Start Ollama
    sudo systemctl start ollama

    # Start monitoring
    sudo systemctl start prometheus
    sudo systemctl start grafana-server
    docker start dcgm-exporter 2>/dev/null

    echo "All services started"
}

stop_services() {
    echo "Stopping AI services..."

    # Stop inference services
    docker stop vllm-server tgi-server 2>/dev/null
    sudo systemctl stop ollama

    # Stop monitoring
    sudo systemctl stop prometheus grafana-server
    docker stop dcgm-exporter 2>/dev/null

    echo "All services stopped"
}

status_services() {
    echo "=== Service Status ==="
    echo ""
    echo "Inference Services:"
    docker ps --filter "name=vllm-server" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    docker ps --filter "name=tgi-server" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    systemctl status ollama --no-pager -l
    echo ""
    echo "Monitoring Services:"
    systemctl status prometheus --no-pager -l
    systemctl status grafana-server --no-pager -l
    docker ps --filter "name=dcgm-exporter" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
}

case "$ACTION" in
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        sleep 2
        start_services
        ;;
    status)
        status_services
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status}"
        exit 1
        ;;
esac
```

**Make executable**:

```bash
sudo chmod +x /usr/local/bin/ai-services.sh
```

---

## 11. Backup & Disaster Recovery

### 11.1 Backup Strategy

**Backup Targets**:

1. System configuration files
2. Docker volumes and images
3. Model files (selective)
4. Monitoring data
5. User data and scripts

### 11.2 System Backup Script

**Create /usr/local/bin/backup-system.sh**:

```bash
#!/bin/bash
# System Backup Script

BACKUP_DIR="/backup"
BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_PATH="$BACKUP_DIR/system_$BACKUP_DATE"

# Create backup directory
mkdir -p "$BACKUP_PATH"

echo "Starting system backup to $BACKUP_PATH"

# Backup system configuration
echo "Backing up system configuration..."
sudo tar -czf "$BACKUP_PATH/etc_backup.tar.gz" /etc

# Backup Docker
echo "Backing up Docker..."
sudo tar -czf "$BACKUP_PATH/docker_volumes.tar.gz" /var/lib/docker/volumes

# Export Docker images
echo "Exporting Docker images..."
docker save $(docker images -q) -o "$BACKUP_PATH/docker_images.tar"

# Backup home directories
echo "Backing up home directories..."
sudo tar -czf "$BACKUP_PATH/home_backup.tar.gz" /home

# Backup scripts
echo "Backing up scripts..."
sudo tar -czf "$BACKUP_PATH/scripts_backup.tar.gz" /usr/local/bin

# Backup monitoring data
echo "Backing up monitoring data..."
sudo tar -czf "$BACKUP_PATH/prometheus_backup.tar.gz" /var/lib/prometheus
sudo tar -czf "$BACKUP_PATH/grafana_backup.tar.gz" /var/lib/grafana

# Create manifest
echo "Creating backup manifest..."
cat > "$BACKUP_PATH/manifest.txt" << EOF
Backup Date: $BACKUP_DATE
Hostname: $(hostname)
Kernel: $(uname -r)
GPU Driver: $(nvidia-smi --query-gpu=driver_version --format=csv,noheader | head -n1)
CUDA Version: $(nvcc --version | grep "release" | awk '{print $5}')
Docker Version: $(docker --version)

Files Backed Up:
$(ls -lh $BACKUP_PATH)

Total Backup Size: $(du -sh $BACKUP_PATH | awk '{print $1}')
EOF

cat "$BACKUP_PATH/manifest.txt"

# Compress entire backup
echo "Compressing backup..."
cd "$BACKUP_DIR"
tar -czf "system_$BACKUP_DATE.tar.gz" "system_$BACKUP_DATE"
rm -rf "system_$BACKUP_DATE"

echo "Backup complete: $BACKUP_DIR/system_$BACKUP_DATE.tar.gz"

# Cleanup old backups (keep last 7)
echo "Cleaning up old backups..."
cd "$BACKUP_DIR"
ls -t system_*.tar.gz | tail -n +8 | xargs -r rm

echo "Backup finished successfully"
```

**Make executable**:

```bash
sudo chmod +x /usr/local/bin/backup-system.sh

# Create backup directory
sudo mkdir -p /backup
sudo chown $USER:$USER /backup

# Schedule weekly backups
(crontab -l 2>/dev/null; echo "0 2 * * 0 /usr/local/bin/backup-system.sh") | crontab -
```

### 11.3 Model Backup Script

**Create /usr/local/bin/backup-models.sh**:

```bash
#!/bin/bash
# Model Backup Script (selective)

MODELS_DIR="/models"
BACKUP_DIR="/backup/models"
MODEL_NAME=$1

if [ -z "$MODEL_NAME" ]; then
    echo "Usage: $0 <model-name>"
    echo "Example: $0 Llama-3.1-70B-Instruct"
    exit 1
fi

BACKUP_DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/${MODEL_NAME}_${BACKUP_DATE}.tar.gz"

echo "Backing up model: $MODEL_NAME"
echo "Source: $MODELS_DIR/$MODEL_NAME"
echo "Destination: $BACKUP_FILE"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Check if model exists
if [ ! -d "$MODELS_DIR/$MODEL_NAME" ]; then
    echo "Error: Model directory not found: $MODELS_DIR/$MODEL_NAME"
    exit 1
fi

# Backup model
echo "Creating backup (this may take a while)..."
tar -czf "$BACKUP_FILE" -C "$MODELS_DIR" "$MODEL_NAME"

echo "Backup complete: $BACKUP_FILE"
echo "Size: $(du -h $BACKUP_FILE | awk '{print $1}')"
```

**Make executable**:

```bash
sudo chmod +x /usr/local/bin/backup-models.sh

# Create models backup directory
sudo mkdir -p /backup/models
sudo chown $USER:$USER /backup/models
```

### 11.4 Disaster Recovery Plan

**Recovery Steps**:

1. **Reinstall OS** (Ubuntu 22.04 LTS Server)
2. **Restore system configuration**:

   ```bash
   # Extract backup
   tar -xzf system_YYYYMMDD_HHMMSS.tar.gz

   # Restore /etc (selective)
   sudo tar -xzf etc_backup.tar.gz -C /

   # Restore scripts
   sudo tar -xzf scripts_backup.tar.gz -C /
   ```

3. **Reinstall software stack**:

   ```bash
   sudo /usr/local/bin/deploy-ai-stack.sh
   ```

4. **Restore Docker**:

   ```bash
   # Restore volumes
   sudo tar -xzf docker_volumes.tar.gz -C /

   # Load Docker images
   docker load -i docker_images.tar
   ```

5. **Restore monitoring**:

   ```bash
   sudo tar -xzf prometheus_backup.tar.gz -C /
   sudo tar -xzf grafana_backup.tar.gz -C /
   sudo systemctl restart prometheus grafana-server
   ```

6. **Restore models**:
   ```bash
   tar -xzf Llama-3.1-70B-Instruct_YYYYMMDD_HHMMSS.tar.gz -C /models
   ```

### 11.5 RAID Recovery

**RAID 0 Recovery** (Data Loss - Restore from Backup):

```bash
# If one drive fails, RAID 0 is unrecoverable
# Replace failed drive and recreate array
sudo mdadm --create --verbose /dev/md0 \
    --level=0 \
    --raid-devices=2 \
    /dev/nvme1n1 /dev/nvme2n1

# Format and mount
sudo mkfs.ext4 -F /dev/md0
sudo mount /dev/md0 /models

# Restore models from backup
for backup in /backup/models/*.tar.gz; do
    tar -xzf "$backup" -C /models
done
```

**Prevention**:

- Consider RAID 1 or RAID 10 for critical models
- Regular backups to external storage
- Cloud backup for irreplaceable data

---

## 12. Performance Tuning

### 12.1 CPU Tuning

**Disable CPU frequency scaling** (for consistent performance):

```bash
# Install cpufrequtils
sudo apt install -y cpufrequtils

# Set governor to performance
echo "GOVERNOR='performance'" | sudo tee /etc/default/cpufrequtils

# Apply
sudo systemctl restart cpufrequtils

# Verify
cpufreq-info
```

**CPU affinity for NUMA** (Threadripper PRO):

```bash
# Check NUMA topology
numactl --hardware

# Run workload with NUMA awareness
numactl --cpunodebind=0 --membind=0 python inference.py
```

### 12.2 Memory Tuning

**Transparent Huge Pages** (THP):

```bash
# Disable THP (recommended for large workloads)
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/enabled
echo never | sudo tee /sys/kernel/mm/transparent_hugepage/defrag

# Make persistent
sudo nano /etc/rc.local
# Add:
#!/bin/sh -e
echo never > /sys/kernel/mm/transparent_hugepage/enabled
echo never > /sys/kernel/mm/transparent_hugepage/defrag
exit 0

sudo chmod +x /etc/rc.local
```

**Swap Configuration**:

```bash
# Reduce swappiness (avoid swap for performance)
echo "vm.swappiness=10" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Increase cache pressure
echo "vm.vfs_cache_pressure=50" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

### 12.3 GPU Performance Tuning

**Set GPU clocks** (for consistency):

```bash
# Lock GPU clocks to max
sudo nvidia-smi -lgc 2520  # Graphics clock

# Lock memory clocks
sudo nvidia-smi -lmc 10501  # Memory clock

# Verify
nvidia-smi -q -d CLOCK
```

**GPU compute mode**:

```bash
# Set to exclusive process mode
sudo nvidia-smi -c 3

# Verify
nvidia-smi -q -d COMPUTE
```

### 12.4 Model Loading Optimization

**PyTorch optimizations**:

```bash
# Add to environment or script
export OMP_NUM_THREADS=32
export MKL_NUM_THREADS=32
export PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:512
export TOKENIZERS_PARALLELISM=true
```

**vLLM optimizations**:

```bash
# Launch vLLM with optimizations
docker run -d \
    --name vllm-optimized \
    --gpus all \
    --shm-size 64g \
    -p 8000:8000 \
    -e VLLM_WORKER_MULTIPROC_METHOD=spawn \
    -e VLLM_USE_MODELSCOPE=false \
    -e VLLM_ATTENTION_BACKEND=FLASHINFER \
    vllm/vllm-openai:latest \
    --model meta-llama/Llama-3.1-405B-Instruct \
    --tensor-parallel-size 4 \
    --max-model-len 8192 \
    --gpu-memory-utilization 0.95 \
    --enable-prefix-caching \
    --disable-log-requests
```

### 12.5 Benchmarking

**Create /usr/local/bin/benchmark-inference.sh**:

```bash
#!/bin/bash
# Inference Benchmarking Script

MODEL_URL="http://localhost:8000/v1/completions"
PROMPT="Write a detailed explanation of neural networks."

echo "=== Inference Benchmark ==="
echo "Model: Llama-3.1-405B"
echo "Prompt length: ${#PROMPT}"

# Single request benchmark
echo "Testing single request..."
time curl -s -X POST "$MODEL_URL" \
    -H "Content-Type: application/json" \
    -d "{
        \"model\": \"meta-llama/Llama-3.1-405B-Instruct\",
        \"prompt\": \"$PROMPT\",
        \"max_tokens\": 500,
        \"temperature\": 0.7
    }" | jq -r '.choices[0].text' > /dev/null

# Concurrent requests benchmark
echo "Testing 10 concurrent requests..."
for i in {1..10}; do
    curl -s -X POST "$MODEL_URL" \
        -H "Content-Type: application/json" \
        -d "{
            \"model\": \"meta-llama/Llama-3.1-405B-Instruct\",
            \"prompt\": \"$PROMPT\",
            \"max_tokens\": 500,
            \"temperature\": 0.7
        }" > /dev/null &
done
wait

echo "Benchmark complete"
```

**Make executable**:

```bash
sudo chmod +x /usr/local/bin/benchmark-inference.sh
```

---

## Appendix A: Quick Reference Commands

### System Management

```bash
# Check GPU status
nvidia-smi

# Monitor GPU in real-time
watch -n 1 nvidia-smi

# Check CUDA version
nvcc --version

# View system resources
htop

# Check disk usage
df -h

# Check NVMe health
sudo nvme smart-log /dev/nvme0n1

# Check RAID status
cat /proc/mdstat
```

### Docker Management

```bash
# List running containers
docker ps

# View container logs
docker logs -f <container-name>

# Restart container
docker restart <container-name>

# Execute command in container
docker exec -it <container-name> bash

# View GPU usage in containers
docker stats

# Prune unused Docker resources
docker system prune -a
```

### Service Management

```bash
# Start AI services
sudo /usr/local/bin/ai-services.sh start

# Stop AI services
sudo /usr/local/bin/ai-services.sh stop

# Check service status
systemctl status <service-name>

# View service logs
journalctl -u <service-name> -f
```

### Monitoring

```bash
# Access Prometheus
http://192.168.1.100:9090

# Access Grafana
http://192.168.1.100:3000

# Check GPU health
sudo /usr/local/bin/gpu-health-check.sh

# Monitor GPU
/usr/local/bin/gpu-monitor.sh
```

---

## Appendix B: Troubleshooting

### GPU Issues

**Problem**: GPUs not detected

```bash
# Check driver installation
nvidia-smi

# Reinstall driver
sudo apt install --reinstall nvidia-driver-550
sudo reboot

# Check PCIe
lspci | grep -i nvidia
```

**Problem**: Out of memory errors

```bash
# Clear GPU memory
sudo nvidia-smi --gpu-reset

# Check memory usage
nvidia-smi --query-gpu=memory.used,memory.total --format=csv

# Reduce model size or batch size
```

**Problem**: GPU throttling

```bash
# Check temperature
nvidia-smi --query-gpu=temperature.gpu --format=csv

# Check power limit
nvidia-smi -q -d POWER

# Increase fan speed (if applicable)
sudo nvidia-settings -a "[gpu:0]/GPUFanControlState=1" -a "[fan:0]/GPUTargetFanSpeed=80"
```

### Docker Issues

**Problem**: Container can't access GPUs

```bash
# Verify NVIDIA runtime
docker run --rm --gpus all nvidia/cuda:12.4.0-base-ubuntu22.04 nvidia-smi

# Restart Docker
sudo systemctl restart docker

# Reconfigure NVIDIA runtime
sudo nvidia-ctk runtime configure --runtime=docker
```

**Problem**: Docker out of disk space

```bash
# Check Docker disk usage
docker system df

# Prune unused resources
docker system prune -a --volumes

# Change Docker data directory (in /etc/docker/daemon.json)
{
    "data-root": "/new/path"
}
```

### Network Issues

**Problem**: Slow model downloads

```bash
# Check network speed
iperf3 -c <server-ip>

# Verify MTU settings
ip link show | grep mtu

# Check network configuration
ip addr show
```

### Storage Issues

**Problem**: RAID array degraded

```bash
# Check RAID status
cat /proc/mdstat
sudo mdadm --detail /dev/md0

# If rebuilding, monitor progress
watch cat /proc/mdstat
```

**Problem**: Disk full

```bash
# Find large files
sudo du -h / | sort -rh | head -n 20

# Clean up Docker
docker system prune -a --volumes

# Clear model cache
rm -rf ~/.cache/huggingface/*
```

---

## Appendix C: Performance Expectations

### Model Loading Times (RAID 0 @ 29 GB/s)

| Model Size | Load Time | VRAM Usage |
| ---------- | --------- | ---------- |
| 7B         | ~3-5s     | ~14 GB     |
| 13B        | ~5-8s     | ~26 GB     |
| 70B        | ~20-30s   | ~140 GB    |
| 405B       | ~2-3 min  | ~810 GB\*  |

\*405B requires CPU offloading or quantization

### Inference Performance (4x RTX 4090)

| Model | Tokens/sec | Latency (TTFT) | Batch Size |
| ----- | ---------- | -------------- | ---------- |
| 7B    | ~150       | ~50ms          | 32         |
| 70B   | ~40        | ~200ms         | 16         |
| 405B  | ~8-12      | ~1000ms        | 4          |

TTFT = Time To First Token

### Network Performance (25GbE)

- **Theoretical**: 25 Gbps = 3.125 GB/s
- **Practical**: ~2.8 GB/s (TCP overhead)
- **Model download (100GB)**: ~35-40 seconds

### Storage Performance

- **Single NVMe (990 PRO)**: 7.4 GB/s read
- **RAID 0 (2x T705)**: 29 GB/s read
- **Random read (4K)**: 1000K IOPS

---

## Appendix D: Security Checklist

- [ ] SSH key-based authentication only
- [ ] Firewall (UFW) enabled and configured
- [ ] Fail2ban installed and active
- [ ] Automatic security updates enabled
- [ ] Non-root user for daily operations
- [ ] Docker socket access restricted
- [ ] GPU access controlled by user groups
- [ ] Monitoring services password-protected
- [ ] API endpoints firewalled (internal only)
- [ ] Regular backups scheduled and tested
- [ ] System logs reviewed regularly
- [ ] Unnecessary services disabled
- [ ] BIOS/UEFI password set
- [ ] Physical access restricted
- [ ] Network segmentation implemented

---

## Appendix E: Maintenance Schedule

### Daily

- Check GPU health (`gpu-health-check.sh`)
- Review system logs (`journalctl -p err`)
- Monitor disk space (`df -h`)

### Weekly

- System backup (`backup-system.sh`)
- Review monitoring dashboards
- Check for software updates

### Monthly

- SMART health checks (`sudo smartctl -a /dev/nvme0n1`)
- Fan cleaning and inspection
- Security audit
- Performance benchmarking

### Quarterly

- Firmware updates (GPU, motherboard, NVMe)
- Thermal paste replacement (if temps rising)
- Disaster recovery test
- Capacity planning review

---

## Conclusion

This software stack provides a production-ready foundation for running large language models on your 4x RTX 4090 AI workstation. The configuration prioritizes:

1. **Performance**: Optimized for low-latency inference
2. **Reliability**: Monitoring and health checks
3. **Scalability**: Easy to add models and services
4. **Security**: Hardened against common threats
5. **Maintainability**: Automation and documentation

### Next Steps

1. Complete OS installation following Section 1
2. Run deployment script (`deploy-ai-stack.sh`)
3. Configure monitoring dashboards
4. Download your first model
5. Run inference benchmarks
6. Setup automated backups

### Support Resources

- **Ubuntu**: https://ubuntu.com/server/docs
- **NVIDIA CUDA**: https://docs.nvidia.com/cuda/
- **Docker**: https://docs.docker.com/
- **vLLM**: https://docs.vllm.ai/
- **Ollama**: https://ollama.ai/docs

---

**Document Version**: 1.0
**Last Updated**: 2025-11-02
**System**: AI Workstation (4x RTX 4090, Threadripper PRO 7975WX)
**OS**: Ubuntu 22.04 LTS Server

---
