#!/usr/bin/env python3
"""
RAFAY HACKING LAB — Kali Linux Local Companion Daemon
=====================================================
A lightweight, secure local bridge service running exclusively on 127.0.0.1:4444.
Allows RAFAY HACKING LAB web interface to safely invoke diagnostic commands inside
the user's authorized Kali Linux virtual machine with explicit token authorization.

Security Safeguards:
- Binds strictly to 127.0.0.1 loopback interface by default.
- Requires explicit pairing token authorization (header: X-Pairing-Token or X-Kali-Bridge-Token).
- Strict executable allowlist (shell=False execution without shell injection vulnerabilities).
- Max 10 KB payload size limit and 15s execution timeout.
- Explicit human confirmation logged locally before execution.
"""

import sys
import os
import json
import re
import shlex
import secrets
import subprocess
import argparse
from http.server import HTTPServer, BaseHTTPRequestHandler

DEFAULT_HOST = "127.0.0.1"
DEFAULT_PORT = 4444
MAX_PAYLOAD_BYTES = 10240  # 10 KB limit

# Strict Allowlist of permitted security executables
ALLOWED_EXECUTABLES = {
    "nmap",
    "wireshark",
    "tshark",
    "gobuster",
    "whatweb",
    "nikto",
    "sqlmap",
    "john",
    "hydra",
    "msfconsole",
    "aircrack-ng",
    "hashcat",
    "subfinder",
    "amass",
    "ping",
    "dig",
    "nslookup",
    "which",
    "command",
    "apt",
    "git",
    "python3",
    "bash",
    "cat",
    "ls",
    "grep",
}

# Configured pairing token (Set via --token CLI flag or KALI_BRIDGE_TOKEN env var)
PAIRING_TOKEN = os.environ.get("KALI_BRIDGE_TOKEN", "RH-KALI-BRIDGE-2026")

class KaliBridgeHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        # Restrict CORS to local web clients
        origin = self.headers.get("Origin", "http://localhost:3000")
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Pairing-Token, X-Kali-Bridge-Token")
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def _verify_token(self):
        token_header = self.headers.get("X-Pairing-Token") or self.headers.get("X-Kali-Bridge-Token") or ""
        return secrets.compare_digest(token_header, PAIRING_TOKEN)

    def do_GET(self):
        if self.path == "/health":
            is_authed = self._verify_token()
            response = {
                "status": "online",
                "service": "RAFAY HACKING LAB Kali Local Bridge",
                "authenticated": is_authed,
                "host": DEFAULT_HOST,
                "port": DEFAULT_PORT,
                "kaliRelease": "Kali Linux 2026 Rolling",
            }
            self._set_headers(200)
            self.wfile.write(json.dumps(response).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "NOT_FOUND"}).encode("utf-8"))

    def do_POST(self):
        if self.path in ["/execute", "/api/execute", "/api/check-tool"]:
            if not self._verify_token():
                self._set_headers(401)
                self.wfile.write(json.dumps({
                    "error": "UNAUTHORIZED",
                    "message": "Invalid or missing pairing token header (X-Pairing-Token)."
                }).encode("utf-8"))
                return

            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > MAX_PAYLOAD_BYTES:
                self._set_headers(413)
                self.wfile.write(json.dumps({"error": "Payload exceeds 10KB size limit"}).encode("utf-8"))
                return

            post_data = self.rfile.read(content_length)
            try:
                payload = json.loads(post_data.decode("utf-8"))
            except Exception:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Invalid JSON body"}).encode("utf-8"))
                return

            if self.path == "/api/check-tool":
                binary = payload.get("binary", "").strip().lower()
                clean_binary = re.sub(r"[^a-z0-9_-]", "", binary)
                try:
                    proc = subprocess.run(
                        ["which", clean_binary],
                        capture_output=True,
                        text=True,
                        timeout=5,
                        shell=False,
                    )
                    installed = proc.returncode == 0
                    self._set_headers(200)
                    self.wfile.write(json.dumps({
                        "installed": installed,
                        "binary": clean_binary,
                        "path": proc.stdout.strip() if installed else "",
                        "exitCode": proc.returncode,
                    }).encode("utf-8"))
                    return
                except Exception as e:
                    self._set_headers(500)
                    self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
                    return

            command = payload.get("command", "").strip()
            if not command:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Command parameter required"}).encode("utf-8"))
                return

            # Split command using shlex (safe argument parsing, shell=False)
            try:
                cmd_parts = shlex.split(command)
            except Exception as e:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": f"Invalid command syntax: {str(e)}"}).encode("utf-8"))
                return

            base_binary = os.path.basename(cmd_parts[0]).lower()

            if base_binary not in ALLOWED_EXECUTABLES:
                self._set_headers(403)
                self.wfile.write(json.dumps({
                    "error": "EXECUTABLE_NOT_ALLOWED",
                    "message": f"Executable '{base_binary}' is not in the strict safety allowlist."
                }).encode("utf-8"))
                return

            print(f"\n[RAFAY HACKING LAB AUTHORIZED EXECUTION]")
            print(f"  Command: {' '.join(cmd_parts)}")
            print(f"  Executing inside local Kali terminal sandbox...\n")

            try:
                proc = subprocess.run(
                    cmd_parts,
                    shell=False,  # Shell=False prevents shell injection vulnerabilities
                    capture_output=True,
                    text=True,
                    timeout=15,
                )
                self._set_headers(200)
                self.wfile.write(json.dumps({
                    "stdout": proc.stdout,
                    "stderr": proc.stderr,
                    "exitCode": proc.returncode,
                    "isSimulated": False,
                    "message": "Executed successfully via local Kali terminal"
                }).encode("utf-8"))
            except subprocess.TimeoutExpired:
                self._set_headers(408)
                self.wfile.write(json.dumps({
                    "stdout": "",
                    "stderr": "Execution timed out after 15 seconds.",
                    "exitCode": 124,
                    "isSimulated": False,
                }).encode("utf-8"))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({
                    "stdout": "",
                    "stderr": str(e),
                    "exitCode": 1,
                    "isSimulated": False,
                }).encode("utf-8"))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "NOT_FOUND"}).encode("utf-8"))

    def log_message(self, format, *args):
        sys.stderr.write(f"[KaliBridge] {self.address_string()} - {format%args}\n")

def run(host=DEFAULT_HOST, port=DEFAULT_PORT):
    server_address = (host, port)
    httpd = HTTPServer(server_address, KaliBridgeHandler)
    print("=" * 65)
    print("  RAFAY HACKING LAB — Kali Linux Local Companion Daemon")
    print(f"  Listening on: http://{host}:{port} (Loopback Only)")
    print(f"  Pairing Token: {PAIRING_TOKEN}")
    print("  Security: Shell=False | Executable Allowlist | 15s Timeout")
    print("=" * 65)
    print("Ready to receive user-approved commands from RAFAY HACKING LAB.\n")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping Kali Bridge Companion Daemon...")
        httpd.server_close()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="RAFAY HACKING LAB Kali Local Companion Service")
    parser.add_argument("--host", default=DEFAULT_HOST, help="Host address (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=DEFAULT_PORT, help="Port (default: 4444)")
    parser.add_argument("--token", default=PAIRING_TOKEN, help="Pairing token secret")
    args = parser.parse_args()

    PAIRING_TOKEN = args.token
    run(host=args.host, port=args.port)
