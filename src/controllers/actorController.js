/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const cloudinary = require("cloudinary").v2
const asyncHandler = require("../middleware/asyncHandler")
const Actor = require("../db/models/actor")

cloudinary.config({
	cloud_name: process.env.CLOUD_API_NAME,
	api_key: process.env.CLOUD_API_KEY,
	api_secret: process.env.CLOUD_API_SECRET,
})

const createActor = asyncHandler(async (req, res) => {
	try {
		const { name, about, gender, email } = req.body
		const { file } = req

		await new Actor({ name, about, gender, email }).validate()

		const newActor = new Actor({
			name,
			about,
			gender,
			email,
		})

		if (file) {
			const { secure_url, public_id } = await cloudinary.uploader.upload(file.path)
			newActor.avatar = { url: secure_url, public_id }
		}

		await newActor.save()
		res.status(201).json({ newActor, avatar: newActor.avatar?.url })
	} catch (e) {
		console.log(e)
		res.status(500)
		throw Error("Something went wrong")
	}
})

module.exports = { createActor }
