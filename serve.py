#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Local Server Runner for Naji Sazan Amin Website
- Automatically finds an available port (if 8000 is busy, tries 8080, 8081, 8888, etc.)
- Displays clickable link in terminal
- Automatically opens default browser
"""

import os
import sys
import time
import socket
import threading
import webbrowser
import http.server
import socketserver

def get_free_port():
    candidate_ports = [8000, 8080, 8081, 8888, 8778, 3000, 5000, 9000]
    for p in candidate_ports:
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            s.bind(('127.0.0.1', p))
            s.close()
            return p
        except OSError:
            continue
    s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    s.bind(('', 0))
    port = s.getsockname()[1]
    s.close()
    return port

def main():
    project_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'naji-sazan-amin-next', 'out')
    if not os.path.isfile(os.path.join(project_dir, 'index.html')):
        print("\n  [✖] خروجی بیلد یافت نشد: naji-sazan-amin-next/out")
        print("  [i] ابتدا در پوشه naji-sazan-amin-next دستور زیر را اجرا کنید:")
        print("      npm run build")
        sys.exit(1)
    os.chdir(project_dir)

    port = get_free_port()
    url = f"http://localhost:{port}/"

    print("\n" + "=" * 64)
    print("      وب‌سایت مهندسین مشاور ناجی سازان امین (نسخه لوکال)")
    print("=" * 64)
    if port != 8000:
        print(f"  [i] پورت 8000 در سیستم شما مشغول بود.")
        print(f"  [✔] پورت آزاد {port} به صورت خودکار جایگزین و فعال شد.")
    else:
        print(f"  [✔] سرور لوکال با موفقیت روی پورت {port} فعال شد.")

    print("\n  🌐 لینک دسترسی به وب‌سایت:")
    print(f"     -->  {url}  <--")
    print("\n  (می‌توانید روی لینک بالا کلیک کنید یا در مرورگر باز کنید)")
    print("  مرورگر پیش‌فرض سیستم نیز به صورت خودکار باز خواهد شد...")
    print("  برای بستن سرور، کافیست کلیدهای Ctrl + C را بزنید یا پنجره را ببندید.")
    print("=" * 64 + "\n")

    def open_browser():
        time.sleep(0.5)
        try:
            webbrowser.open(url)
        except Exception:
            pass

    threading.Thread(target=open_browser, daemon=True).start()

    Handler = http.server.SimpleHTTPRequestHandler
    Handler.extensions_map.update({
        '.woff2': 'font/woff2',
        '.webm': 'video/webm',
        '.mp4': 'video/mp4',
        '.webp': 'image/webp',
        '.svg': 'image/svg+xml',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
    })

    class QuietServer(socketserver.TCPServer):
        allow_reuse_address = True

    with QuietServer(("", port), Handler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n[✔] سرور متوقف شد.")
            sys.exit(0)

if __name__ == "__main__":
    main()
