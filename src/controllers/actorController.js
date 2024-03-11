/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable camelcase */
const { isValidObjectId } = require("mongoose")
const cloudinary = require("../db/cloud")
const asyncHandler = require("../middleware/asyncHandler")
const Actor = require("../db/models/actor")

// @desc get actor
// @route GET /api/actor/:actorName
// @access Public
const getActorByName = asyncHandler(async (req, res) => {
	const { actorName } = req.params

	const actor = await Actor.findOne({ name: actorName })

	if (!actor) {
		res.status(404)
		throw new Error("Actor not found")
	}

	res.status(200).json({ actor })
})

// @desc Create actor
// @route POST /api/actor
// @access Private
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

// @desc Update actor
// @route Put /api/actor/
// @access Private
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

// @desc Delete actor
// @route DELETE /api/actor/
// @access Private
const deleteActor = asyncHandler(async (req, res) => {
	const { actorId } = req.body

	if (!isValidObjectId(actorId)) {
		res.status(404)
		throw new Error(`Invalid ObjectId: ${actorId}`)
	}

	try {
		await Actor.findByIdAndDelete(actorId)
		res.status(200).json({ message: "Record removed successfully!" })
	} catch (e) {
		res.status(404)
		throw Error("Actor not found")
	}
})

// @desc get all actors
// @route GET /api/actors/
// @access Public
const getActors = asyncHandler(async (req, res) => {
	const page = Number(req.query.page) || 1 // Current page, default to 1
	const pageSize = Number(req.query.pageSize) || 10

	const skip = (page - 1) * pageSize

	const actors = await Actor.find().sort({ createdAt: -1 }).skip(skip).limit(pageSize)

	if (!actors || actors.length === 0) {
		res.status(404)
		throw Error("No actors found")
	}
	res.status(200).json({ actors })
})

// @desc Get actor by Id
// @route GET /api/actor/:actorId
// @access Public
const getActorById = asyncHandler(async (req, res) => {
	const { actorId } = req.params

	if (!isValidObjectId(actorId)) {
		res.status(404)
		throw new Error(`Invalid ObjectId: ${actorId}`)
	}

	const actor = await Actor.findById(actorId)

	if (!actor) {
		res.status(404)
		throw new Error("Actor does not exist")
	}

	res.status(200).json({ actor })
})

module.exports = { getActorByName, createActor, updateActor, deleteActor, getActors, getActorById }
