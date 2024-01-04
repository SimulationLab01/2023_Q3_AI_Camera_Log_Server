
import base64
import http.server
import json
import socketserver
import traceback
import cgi
import cv2
import numpy as np


PORT = 8082

class HTTPRequestHandler(http.server.BaseHTTPRequestHandler):
	def __init__(self, request, client_address, server) -> None:
		super().__init__(request, client_address, server)
	
	def setup(self) -> None:
		http.server.BaseHTTPRequestHandler.setup(self)
		self.request.settimeout(2)

	def do_GET(self):
		try:
			self.log_request()
			if self.path == "/favicon.ico":
				self.send_response(404, 'Not Found')
				self.end_headers()
				self.wfile.write(bytes("", 'utf8'))
			elif self.path == "/robots.txt":
				self.send_response(200, 'OKq')
				self.end_headers()
				self.wfile.write(bytes("User-agent: *\nDisallow:", 'utf8'))
			else:
				self.send_response(200, 'OK')
				self.send_header('Content-type', 'html')
				self.end_headers()
				self.wfile.write(bytes(
"""
<html>
<head><title>api test</title></head>
<body>
	<form action="/api/detect" method="post" enctype="multipart/form-data">
		<input type="file" name="img" accept="image/*"></input>
		<input type="submit"></input>
	</form>
</body>
</html>
""", 'UTF-8'))
		except Exception as err:
			traceback.print_exception(err)
			self.send_response(500, 'Internal Server Error')
			self.send_header('Content-type', 'html')
			self.end_headers()
			self.wfile.write(bytes("", 'UTF-8'))
		pass
	
	def do_POST(self):
		try:
			self.log_request()
			if self.path.startswith("/api/detect"):
				self.do_POST_detect()
				return
			else:
				self.send_response(404, 'Not Found')
				self.send_header('Content-type', 'html')
				self.end_headers()
				self.wfile.write(bytes("", 'UTF-8'))
		except Exception as err:
			traceback.print_exception(err)
			self.send_response(500, 'Internal Server Error')
			self.send_header('Content-type', 'html')
			self.end_headers()
			self.wfile.write(bytes("", 'UTF-8'))
		pass

	def do_POST_detect(self):
		try:
			ctype, pdict = cgi.parse_header(self.headers['Content-Type'])
			if ctype == 'multipart/form-data':
				pdict['boundary'] = bytes(pdict['boundary'], "utf-8")
				pdict['CONTENT-LENGTH'] = int(self.headers['Content-Length'])
				form = cgi.FieldStorage( fp=self.rfile, headers=self.headers, environ={'REQUEST_METHOD':'POST', 'CONTENT_TYPE':self.headers['Content-Type'], })
				form_img = form["img"]
				img_bytes = form_img.file.read()
				aligned_faces = self.detect(img_bytes)
				self.send_response(200, 'OK')
				self.send_header('Content-type', 'application/json')
				self.send_header('Access-Control-Allow-Origin', '*')
				self.end_headers()
				self.wfile.write(bytes(json.dumps(aligned_faces), 'utf-8'))
			elif ctype == 'application/json':
				clen = int(self.headers['Content-Length'])
				body = json.loads(str(self.rfile.read(clen), 'utf8'))
				img_bytes = base64.b64decode(body)
				aligned_faces = self.detect(img_bytes)
				self.send_response(200, 'OK')
				self.send_header('Content-type', 'application/json')
				self.send_header('Access-Control-Allow-Origin', '*')
				self.end_headers()
				self.wfile.write(bytes(json.dumps(aligned_faces), 'utf-8'))
			else:
				self.send_response(404, 'Not Found')
				self.send_header('Content-type', 'application/html')
				self.send_header('Access-Control-Allow-Origin', '*')
				self.end_headers()
				self.wfile.write(bytes("{}", 'utf-8'))
		except Exception as err:
			traceback.print_exception(err)
			self.send_response(500, 'Internal Server Error')
			self.send_header('Content-type', 'html')
			self.send_header('Access-Control-Allow-Origin', '*')
			self.end_headers()
			self.wfile.write(bytes("", 'UTF-8'))
		pass
		pass
		

	def do_OPTIONS(self):
		self.send_response(200, 'OK')
		self.send_header('Access-Control-Allow-Origin', '*')
		self.send_header('Access-Control-Allow-Methods', 'POST')
		self.send_header('Access-Control-Allow-Headers', 'content-type')
		self.end_headers()

	def detect(self, img_bytes: bytes):
		img_np = np.frombuffer(img_bytes, dtype=np.uint8)
		img_mat = cv2.imdecode(img_np, cv2.IMREAD_COLOR)
		img_size = tuple(img_mat.shape[1::-1])
		det.setInputSize(img_size)
		_, faces = det.detect(img_mat)
		aligned_faces = []
		if faces is not None:
			for face in faces:
				aligned_face_mat = reg.alignCrop(img_mat, face)
				face_feature_mat = reg.feature(aligned_face_mat)
				_, aligned_face_np = cv2.imencode(".jpg", aligned_face_mat)
				aligned_face_bytes = aligned_face_np.tobytes()
				face_feature_bytes = face_feature_mat.tobytes()
				aligned_face_b64 = str(base64.b64encode(aligned_face_bytes), 'utf8')
				face_feature_b64 = str(base64.b64encode(face_feature_bytes), 'utf8')
				aligned_faces.append({
					"aligned_face": aligned_face_b64,
					"feature": face_feature_b64
				})
		return aligned_faces

def main():
	global det, reg
	det = cv2.FaceDetectorYN.create("res/face_detection_yunet_2023mar.onnx", "", (640,640))
	reg = cv2.FaceRecognizerSF.create("res/face_recognition_sface_2021dec.onnx", "")
	with socketserver.TCPServer(("localhost", PORT), HTTPRequestHandler, False) as httpd:
		httpd.allow_reuse_address = True
		try:
			httpd.server_bind()
			httpd.server_activate()
			print("serving at port", PORT)
			httpd.serve_forever()
		except KeyboardInterrupt as kb_int:
			print()
			print("Got Keyboard Interrupt.... Server Close")
			traceback.print_exception(kb_int)
			pass
		except Exception as err:
			traceback.print_exception(err)
		finally:
			httpd.server_close()

if __name__ == "__main__":
	main()
