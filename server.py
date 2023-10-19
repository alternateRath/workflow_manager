from http.server import SimpleHTTPRequestHandler
import socketserver

PORT = 8000

class MyHandler(SimpleHTTPRequestHandler):
    pass

with socketserver.TCPServer(("", PORT), MyHandler) as httpd:
    print(f"Serving at port {PORT}")
    httpd.serve_forever()
