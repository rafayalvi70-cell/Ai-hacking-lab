# RAFAY HACKING LAB — Local Kali Linux Bridge Companion

The Kali Linux Companion Daemon establishes a secure local connection between the RAFAY HACKING LAB web interface and your local VirtualBox or native Kali Linux workstation.

---

## 🔒 Security Architecture
- **Local Loopback Only:** Listens exclusively on `127.0.0.1:4444`.
- **Token Authentication:** Every request requires header `X-Pairing-Token: RH-KALI-BRIDGE-2026`.
- **Explicit Human Authorization:** Commands are never executed silently; an interactive approval modal displays command previews and sudo checkboxes before execution.

---

## 🚀 Launching Companion Daemon on Kali Linux

```bash
# 1. Download or copy daemon script
curl -sSL https://raw.githubusercontent.com/rafayalvi/rafay-hacking-lab/main/scripts/kali-bridge-daemon.py -o kali-bridge-daemon.py

# 2. Make executable
chmod +x kali-bridge-daemon.py

# 3. Run Python companion service
python3 kali-bridge-daemon.py --token RH-KALI-BRIDGE-2026
```

Output:
```text
[*] RAFAY HACKING LAB Local Bridge Daemon
[*] Listening on http://127.0.0.1:4444
[*] Token authentication ACTIVE
```

---

## 💻 VirtualBox Host-Only Networking (Windows/Mac to Kali VM)

If your browser runs on Windows/Mac and Kali runs inside VirtualBox:
1. Open VirtualBox -> Settings -> Network.
2. Add a **Host-Only Adapter** (e.g. `vboxnet0` or `192.168.56.1`).
3. Set Kali IP address: `192.168.56.100`.
4. Run python daemon bound to Host-Only interface:
   ```bash
   python3 kali-bridge-daemon.py --host 192.168.56.100 --token RH-KALI-BRIDGE-2026
   ```
5. In RAFAY HACKING LAB Settings, set bridge IP: `http://192.168.56.100:4444`.
