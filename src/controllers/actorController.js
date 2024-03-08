/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const cloudinary = require("cloudinary").v2
const { isValidObjectId } = require("mongoose")
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
			const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
				gravity: "face",
				height: 500,
				width: 500,
				crop: "thumb",
			})
			newActor.avatar = { url: secure_url, public_id }
		}

		await newActor.save()
		res.status(201).json({ newActor })
	} catch (e) {
		console.log(e)
		res.status(500)
		throw Error("Something went wrong")
	}
})

const updateActor = asyncHandler(async (req, res) => {
	const { name, about, gender, actorId } = req.body

	const { file } = req

	if (!isValidObjectId(actorId)) {
		res.status(404)
		throw new Error(`Invalid ObjectId: ${actorId}`)
	}

	const actor = await Actor.findById(actorId)

	if (!actor) {
		res.status(404)
		throw new Error("Actor does not exist")
	}

	const public_id = actor.actor?.avatar?.public_id

	if (public_id && file) {
		const { result } = await cloudinary.uploader.destroy(public_id)

		if (result !== "ok") {
			res.status(500)
			throw Error("Could not remove image from cloud!")
		}
	}

	if (file) {
		const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
			gravity: "face",
			height: 500,
			width: 500,
			crop: "thumb",
		})

		actor.avatar = { url: secure_url, public_id }
	}

	actor.name = name
	actor.about = about
	actor.gender = gender

	await actor.save()
	res.status(200).json(actor)
})

module.exports = { createActor, updateActor }
