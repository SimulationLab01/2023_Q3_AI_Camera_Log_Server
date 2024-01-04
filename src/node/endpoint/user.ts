import { UserFaceFeaturePayload, UserItemPayload } from "../../shared/payload";
import { database } from "../database";
import { ExpressEndpoint } from "./type";

export const user: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/user",
		async function (req, res, handle_err) {
			try {
				const data = await database.select_items('user')
				res.send(JSON.stringify(data))
			} catch (error) {
				handle_err(error)
			}
		}]
}

export const user_with_photo_item: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/user/with_photo/item",
		async function (req, res, handle_err) {
			try {
				const user = req.body as UserItemPayload
				const data = await database.select_items(
					'user_with_photo',
					[['user_id', '=', user]], 1
				)
				if (data.length <= 0) {
					res.status(404);
					res.send(JSON.stringify({ message: "not found" }))
				} else {
					res.send(JSON.stringify(
						Object.assign({}, data[0], {
							photo: data[0].photo?.toString('base64')
						})))
				}
			} catch (error) {
				handle_err(error)
			}
		}]
}

export const user_with_department: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/user/with_department",
		async function (req, res, handle_err) {
			try {
				const data = await database.select_items('user_with_department')
				res.send(JSON.stringify(data))
			} catch (error) {
				handle_err(error)
			}
		}]
}

export const user_face_feature: ExpressEndpoint = {
	method: 'post',
	args: [
		"/api/user/face_feature",
		async function (req, res, handle_err) {
			try {
				const user = req.body as UserFaceFeaturePayload
				const data = await database.select_items(
					'user_face_feature_128',
					[['user_id', '=', user]]
					)
				res.send(JSON.stringify(data.map(x => Object.assign({}, x, {
					feature: x.feature?.toString('base64')
				}))))
			} catch (error) {
				handle_err(error)
			}
		}]
}