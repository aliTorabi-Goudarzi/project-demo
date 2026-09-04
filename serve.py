"""Local preview server for the Naji Sazan Amin prototype.

Serves naji-sazan-amin/ on 127.0.0.1 with:
  - full MIME map (the WorkBuddy preview server 404s .webp)
  - Cache-Control: no-store, so a stale view can never mask a fix

Usage: python serve.py [port]
"""
import functools
import os
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "naji-sazan-amin")


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".webp": "image/webp",
        ".woff2": "font/woff2",
        ".woff": "font/woff",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".png": "image/png",
        ".svg": "image/svg+xml",
        ".js": "application/javascript",
        ".css": "text/css",
        ".json": "application/json",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        code = args[1] if len(args) > 1 else "?"
        if str(code).startswith("4") or str(code).startswith("5"):
            sys.stderr.write("  %s %s\n" % (code, args[0]))
        sys.stderr.flush()


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8777
    httpd = ThreadingHTTPServer(
        ("127.0.0.1", port),
        functools.partial(Handler, directory=ROOT),
    )
    sys.stderr.write(f"serving {ROOT}\n  -> http://127.0.0.1:{port}/\n")
    sys.stderr.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == "__main__":
    main()
