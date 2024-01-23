import pymysql as sql
import cv2
import os

face_names = []
with open("faceData/facename_facedata_1108.txt", 'r') as f:
	while name := f.readline().strip():
		face_names.append(name.upper())

ret, feature_list = cv2.imreadmulti("faceData/facefeature_facedata_1108.tiff", flags=cv2.IMREAD_UNCHANGED)

face_name_photo = []
for entry in os.scandir("faceData/user_photo"):
	name = os.path.splitext(os.path.split(entry.path)[1])[0]
	with open(entry.path, 'rb') as f:
		face_name_photo.append((name.upper(), f.read()))

face_name_feature = list(zip(face_names, feature_list))

# print([ (n, f.shape) for n, f in face_name_feature])
conn = sql.Connection(user="root", database="test")
conn.connect()
with conn.cursor() as cursor:
	cursor.execute("select name, user_id from user")
	name_id_dict = dict(cursor.fetchall())
	command = "insert into user_face_feature_128 (user_id, feature) values (%s, %s)"
	for name, feature in face_name_feature:
		if name in name_id_dict:
			print(name_id_dict[name], feature.shape, len(feature.tobytes()))
			cursor.execute(command, [
				name_id_dict[name], feature.tobytes(), 
			])
			conn.commit()
		else:
			print(name)
	# command = "insert into user_photo (user_id, photo) values (%s, %s)"
	# for name, photo in face_name_photo:
	# 	if name in name_id_dict:
	# 		print(name)
	# 		cursor.execute(command, [
	# 			name_id_dict[name], photo, 
	# 		])
	# 		conn.commit()
	# 	else:
	# 		print(name, "Not Found")

conn.close()

