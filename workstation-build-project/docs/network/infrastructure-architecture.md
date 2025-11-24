# Network & Infrastructure Architecture

## System Overview

High-performance workstation network infrastructure optimized for AI/ML workloads with dual high-speed networking and enterprise-grade remote management.

### Network Hardware

- **Onboard**: 10GbE RJ45 (Intel I225-LM/V)
- **PCIe Add-in**: Mellanox ConnectX-4 Lx 25GbE SFP28 (Dual-port)
- **Remote Management**: PiKVM v4 with dedicated management network
- **Total Bandwidth**: 60 Gbps aggregate (10 + 25 + 25)

---

## 1. Network Interface Configuration

### 1.1 Interface Naming and Roles

```bash
# List all network interfaces
ip link show

# Expected interfaces:
# - enp0s31f6: 10GbE onboard (general purpose, internet)
# - enp4s0f0: 25GbE Mellanox port 0 (high-speed data)
# - enp4s0f1: 25GbE Mellanox port 1 (redundancy/failover)
# - eth0 (PiKVM): Management network
```

**Interface Assignment:**

- **10GbE (enp0s31f6)**: Primary internet, general network traffic, SSH access
- **25GbE Port 0 (enp4s0f0)**: High-speed data transfer, model downloads, NFS/SMB
- **25GbE Port 1 (enp4s0f1)**: RDMA over Converged Ethernet (RoCE), distributed computing
- **PiKVM**: Isolated management VLAN (IPMI-style access)

### 1.2 Static IP Configuration

**File: `/etc/netplan/01-netcfg.yaml` (Ubuntu/Debian)**

```yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    # 10GbE - General Purpose
    enp0s31f6:
      dhcp4: false
      addresses:
        - 192.168.1.100/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses:
          - 1.1.1.1
          - 8.8.8.8
      optional: false

    # 25GbE Port 0 - High-Speed Data
    enp4s0f0:
      dhcp4: false
      addresses:
        - 10.0.10.100/24
      mtu: 9000 # Jumbo frames
      optional: true

    # 25GbE Port 1 - RDMA/RoCE
    enp4s0f1:
      dhcp4: false
      addresses:
        - 10.0.20.100/24
      mtu: 9000 # Jumbo frames
      optional: true

    # PiKVM Management
    eth0:
      dhcp4: false
      addresses:
        - 192.168.254.100/24
      optional: true
```

**Apply configuration:**

```bash
sudo netplan generate
sudo netplan apply

# Verify
ip addr show
ip route show
```

### 1.3 NetworkManager Alternative (RHEL/Fedora)

```bash
# 10GbE - General Purpose
nmcli con add type ethernet con-name "10GbE-Primary" ifname enp0s31f6 \
  ipv4.addresses 192.168.1.100/24 \
  ipv4.gateway 192.168.1.1 \
  ipv4.dns "1.1.1.1,8.8.8.8" \
  ipv4.method manual

# 25GbE Port 0 - High-Speed Data
nmcli con add type ethernet con-name "25GbE-Data" ifname enp4s0f0 \
  ipv4.addresses 10.0.10.100/24 \
  ipv4.method manual \
  ethernet.mtu 9000

# 25GbE Port 1 - RDMA
nmcli con add type ethernet con-name "25GbE-RDMA" ifname enp4s0f1 \
  ipv4.addresses 10.0.20.100/24 \
  ipv4.method manual \
  ethernet.mtu 9000

# Activate
nmcli con up "10GbE-Primary"
nmcli con up "25GbE-Data"
nmcli con up "25GbE-RDMA"
```

---

## 2. Network Stack Tuning

### 2.1 Kernel Parameters for High-Bandwidth

**File: `/etc/sysctl.d/99-network-performance.conf`**

```bash
# TCP Buffer Sizes (critical for 10/25GbE)
net.core.rmem_max = 134217728          # 128 MB
net.core.wmem_max = 134217728          # 128 MB
net.core.rmem_default = 16777216       # 16 MB
net.core.wmem_default = 16777216       # 16 MB
net.ipv4.tcp_rmem = 4096 87380 67108864   # 64 MB max
net.ipv4.tcp_wmem = 4096 65536 67108864   # 64 MB max

# TCP Performance
net.ipv4.tcp_congestion_control = bbr   # Google BBR
net.ipv4.tcp_mtu_probing = 1
net.ipv4.tcp_slow_start_after_idle = 0
net.ipv4.tcp_timestamps = 1
net.ipv4.tcp_sack = 1
net.ipv4.tcp_window_scaling = 1
net.ipv4.tcp_no_metrics_save = 1

# Network Device Backlog
net.core.netdev_max_backlog = 300000
net.core.netdev_budget = 600
net.core.netdev_budget_usecs = 8000

# Connection Tracking (if using firewall)
net.netfilter.nf_conntrack_max = 1048576
net.netfilter.nf_conntrack_tcp_timeout_established = 600

# File Descriptors
fs.file-max = 2097152
net.ipv4.ip_local_port_range = 1024 65535

# ARP Cache
net.ipv4.neigh.default.gc_thresh1 = 8192
net.ipv4.neigh.default.gc_thresh2 = 32768
net.ipv4.neigh.default.gc_thresh3 = 65536

# Disable IPv6 (if not used)
# net.ipv6.conf.all.disable_ipv6 = 1
# net.ipv6.conf.default.disable_ipv6 = 1
```

**Apply:**

```bash
sudo sysctl -p /etc/sysctl.d/99-network-performance.conf

# Verify
sysctl net.ipv4.tcp_congestion_control
sysctl net.core.rmem_max
```

### 2.2 Network Interface Tuning

**File: `/etc/systemd/system/network-tuning.service`**

```ini
[Unit]
Description=Network Interface Performance Tuning
After=network-online.target
Wants=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/usr/local/bin/tune-network.sh

[Install]
WantedBy=multi-user.target
```

**File: `/usr/local/bin/tune-network.sh`**

```bash
#!/bin/bash
# Network Interface Tuning Script

# 10GbE Interface
IFACE_10G="enp0s31f6"
# 25GbE Interfaces
IFACE_25G_0="enp4s0f0"
IFACE_25G_1="enp4s0f1"

tune_interface() {
    local IFACE=$1

    # Ring buffer sizes
    ethtool -G $IFACE rx 4096 tx 4096 2>/dev/null || true

    # Interrupt coalescing (reduce CPU overhead)
    ethtool -C $IFACE adaptive-rx on adaptive-tx on \
        rx-usecs 64 tx-usecs 64 2>/dev/null || true

    # Enable hardware offloading
    ethtool -K $IFACE tso on gso on gro on \
        rx-vlan-offload on tx-vlan-offload on \
        rxhash on ntuple on 2>/dev/null || true

    # RSS (Receive Side Scaling) - distribute across CPU cores
    ethtool -X $IFACE equal $(nproc) 2>/dev/null || true

    # Flow control (for point-to-point links)
    # ethtool -A $IFACE rx on tx on 2>/dev/null || true
}

# Tune all interfaces
for IFACE in $IFACE_10G $IFACE_25G_0 $IFACE_25G_1; do
    if ip link show $IFACE &>/dev/null; then
        echo "Tuning $IFACE..."
        tune_interface $IFACE
    fi
done

# Mellanox-specific tuning
if lspci | grep -i mellanox &>/dev/null; then
    # Enable PFC (Priority Flow Control) for RoCE
    mlnx_qos -i $IFACE_25G_1 --pfc 0,0,0,1,0,0,0,0 2>/dev/null || true

    # DSCP to priority mapping for RoCE traffic
    mlnx_qos -i $IFACE_25G_1 --trust dscp 2>/dev/null || true
fi

echo "Network tuning complete"
```

**Enable service:**

```bash
sudo chmod +x /usr/local/bin/tune-network.sh
sudo systemctl daemon-reload
sudo systemctl enable network-tuning.service
sudo systemctl start network-tuning.service
```

### 2.3 CPU Affinity and IRQ Balancing

```bash
# Install irqbalance
sudo apt install irqbalance   # Debian/Ubuntu
sudo dnf install irqbalance   # RHEL/Fedora

# Configure for performance
# File: /etc/default/irqbalance
echo 'IRQBALANCE_ARGS="--hintpolicy=exact"' | sudo tee -a /etc/default/irqbalance

sudo systemctl restart irqbalance
sudo systemctl enable irqbalance

# Manual IRQ pinning for critical interfaces (optional)
# Find IRQ numbers
grep -E "enp0s31f6|enp4s0f0|enp4s0f1" /proc/interrupts

# Pin IRQs to specific CPU cores (example)
# echo "cpu_mask" > /proc/irq/IRQ_NUMBER/smp_affinity
```

---

## 3. RDMA Configuration (RoCE)

### 3.1 Install RDMA Packages

```bash
# Ubuntu/Debian
sudo apt install rdma-core libibverbs1 ibverbs-utils \
  librdmacm1 rdmacm-utils perftest infiniband-diags \
  mlnx-ofed-kernel-utils

# RHEL/Fedora
sudo dnf install rdma-core libibverbs librdmacm \
  perftest infiniband-diags

# Or install Mellanox OFED (recommended for ConnectX-4 Lx)
# Download from: https://network.nvidia.com/products/infiniband-drivers/linux/mlnx_ofed/
wget https://www.mellanox.com/downloads/ofed/MLNX_OFED-5.9-0.5.6.0/MLNX_OFED_LINUX-5.9-0.5.6.0-ubuntu22.04-x86_64.tgz
tar -xzf MLNX_OFED_LINUX-5.9-0.5.6.0-ubuntu22.04-x86_64.tgz
cd MLNX_OFED_LINUX-5.9-0.5.6.0-ubuntu22.04-x86_64
sudo ./mlnxofedinstall --without-fw-update
sudo /etc/init.d/openibd restart
```

### 3.2 Enable RoCE on Mellanox

```bash
# Verify RDMA devices
ibv_devices
# Should show: mlx5_0, mlx5_1 (for dual-port card)

# Check port status
ibv_devinfo

# Enable RoCE v2 (recommended)
sudo cma_roce_mode -d mlx5_0 -p 1 -m 2
sudo cma_roce_mode -d mlx5_1 -p 1 -m 2

# Configure RoCE priority (for lossless Ethernet)
# File: /etc/mlnx-roce.conf
cat <<EOF | sudo tee /etc/mlnx-roce.conf
# RoCE Configuration
ROCE_MODE=2  # RoCE v2
TRUST_MODE=dscp
PFC_ENABLED=1
PFC_PRIORITY=3
DSCP_VALUE=26
EOF

# Load configuration
sudo mlnx_qos -i enp4s0f1 --trust dscp
sudo mlnx_qos -i enp4s0f1 --pfc 0,0,0,1,0,0,0,0
```

### 3.3 RoCE Performance Testing

```bash
# Server side (on remote machine)
ib_write_bw -d mlx5_0 -F --report_gbits

# Client side (this workstation)
ib_write_bw -d mlx5_0 -F --report_gbits <server_ip>

# Expected throughput: ~23-24 Gbps on 25GbE
# Latency testing
ib_write_lat -d mlx5_0 <server_ip>

# Multi-QP testing (parallel connections)
ib_write_bw -d mlx5_0 -q 8 -F --report_gbits <server_ip>
```

### 3.4 RDMA for Distributed Computing

**PyTorch with RDMA:**

```bash
# Set environment variables
export NCCL_IB_HCA=mlx5_0,mlx5_1
export NCCL_IB_DISABLE=0
export NCCL_SOCKET_IFNAME=enp4s0f1
export NCCL_DEBUG=INFO

# Run distributed training
python -m torch.distributed.launch \
  --nproc_per_node=1 \
  --nnodes=2 \
  --node_rank=0 \
  --master_addr="10.0.20.10" \
  --master_port=29500 \
  train.py
```

**Horovod with RDMA:**

```bash
horovodrun -np 2 \
  -H localhost:1,remote:1 \
  --mpi-args="--mca btl_tcp_if_include enp4s0f1" \
  python train.py
```

---

## 4. Model Download Optimization

### 4.1 Route Model Downloads Through 25GbE

```bash
# Force Hugging Face downloads through high-speed interface
# File: ~/.bashrc or /etc/environment

export HF_HUB_DOWNLOAD_TIMEOUT=600
export HF_HUB_ENABLE_HF_TRANSFER=1  # Requires hf_transfer package

# Route specific traffic through 25GbE interface
# File: /etc/iproute2/rt_tables
echo "100 highspeed" | sudo tee -a /etc/iproute2/rt_tables

# Create routing rule for Hugging Face CDN
sudo ip rule add from 10.0.10.100 table highspeed
sudo ip route add default via 10.0.10.1 dev enp4s0f0 table highspeed

# Make persistent
# File: /etc/systemd/system/highspeed-route.service
cat <<EOF | sudo tee /etc/systemd/system/highspeed-route.service
[Unit]
Description=High-Speed Interface Routing
After=network-online.target

[Service]
Type=oneshot
RemainAfterExit=yes
ExecStart=/bin/bash -c 'ip rule add from 10.0.10.100 table highspeed; ip route add default via 10.0.10.1 dev enp4s0f0 table highspeed'

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl enable highspeed-route.service
```

### 4.2 Accelerated Download Tools

**Install `hf_transfer` for Hugging Face:**

```bash
pip install hf_transfer

# Usage in Python
from huggingface_hub import hf_hub_download
import os
os.environ["HF_HUB_ENABLE_HF_TRANSFER"] = "1"

hf_hub_download(
    repo_id="meta-llama/Llama-2-70b-hf",
    filename="pytorch_model.bin",
    local_dir="/mnt/data/models"
)
```

**Parallel downloads with `aria2c`:**

```bash
sudo apt install aria2   # Debian/Ubuntu
sudo dnf install aria2   # RHEL/Fedora

# Download with 16 parallel connections
aria2c -x 16 -s 16 -k 1M \
  --max-connection-per-server=16 \
  --min-split-size=1M \
  --interface=enp4s0f0 \
  "https://example.com/model.safetensors"
```

### 4.3 Local Model Cache with NFS

See section 5 for NFS configuration.

---

## 5. Network Storage Integration

### 5.1 NFS Server Configuration

**Install NFS server:**

```bash
sudo apt install nfs-kernel-server   # Debian/Ubuntu
sudo dnf install nfs-utils            # RHEL/Fedora
```

**Export model storage:**

```bash
# File: /etc/exports
cat <<EOF | sudo tee -a /etc/exports
/mnt/data/models    10.0.10.0/24(rw,sync,no_subtree_check,no_root_squash)
/mnt/data/datasets  10.0.10.0/24(rw,sync,no_subtree_check,no_root_squash)
EOF

# Apply
sudo exportfs -arv

# Enable and start
sudo systemctl enable nfs-server
sudo systemctl start nfs-server

# Verify
sudo exportfs -v
```

**Performance tuning:**

```bash
# File: /etc/default/nfs-kernel-server
RPCNFSDCOUNT=64  # Number of NFS threads (match CPU cores)

# File: /etc/nfs.conf
[nfsd]
threads=64
udp=n          # Disable UDP (use TCP only)
vers2=n        # Disable NFSv2
vers3=y        # Enable NFSv3
vers4=y        # Enable NFSv4
vers4.0=y
vers4.1=y
vers4.2=y

# Restart
sudo systemctl restart nfs-server
```

### 5.2 NFS Client Configuration

**Mount NFS shares:**

```bash
# Install client
sudo apt install nfs-common   # Debian/Ubuntu
sudo dnf install nfs-utils    # RHEL/Fedora

# Create mount points
sudo mkdir -p /mnt/nfs/models
sudo mkdir -p /mnt/nfs/datasets

# Manual mount
sudo mount -t nfs -o nfsvers=4.2,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2 \
  10.0.10.200:/mnt/data/models /mnt/nfs/models

# Persistent mount (File: /etc/fstab)
cat <<EOF | sudo tee -a /etc/fstab
10.0.10.200:/mnt/data/models    /mnt/nfs/models    nfs4    nfsvers=4.2,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,_netdev    0 0
10.0.10.200:/mnt/data/datasets  /mnt/nfs/datasets  nfs4    nfsvers=4.2,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,_netdev    0 0
EOF

# Mount all
sudo mount -a

# Verify
df -h | grep nfs
```

### 5.3 SMB/CIFS Configuration (Windows compatibility)

**Install Samba server:**

```bash
sudo apt install samba   # Debian/Ubuntu
sudo dnf install samba   # RHEL/Fedora

# File: /etc/samba/smb.conf
cat <<EOF | sudo tee -a /etc/samba/smb.conf
[models]
    path = /mnt/data/models
    browseable = yes
    read only = no
    guest ok = no
    valid users = @aiusers
    create mask = 0664
    directory mask = 0775
    vfs objects = io_uring

    # Performance
    socket options = TCP_NODELAY IPTOS_LOWDELAY
    read raw = yes
    write raw = yes
    max xmit = 65535
    aio read size = 16384
    aio write size = 16384
EOF

# Create user group
sudo groupadd aiusers
sudo usermod -aG aiusers $USER

# Set Samba password
sudo smbpasswd -a $USER

# Enable and start
sudo systemctl enable smbd
sudo systemctl start smbd

# Verify
smbclient -L localhost -U $USER
```

**Mount SMB share (client):**

```bash
sudo apt install cifs-utils

# Create credentials file
cat <<EOF > ~/.smbcredentials
username=youruser
password=yourpassword
domain=WORKGROUP
EOF
chmod 600 ~/.smbcredentials

# Mount
sudo mount -t cifs -o credentials=/home/$USER/.smbcredentials,uid=$UID,gid=$GID \
  //10.0.10.200/models /mnt/smb/models

# Persistent (File: /etc/fstab)
echo "//10.0.10.200/models /mnt/smb/models cifs credentials=/home/$USER/.smbcredentials,uid=$UID,gid=$GID,_netdev 0 0" | sudo tee -a /etc/fstab
```

---

## 6. Remote Management Setup (IPMI + PiKVM)

### 6.1 PiKVM v4 Configuration

**Initial Setup:**

1. Flash PiKVM OS to microSD card: https://docs.pikvm.org/flashing_os/
2. Connect PiKVM to workstation:
   - USB-C to USB 3.0 header (keyboard/mouse emulation)
   - HDMI from GPU to PiKVM HDMI input
   - Ethernet to isolated management network (192.168.254.0/24)
   - ATX power control cable (optional)

**Access PiKVM:**

```bash
# Default credentials: admin / admin
https://192.168.254.10

# SSH access
ssh root@192.168.254.10
# Default password: root
```

**Configure PiKVM:**

```bash
# Make filesystem read-write
rw

# Change passwords
passwd root
kvmd-htpasswd set admin

# Configure network (File: /etc/systemd/network/eth0.network)
cat <<EOF > /etc/systemd/network/eth0.network
[Match]
Name=eth0

[Network]
Address=192.168.254.10/24
Gateway=192.168.254.1
DNS=1.1.1.1
EOF

# Apply network config
systemctl restart systemd-networkd

# Make filesystem read-only again
ro
```

**Enable ATX Power Control:**

```bash
# Connect GPIO pins from PiKVM to motherboard front panel headers:
# - Power button: GPIO 23
# - Reset button: GPIO 27
# - Power LED: GPIO 24
# - HDD LED: GPIO 22

# Configuration (File: /etc/kvmd/override.yaml)
rw
cat <<EOF >> /etc/kvmd/override.yaml
atx:
    type: gpio
    power_led_pin: 24
    hdd_led_pin: 22
    power_switch_pin: 23
    reset_switch_pin: 27
EOF

systemctl restart kvmd
ro
```

### 6.2 BIOS-Level Remote Access

**Configure motherboard BIOS:**

1. Enable IPMI/BMC if available (check motherboard manual)
2. Set IPMI network to static IP: 192.168.254.11/24
3. Enable remote KVM/SOL (Serial Over LAN)

**For motherboards without IPMI, use PiKVM:**

- Full BIOS access via PiKVM virtual KVM
- Can enter BIOS setup by accessing PiKVM web UI before POST
- Virtual media mounting for OS installation

**PiKVM Virtual Media:**

```bash
# Upload ISO to PiKVM
# Web UI: Tools -> Mass Storage -> Upload Image

# Mount via web UI or CLI
kvmd-otgmsd -f -r /var/lib/kvmd/msd/images/ubuntu-22.04.iso

# Unmount
kvmd-otgmsd -f
```

### 6.3 Wake-on-LAN Configuration

**Enable in BIOS:**

- Power Management -> Wake on LAN: Enabled
- PCIe Power: Keep power on PCIe devices in S5

**Configure network interface:**

```bash
# Enable WoL on 10GbE interface
sudo ethtool -s enp0s31f6 wol g

# Make persistent (File: /etc/network/if-up.d/wol)
cat <<'EOF' | sudo tee /etc/network/if-up.d/wol
#!/bin/bash
ethtool -s enp0s31f6 wol g
EOF
sudo chmod +x /etc/network/if-up.d/wol

# Verify
sudo ethtool enp0s31f6 | grep Wake-on
# Should show: Wake-on: g
```

**Wake workstation remotely:**

```bash
# Install wakeonlan
sudo apt install wakeonlan

# Get MAC address
ip link show enp0s31f6 | grep ether

# Wake from remote machine
wakeonlan -i 192.168.1.255 AA:BB:CC:DD:EE:FF

# Or from PiKVM
ssh root@192.168.254.10 wakeonlan -i 192.168.1.255 AA:BB:CC:DD:EE:FF
```

---

## 7. SSH Hardening and Key Management

### 7.1 SSH Server Configuration

**File: `/etc/ssh/sshd_config`**

```bash
# Backup original config
sudo cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Secure configuration
sudo tee /etc/ssh/sshd_config > /dev/null <<'EOF'
# Network
Port 22
AddressFamily inet
ListenAddress 192.168.1.100  # Bind to 10GbE interface only

# Authentication
PermitRootLogin no
PubkeyAuthentication yes
PasswordAuthentication no
PermitEmptyPasswords no
ChallengeResponseAuthentication no
UsePAM yes

# Key-based auth only
AuthorizedKeysFile .ssh/authorized_keys
HostKey /etc/ssh/ssh_host_ed25519_key
HostKey /etc/ssh/ssh_host_rsa_key

# Security
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
Subsystem sftp /usr/lib/openssh/sftp-server
MaxAuthTries 3
MaxSessions 10
ClientAliveInterval 300
ClientAliveCountMax 2

# Allowed users
AllowUsers yourusername

# Ciphers and MACs (strong crypto only)
Ciphers chacha20-poly1305@openssh.com,aes256-gcm@openssh.com,aes128-gcm@openssh.com,aes256-ctr,aes192-ctr,aes128-ctr
MACs hmac-sha2-512-etm@openssh.com,hmac-sha2-256-etm@openssh.com,hmac-sha2-512,hmac-sha2-256
KexAlgorithms curve25519-sha256,curve25519-sha256@libssh.org,diffie-hellman-group-exchange-sha256
HostKeyAlgorithms ssh-ed25519,rsa-sha2-512,rsa-sha2-256
EOF

# Restart SSH
sudo systemctl restart sshd

# Verify
sudo sshd -t
sudo systemctl status sshd
```

### 7.2 SSH Key Management

**Generate strong SSH keys:**

```bash
# ED25519 key (recommended)
ssh-keygen -t ed25519 -C "workstation-$(hostname)-$(date +%Y%m%d)" -f ~/.ssh/id_ed25519

# RSA 4096-bit (for compatibility)
ssh-keygen -t rsa -b 4096 -C "workstation-$(hostname)-$(date +%Y%m%d)" -f ~/.ssh/id_rsa

# Set permissions
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

**Deploy public key:**

```bash
# Copy to remote server
ssh-copy-id -i ~/.ssh/id_ed25519.pub user@remote-server

# Or manually
cat ~/.ssh/id_ed25519.pub | ssh user@remote-server "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

**SSH agent for key management:**

```bash
# Start agent (add to ~/.bashrc)
cat <<'EOF' >> ~/.bashrc
# SSH Agent
if [ -z "$SSH_AUTH_SOCK" ] ; then
    eval `ssh-agent -s`
    ssh-add ~/.ssh/id_ed25519
fi
EOF

# Load keys
ssh-add ~/.ssh/id_ed25519
ssh-add -l  # List loaded keys
```

### 7.3 Two-Factor Authentication (Optional)

```bash
# Install Google Authenticator
sudo apt install libpam-google-authenticator

# Configure for user
google-authenticator
# Answer: yes, yes, yes, no, yes

# Enable in PAM (File: /etc/pam.d/sshd)
echo "auth required pam_google_authenticator.so" | sudo tee -a /etc/pam.d/sshd

# Enable in SSH config (File: /etc/ssh/sshd_config)
echo "ChallengeResponseAuthentication yes" | sudo tee -a /etc/ssh/sshd_config
echo "AuthenticationMethods publickey,keyboard-interactive" | sudo tee -a /etc/ssh/sshd_config

sudo systemctl restart sshd
```

### 7.4 SSH Tunneling for Secure Access

**Port forwarding:**

```bash
# Local forwarding (access remote service locally)
ssh -L 8080:localhost:80 user@remote-server

# Remote forwarding (expose local service remotely)
ssh -R 8080:localhost:80 user@remote-server

# SOCKS proxy
ssh -D 1080 -N -f user@remote-server
# Configure browser to use SOCKS5 proxy localhost:1080
```

**Persistent tunnels with autossh:**

```bash
sudo apt install autossh

# Example: Persistent Jupyter tunnel
autossh -M 0 -N -f -o "ServerAliveInterval 30" -o "ServerAliveCountMax 3" \
  -L 8888:localhost:8888 user@remote-server
```

---

## 8. Firewall Configuration

### 8.1 UFW (Uncomplicated Firewall) - Ubuntu/Debian

```bash
# Install
sudo apt install ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (10GbE interface only)
sudo ufw allow in on enp0s31f6 to any port 22 proto tcp

# Allow high-speed data networks (trusted)
sudo ufw allow in on enp4s0f0
sudo ufw allow in on enp4s0f1

# Allow specific services
sudo ufw allow 8888/tcp comment 'Jupyter'
sudo ufw allow 6006/tcp comment 'TensorBoard'

# Enable firewall
sudo ufw enable

# Verify
sudo ufw status verbose
```

### 8.2 Firewalld - RHEL/Fedora

```bash
# Install
sudo dnf install firewalld

# Start and enable
sudo systemctl enable --now firewalld

# Create zones for different interfaces
sudo firewall-cmd --permanent --new-zone=management
sudo firewall-cmd --permanent --new-zone=highspeed
sudo firewall-cmd --permanent --new-zone=rdma

# Assign interfaces to zones
sudo firewall-cmd --permanent --zone=public --change-interface=enp0s31f6
sudo firewall-cmd --permanent --zone=highspeed --change-interface=enp4s0f0
sudo firewall-cmd --permanent --zone=rdma --change-interface=enp4s0f1

# Configure zones
# Public zone (10GbE): SSH only
sudo firewall-cmd --permanent --zone=public --add-service=ssh

# High-speed zone: trusted internal network
sudo firewall-cmd --permanent --zone=highspeed --set-target=ACCEPT

# RDMA zone: trusted internal network
sudo firewall-cmd --permanent --zone=rdma --set-target=ACCEPT

# Allow specific services
sudo firewall-cmd --permanent --zone=public --add-port=8888/tcp  # Jupyter
sudo firewall-cmd --permanent --zone=public --add-port=6006/tcp  # TensorBoard

# Reload
sudo firewall-cmd --reload

# Verify
sudo firewall-cmd --list-all-zones
```

### 8.3 Advanced Firewall Rules

**Rate limiting SSH:**

```bash
# UFW
sudo ufw limit 22/tcp comment 'SSH rate limit'

# Firewalld
sudo firewall-cmd --permanent --add-rich-rule='rule service name=ssh limit value=10/m accept'
sudo firewall-cmd --reload

# iptables (manual)
sudo iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --set
sudo iptables -A INPUT -p tcp --dport 22 -m state --state NEW -m recent --update --seconds 60 --hitcount 4 -j DROP
```

**Block specific countries (GeoIP):**

```bash
# Install xtables-addons
sudo apt install xtables-addons-common

# Download GeoIP database
sudo mkdir -p /usr/share/xt_geoip
cd /tmp
wget https://download.db-ip.com/free/dbip-country-lite-$(date +%Y-%m).csv.gz
gunzip dbip-country-lite-*.csv.gz
sudo /usr/lib/xtables-addons/xt_geoip_build -D /usr/share/xt_geoip dbip-country-lite-*.csv

# Block specific countries (example: block CN, RU)
sudo iptables -A INPUT -m geoip --src-cc CN,RU -j DROP

# Make persistent
sudo apt install iptables-persistent
sudo netfilter-persistent save
```

---

## 9. Network Monitoring and Diagnostics

### 9.1 Real-Time Monitoring Tools

**Install monitoring tools:**

```bash
# Ubuntu/Debian
sudo apt install iftop nethogs bmon nload iperf3 tcpdump wireshark ethtool

# RHEL/Fedora
sudo dnf install iftop nethogs bmon nload iperf3 tcpdump wireshark ethtool
```

**iftop - Interface bandwidth monitoring:**

```bash
# Monitor 10GbE interface
sudo iftop -i enp0s31f6

# Monitor 25GbE interface
sudo iftop -i enp4s0f0

# Show ports
sudo iftop -i enp0s31f6 -P
```

**nethogs - Per-process bandwidth:**

```bash
sudo nethogs enp0s31f6
```

**bmon - Bandwidth monitor:**

```bash
bmon
# Press 'd' to select interface
# Press 'g' for graph view
```

**nload - Simple real-time monitoring:**

```bash
nload enp0s31f6 enp4s0f0
```

### 9.2 Performance Monitoring Scripts

**File: `/usr/local/bin/network-stats.sh`**

```bash
#!/bin/bash
# Network Performance Statistics

echo "=== Network Interface Statistics ==="
for IFACE in enp0s31f6 enp4s0f0 enp4s0f1; do
    if ip link show $IFACE &>/dev/null; then
        echo ""
        echo "Interface: $IFACE"
        echo "---"

        # Link status
        SPEED=$(ethtool $IFACE 2>/dev/null | grep Speed | awk '{print $2}')
        DUPLEX=$(ethtool $IFACE 2>/dev/null | grep Duplex | awk '{print $2}')
        echo "Speed: $SPEED, Duplex: $DUPLEX"

        # Traffic stats
        RX_BYTES=$(cat /sys/class/net/$IFACE/statistics/rx_bytes)
        TX_BYTES=$(cat /sys/class/net/$IFACE/statistics/tx_bytes)
        RX_PACKETS=$(cat /sys/class/net/$IFACE/statistics/rx_packets)
        TX_PACKETS=$(cat /sys/class/net/$IFACE/statistics/tx_packets)
        RX_ERRORS=$(cat /sys/class/net/$IFACE/statistics/rx_errors)
        TX_ERRORS=$(cat /sys/class/net/$IFACE/statistics/tx_errors)
        RX_DROPPED=$(cat /sys/class/net/$IFACE/statistics/rx_dropped)
        TX_DROPPED=$(cat /sys/class/net/$IFACE/statistics/tx_dropped)

        echo "RX: $(numfmt --to=iec-i --suffix=B $RX_BYTES) ($RX_PACKETS packets)"
        echo "TX: $(numfmt --to=iec-i --suffix=B $TX_BYTES) ($TX_PACKETS packets)"
        echo "Errors: RX=$RX_ERRORS, TX=$TX_ERRORS"
        echo "Dropped: RX=$RX_DROPPED, TX=$TX_DROPPED"

        # Ring buffer utilization
        ethtool -S $IFACE 2>/dev/null | grep -E "(rx_queue|tx_queue)" | head -5
    fi
done

echo ""
echo "=== Active Connections ==="
ss -s

echo ""
echo "=== TCP Connection States ==="
ss -tan | awk '{print $1}' | sort | uniq -c | sort -rn

echo ""
echo "=== Top 10 Connections by Data Transfer ==="
ss -tin | awk '/^ESTAB/ {print $5,$6}' | sort | uniq -c | sort -rn | head -10
```

```bash
sudo chmod +x /usr/local/bin/network-stats.sh
sudo /usr/local/bin/network-stats.sh
```

### 9.3 Packet Capture and Analysis

**tcpdump examples:**

```bash
# Capture on 25GbE interface
sudo tcpdump -i enp4s0f0 -w /tmp/capture.pcap

# Capture specific traffic
sudo tcpdump -i enp4s0f0 'tcp port 2049'  # NFS traffic
sudo tcpdump -i enp4s0f1 'udp port 4791'  # RoCE traffic

# Capture with filters
sudo tcpdump -i enp0s31f6 'src net 10.0.10.0/24 and dst port 22'

# Display packet contents
sudo tcpdump -i enp4s0f0 -A -s 0 'tcp port 80'
```

**Wireshark analysis:**

```bash
# Capture to file for later analysis
sudo tcpdump -i enp4s0f0 -w /tmp/capture.pcap -C 100 -W 10

# Analyze with Wireshark
wireshark /tmp/capture.pcap

# Or use tshark (CLI)
tshark -r /tmp/capture.pcap -Y "tcp.port==2049" -T fields -e frame.time -e ip.src -e ip.dst
```

### 9.4 Continuous Monitoring with Prometheus + Grafana

**Install node_exporter:**

```bash
# Download
wget https://github.com/prometheus/node_exporter/releases/download/v1.6.1/node_exporter-1.6.1.linux-amd64.tar.gz
tar xvfz node_exporter-1.6.1.linux-amd64.tar.gz
sudo cp node_exporter-1.6.1.linux-amd64/node_exporter /usr/local/bin/

# Create systemd service
cat <<EOF | sudo tee /etc/systemd/system/node_exporter.service
[Unit]
Description=Node Exporter
After=network.target

[Service]
User=nobody
ExecStart=/usr/local/bin/node_exporter

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable --now node_exporter

# Verify
curl http://localhost:9100/metrics | grep node_network
```

---

## 10. Bandwidth Testing Procedures

### 10.1 iperf3 Throughput Testing

**Server mode:**

```bash
# Start iperf3 server on port 5201
iperf3 -s -p 5201

# Bind to specific interface
iperf3 -s -B 10.0.10.100
```

**Client mode (throughput test):**

```bash
# Single stream test
iperf3 -c 10.0.10.200 -t 30 -i 1

# Parallel streams (4 threads)
iperf3 -c 10.0.10.200 -P 4 -t 30

# Reverse test (server sends data)
iperf3 -c 10.0.10.200 -R -t 30

# Bidirectional test
iperf3 -c 10.0.10.200 --bidir -t 30

# UDP test (with 25 Gbps target)
iperf3 -c 10.0.10.200 -u -b 25G -t 30

# TCP window size tuning
iperf3 -c 10.0.10.200 -w 4M -t 30

# JSON output for scripting
iperf3 -c 10.0.10.200 -J > /tmp/iperf-results.json
```

**Expected results:**

- 10GbE: 9.4-9.7 Gbps (TCP), ~9.8 Gbps (UDP)
- 25GbE: 23-24 Gbps (TCP), ~24.5 Gbps (UDP)

### 10.2 Storage Performance Testing

**NFS performance:**

```bash
# Write test
dd if=/dev/zero of=/mnt/nfs/models/testfile bs=1M count=10000 conv=fdatasync
# Expected: 1.5-2.5 GB/s on 25GbE

# Read test
echo 3 | sudo tee /proc/sys/vm/drop_caches  # Clear cache
dd if=/mnt/nfs/models/testfile of=/dev/null bs=1M
# Expected: 2.0-2.8 GB/s on 25GbE

# fio benchmark
sudo apt install fio

fio --name=nfs-seq-read \
    --directory=/mnt/nfs/models \
    --rw=read \
    --bs=1M \
    --size=10G \
    --numjobs=4 \
    --time_based \
    --runtime=60 \
    --group_reporting

fio --name=nfs-seq-write \
    --directory=/mnt/nfs/models \
    --rw=write \
    --bs=1M \
    --size=10G \
    --numjobs=4 \
    --time_based \
    --runtime=60 \
    --group_reporting
```

### 10.3 Latency Testing

**Ping tests:**

```bash
# ICMP ping
ping -i 0.2 -c 100 10.0.10.200
# Expected: <0.1 ms (same rack), 0.1-0.5 ms (same datacenter)

# Flood ping (requires root)
sudo ping -f -c 10000 10.0.10.200

# Large packet ping
ping -s 8000 -M do -c 100 10.0.10.200  # Test jumbo frames
```

**RDMA latency:**

```bash
# ib_write_lat (one-way latency)
# Server:
ib_write_lat -d mlx5_0 -F

# Client:
ib_write_lat -d mlx5_0 -F 10.0.20.200
# Expected: 1-3 microseconds

# ib_read_lat
ib_read_lat -d mlx5_0 -F 10.0.20.200
```

### 10.4 Automated Testing Script

**File: `/usr/local/bin/network-benchmark.sh`**

```bash
#!/bin/bash
# Automated Network Benchmark Suite

RESULTS_DIR="/var/log/network-benchmarks/$(date +%Y%m%d-%H%M%S)"
mkdir -p $RESULTS_DIR

echo "Network Benchmark Suite - $(date)"
echo "Results will be saved to: $RESULTS_DIR"

# Function to test interface
test_interface() {
    local IFACE=$1
    local REMOTE_IP=$2
    local NAME=$3

    echo ""
    echo "=== Testing $NAME ($IFACE) ==="

    # Ping test
    echo "Ping test..."
    ping -c 100 -i 0.2 $REMOTE_IP > $RESULTS_DIR/${NAME}_ping.txt

    # iperf3 TCP test
    echo "iperf3 TCP throughput (single stream)..."
    iperf3 -c $REMOTE_IP -B $(ip -4 addr show $IFACE | grep inet | awk '{print $2}' | cut -d/ -f1) \
        -t 30 -J > $RESULTS_DIR/${NAME}_iperf_tcp_single.json

    # iperf3 TCP parallel
    echo "iperf3 TCP throughput (4 streams)..."
    iperf3 -c $REMOTE_IP -B $(ip -4 addr show $IFACE | grep inet | awk '{print $2}' | cut -d/ -f1) \
        -P 4 -t 30 -J > $RESULTS_DIR/${NAME}_iperf_tcp_parallel.json

    # iperf3 UDP
    echo "iperf3 UDP throughput..."
    iperf3 -c $REMOTE_IP -B $(ip -4 addr show $IFACE | grep inet | awk '{print $2}' | cut -d/ -f1) \
        -u -b 0 -t 30 -J > $RESULTS_DIR/${NAME}_iperf_udp.json
}

# Test 10GbE
test_interface "enp0s31f6" "192.168.1.200" "10GbE"

# Test 25GbE
test_interface "enp4s0f0" "10.0.10.200" "25GbE-Port0"

# RDMA tests
if command -v ib_write_bw &> /dev/null; then
    echo ""
    echo "=== RDMA Bandwidth Test ==="
    ib_write_bw -d mlx5_0 -F --report_gbits 10.0.20.200 > $RESULTS_DIR/rdma_bandwidth.txt

    echo "=== RDMA Latency Test ==="
    ib_write_lat -d mlx5_0 -F 10.0.20.200 > $RESULTS_DIR/rdma_latency.txt
fi

# Generate summary
echo ""
echo "=== Benchmark Summary ==="
echo "Results saved to: $RESULTS_DIR"

# Parse results
if command -v jq &> /dev/null; then
    echo ""
    echo "TCP Throughput Results:"
    for file in $RESULTS_DIR/*_iperf_tcp_*.json; do
        NAME=$(basename $file .json)
        BW=$(jq -r '.end.sum_received.bits_per_second' $file | awk '{print $1/1e9 " Gbps"}')
        echo "  $NAME: $BW"
    done
fi
```

```bash
sudo chmod +x /usr/local/bin/network-benchmark.sh
```

---

## 11. Network Redundancy Options

### 11.1 Link Aggregation (LACP/Bonding)

**Bonding for 25GbE dual ports:**

```bash
# Install bonding tools
sudo apt install ifenslave   # Debian/Ubuntu

# Load bonding module
sudo modprobe bonding
echo "bonding" | sudo tee -a /etc/modules

# Netplan configuration (File: /etc/netplan/02-bonding.yaml)
cat <<EOF | sudo tee /etc/netplan/02-bonding.yaml
network:
  version: 2
  renderer: networkd
  ethernets:
    enp4s0f0:
      dhcp4: false
    enp4s0f1:
      dhcp4: false
  bonds:
    bond0:
      interfaces:
        - enp4s0f0
        - enp4s0f1
      addresses:
        - 10.0.10.100/24
      parameters:
        mode: 802.3ad       # LACP
        lacp-rate: fast
        mii-monitor-interval: 100
        transmit-hash-policy: layer3+4
      mtu: 9000
EOF

sudo netplan apply

# Verify
cat /proc/net/bonding/bond0
```

**NetworkManager bonding:**

```bash
# Create bond
nmcli con add type bond con-name bond0 ifname bond0 mode 802.3ad

# Add slaves
nmcli con add type ethernet slave-type bond con-name bond0-port1 ifname enp4s0f0 master bond0
nmcli con add type ethernet slave-type bond con-name bond0-port2 ifname enp4s0f1 master bond0

# Configure IP
nmcli con mod bond0 ipv4.addresses 10.0.10.100/24
nmcli con mod bond0 ipv4.method manual

# Activate
nmcli con up bond0
```

**Expected throughput:** ~48 Gbps aggregate (requires LACP-capable switch)

### 11.2 Failover Configuration

**Active-backup bonding:**

```bash
# Netplan (File: /etc/netplan/02-bonding.yaml)
cat <<EOF | sudo tee /etc/netplan/02-bonding.yaml
network:
  version: 2
  bonds:
    bond0:
      interfaces:
        - enp4s0f0
        - enp4s0f1
      addresses:
        - 10.0.10.100/24
      parameters:
        mode: active-backup  # Failover mode
        primary: enp4s0f0
        mii-monitor-interval: 100
        fail-over-mac-policy: active
      mtu: 9000
EOF
```

**Test failover:**

```bash
# Disable primary interface
sudo ip link set enp4s0f0 down

# Check bond status
cat /proc/net/bonding/bond0
# Should show enp4s0f1 as active

# Re-enable
sudo ip link set enp4s0f0 up
```

### 11.3 Multipath Routing

**Configure multiple default routes:**

```bash
# Add secondary route with higher metric
sudo ip route add default via 10.0.10.1 dev enp4s0f0 metric 100
sudo ip route add default via 192.168.1.1 dev enp0s31f6 metric 200

# Verify
ip route show
```

---

## 12. Future Expansion Planning

### 12.1 Upgrade Paths

**40/50 GbE Upgrade:**

- Upgrade Mellanox ConnectX-4 Lx to ConnectX-5 (40/50 GbE)
- Cost: ~$200-300 for ConnectX-5 Ex
- Requires: DAC/AOC cables or SFP56 transceivers
- Expected throughput: 45-48 Gbps (50 GbE)

**100 GbE Upgrade:**

- Mellanox ConnectX-6 Dx (100 GbE)
- Cost: ~$500-800
- Requires: QSFP28/QSFP56 transceivers ($100-300 each)
- PCIe 4.0 x16 slot required
- Expected throughput: 95-98 Gbps

**InfiniBand Option:**

- Mellanox ConnectX-4 Lx supports 40 Gbps InfiniBand (EDR)
- Lower latency than Ethernet (~0.5-1 μs)
- Requires InfiniBand switch ($$$)
- Best for HPC/distributed training clusters

### 12.2 Storage Expansion

**NVMe-oF (NVMe over Fabrics):**

```bash
# Server: Export NVMe device over RDMA
sudo modprobe nvmet-rdma
sudo nvmetcli

# Client: Connect to remote NVMe
sudo modprobe nvme-rdma
sudo nvme discover -t rdma -a 10.0.20.200 -s 4420
sudo nvme connect -t rdma -n nqn.2024-01.io.nvme:subsystem1 -a 10.0.20.200 -s 4420

# Mount
lsblk  # Find /dev/nvme1n1
sudo mkfs.ext4 /dev/nvme1n1
sudo mount /dev/nvme1n1 /mnt/nvmeof
```

**Expected performance:** 20-23 GB/s over 25GbE RDMA

### 12.3 Network Topology Planning

**Current Topology:**

```
Workstation
├── 10GbE (enp0s31f6) ──> Switch ──> Router ──> Internet
├── 25GbE Port 0 (enp4s0f0) ──> DAC ──> NAS/Storage Server
└── 25GbE Port 1 (enp4s0f1) ──> DAC ──> Compute Cluster
```

**Future Multi-Node Cluster:**

```
     ┌──────────────┐
     │  10GbE Switch│ (Internet/Management)
     └──────┬───────┘
            │
    ┌───────┴────────┬──────────────┐
    │                │              │
┌───▼────┐      ┌────▼───┐     ┌───▼────┐
│ Node 1 │      │ Node 2 │     │ Node 3 │
│ (This) │      │        │     │        │
└───┬────┘      └────┬───┘     └───┬────┘
    │                │              │
    │   25GbE    ┌───▼──────────────▼───┐
    └────────────►   High-Speed Switch  │
                 │   (25/40/100 GbE)    │
                 └──────────────────────┘
```

**Recommended switch:**

- FS S5860-20SQ (20x 25GbE SFP28): ~$800
- MikroTik CRS317-1G-16S+ (16x 10GbE SFP+): ~$500 (budget option)
- Mellanox SN2010 (18x 25GbE): ~$1500 (enterprise)

---

## 13. Security Best Practices

### 13.1 Network Segmentation

**VLAN Configuration:**

```
VLAN 1 (192.168.1.0/24):    Management/Internet (10GbE)
VLAN 10 (10.0.10.0/24):     High-Speed Data (25GbE Port 0)
VLAN 20 (10.0.20.0/24):     RDMA/Compute (25GbE Port 1)
VLAN 254 (192.168.254.0/24): IPMI/PiKVM (Isolated)
```

**Tagged VLAN on switch:**

- Configure switch ports as trunk ports
- Tag traffic by VLAN ID
- Prevent cross-VLAN routing (unless explicitly allowed)

### 13.2 Intrusion Detection

**Install Suricata:**

```bash
sudo apt install suricata

# Configure (File: /etc/suricata/suricata.yaml)
# Monitor 10GbE interface only
HOME_NET: "192.168.1.0/24"
EXTERNAL_NET: "!$HOME_NET"

af-packet:
  - interface: enp0s31f6
    threads: 4

# Enable and start
sudo systemctl enable suricata
sudo systemctl start suricata

# Monitor alerts
sudo tail -f /var/log/suricata/fast.log
```

### 13.3 VPN Access

**WireGuard VPN:**

```bash
sudo apt install wireguard

# Generate keys
wg genkey | sudo tee /etc/wireguard/privatekey | wg pubkey | sudo tee /etc/wireguard/publickey

# Configure (File: /etc/wireguard/wg0.conf)
cat <<EOF | sudo tee /etc/wireguard/wg0.conf
[Interface]
PrivateKey = $(sudo cat /etc/wireguard/privatekey)
Address = 10.8.0.1/24
ListenPort = 51820

[Peer]
PublicKey = CLIENT_PUBLIC_KEY
AllowedIPs = 10.8.0.2/32
EOF

# Enable IP forwarding
echo "net.ipv4.ip_forward=1" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Start VPN
sudo wg-quick up wg0
sudo systemctl enable wg-quick@wg0
```

---

## 14. Troubleshooting Guide

### 14.1 Interface Not Coming Up

```bash
# Check hardware
lspci | grep -i ethernet
lspci | grep -i mellanox

# Check driver
ethtool -i enp4s0f0
modinfo mlx5_core

# Reload driver
sudo modprobe -r mlx5_core
sudo modprobe mlx5_core

# Check dmesg
sudo dmesg | grep -i mlx5
```

### 14.2 Low Throughput

```bash
# Check link speed
ethtool enp4s0f0 | grep Speed
# Should show: Speed: 25000Mb/s

# Check for errors
ethtool -S enp4s0f0 | grep -E "(error|drop|discard)"

# Check CPU usage
mpstat -P ALL 1

# Check IRQ distribution
cat /proc/interrupts | grep mlx5
```

### 14.3 RDMA Not Working

```bash
# Verify RDMA devices
ibv_devices
rdma link

# Check RDMA modules
lsmod | grep rdma

# Reload RDMA stack
sudo systemctl restart openibd

# Test loopback
ib_write_bw -d mlx5_0 --report_gbits &
ib_write_bw -d mlx5_0 --report_gbits localhost
```

### 14.4 PiKVM Not Accessible

```bash
# Check PiKVM power
# LED should be solid green

# Check network
ping 192.168.254.10

# Access via serial console
# Connect USB to TTL adapter to GPIO pins

# Reset PiKVM
sudo reboot  # From SSH

# Factory reset
# Hold button during boot
```

---

## 15. Quick Reference Commands

```bash
# Network status
ip addr show
ip route show
ip link show

# Interface statistics
ethtool -S enp4s0f0

# Connection tracking
ss -tunap
netstat -tunap

# Bandwidth monitoring
iftop -i enp4s0f0
bmon

# Performance testing
iperf3 -c 10.0.10.200 -P 4
ib_write_bw -d mlx5_0 -F --report_gbits 10.0.20.200

# Firewall status
sudo ufw status verbose
sudo firewall-cmd --list-all

# RDMA status
ibv_devices
rdma link
ibstat

# NFS mounts
df -h | grep nfs
showmount -e 10.0.10.200

# Service management
sudo systemctl status sshd
sudo systemctl status nfs-server
sudo systemctl status openibd

# Logs
sudo journalctl -u NetworkManager -f
sudo journalctl -u sshd -f
sudo dmesg | tail -50
```

---

## Appendix A: Network Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Workstation                              │
│                                                                 │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   10GbE    │  │ 25GbE Port 0 │  │ 25GbE Port 1 │           │
│  │ (onboard)  │  │  (Mellanox)  │  │  (Mellanox)  │           │
│  └─────┬──────┘  └──────┬───────┘  └──────┬───────┘           │
│        │                │                  │                    │
└────────┼────────────────┼──────────────────┼────────────────────┘
         │                │                  │
         │                │                  │
    192.168.1.100    10.0.10.100        10.0.20.100
         │                │                  │
         │                │                  │
    ┌────▼─────┐     ┌────▼────┐        ┌───▼─────┐
    │  Router  │     │   NAS   │        │ Compute │
    │          │     │ Storage │        │ Cluster │
    └────┬─────┘     └─────────┘        └─────────┘
         │
         │
    ┌────▼──────┐
    │ Internet  │
    └───────────┘

Management Network (192.168.254.0/24):
┌──────────┐
│  PiKVM   │ 192.168.254.10
└────┬─────┘
     │
┌────▼─────┐
│   IPMI   │ 192.168.254.11 (if available)
└──────────┘
```

---

## Appendix B: Cable and Transceiver Guide

### 25GbE Connections

**Direct Attach Copper (DAC):**

- FS 25G SFP28 DAC Cable (1-5m): $20-40
- Mellanox MCP2M00-A001 (1m): $30
- Mellanox MCP2M00-A003 (3m): $40
- Max distance: 5m
- Best for: Rack-to-rack connections

**Active Optical Cable (AOC):**

- FS 25G SFP28 AOC (10-30m): $60-150
- Lower power, longer distance than DAC
- Best for: Cross-rack connections

**Fiber Optic (with transceivers):**

- SFP28 SR transceiver: $40-60 each
- OM3/OM4 multimode fiber: $2/meter
- Max distance: 100m (OM4)
- Best for: Building-to-building

### 10GbE Connections

**RJ45 Cat6a/Cat7:**

- Cat6a cable: $1-2/meter
- Max distance: 100m
- Best for: Standard networking

---

## Document Version

- **Version:** 1.0
- **Last Updated:** 2025-11-02
- **Author:** Network & Infrastructure Architect
- **Review Cycle:** Quarterly

---

## Related Documentation

- Storage Architecture: `/docs/storage/architecture.md`
- Security Hardening: `/docs/security/hardening-guide.md`
- Performance Tuning: `/docs/performance/tuning-guide.md`
- Disaster Recovery: `/docs/operations/disaster-recovery.md`
