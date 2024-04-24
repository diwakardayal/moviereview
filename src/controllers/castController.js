/* eslint-disable camelcase */
const asyncHandler = require("../middleware/asyncHandler")
const Actor = require("../db/models/actor")
const Director = require("../db/models/director")
const Writer = require("../db/models/writer")
const cloudinary = require("../db/cloud")

// @desc Create cast
// @route POST /api/cast/
// @access Private
const createCast = asyncHandler(async (req, res) => {
	const { castType, name, gender, about } = req.body
	const { file } = req

	try {
		if (!castType || !name || !gender || !about) {
			res.status(500)
			throw Error("Please provide all the inputs")
		}

		let cast
		switch (castType) {
			case "director":
				cast = new Director({ name, gender, about })
				break
			case "actor":
				cast = new Actor({ name, gender, about })
				break
			case "writer":
				cast = new Writer({ name, gender, about })
				break
			default:
				throw new Error("Invalid cast type")
		}

		if (file) {
			const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
				gravity: "face",
				height: 500,
				width: 500,
				crop: "thumb",
			})
			cast.avatar = { url: secure_url, public_id }
		}

		await cast.save()
		res.status(201).json({ cast })
	} catch (e) {
		console.log(e)
		res.status(500)
		throw Error("Something went wrong")
	}
})

// @desc Get casts
// @route GET /api/cast/:castType
// @access Public
const getCastsByType = asyncHandler(async (req, res) => {
	try {
		const { castType, castId } = req.params
		let cast

		switch (castType) {
			case "director":
				cast = await Director.findOne(castId)
				break
			case "actor":
				cast = await Actor.findOne(castId)
				break
			case "writer":
				cast = await Writer.findOne(castId)
				break
			default:
				throw new Error("Invalid castType")
		}

		if (!cast || cast.length === 0) {
			res.status(404)
			throw Error(`No ${req.params} found`)
		}

		res.status(200).json({ cast })
	} catch (e) {
		console.log(e)
		res.status(500)
		throw Error("Internal Server Error")
	}
})

// @desc Get cast by cast type & cast id
// @route GET /api/cast/castById/:castType/:castId
// @access Public
const getCastById = asyncHandler(async (req, res) => {
	const { castId, castType } = req.params

	try {
		let cast
		switch (castType) {
			case "director":
				cast = await Director.findById(castId)
				break
			case "actor":
				cast = await Actor.findById(castId)
				break
			case "writer":
				cast = await Writer.findById(castId)
				break
			default:
				throw new Error("Invalid castType")
		}

		res.status(200).json({ cast })
	} catch (e) {
		console.log(e)
		res.status(500)
		throw Error("Internal Server Error")
	}
})

// @desc Update cast by cast id
// @route UPDATE /api/cast/:castType/:castId
// @access Private
const updateCastById = asyncHandler(async (req, res) => {
	const { castId, castType } = req.params
	const { name, gender, about } = req.body
	const { file } = req

	try {
		let cast
		switch (castType) {
			case "director":
				cast = await Director.deleteOne(castId)
				break
			case "actor":
				cast = await Actor.deleteOne(castId)
				break
			case "writer":
				cast = await Writer.deleteOne(castId)
				break
			default:
				throw new Error("Invalid castType")
		}

		if (name) cast.name = name
		if (gender) cast.gender = gender
		if (about) cast.about = about

		if (file) {
			const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, {
				gravity: "face",
				height: 500,
				width: 500,
				crop: "thumb",
			})
			cast.avatar = { url: secure_url, public_id }
		}

		await cast.save()

		res.status(200).json({ cast })
	} catch (e) {
		console.log(e)
		res.status(500)
		throw Error("Internal Server Error")
	}
})

// @desc Delete cast by cast id
// @route DELETE /api/cast/:castType/:castId
// @access Private
const deleteCastById = asyncHandler(async (req, res) => {
	const { castId, castType } = req.params

	try {
		let cast
		switch (castType) {
			case "director":
				cast = await Director.findByIdAndDelete(castId)
				break
			case "actor":
				cast = await Actor.findByIdAndDelete(castId)
				break
			case "writer":
				cast = await Writer.findByIdAndDelete(castId)
				break
			default:
				throw new Error("Invalid castType")
		}

		if (!cast) {
			res.status(500)
			throw Error("Cast member not found")
		}

		res.status(200).json({ message: "Cast member deleted successfully" })
	} catch (e) {
		console.log(e)
		res.status(500)
		throw Error("Internal Server Error")
	}
})

// @desc Get cast by cast Name
// @route GET /api/cast/castName/:castType/:castName
// @access Public
const getCastByName = asyncHandler(async (req, res) => {
	const { castName, castType } = req.params

	try {
		let result
		switch (castType) {
			case "director":
				result = await Director.find({
					name: { $regex: castName, $options: "i" },
				})
				break
			case "actor":
				result = await Actor.find({
					name: { $regex: castName, $options: "i" },
				})
				break
			case "writer":
				result = await Writer.find({
					name: { $regex: castName, $options: "i" },
				})
				break
			default:
				throw new Error("Invalid castType")
		}

		const sanitizedResult = result.map(({ _id, name, about, gender, avatar }) => ({
			_id,
			name,
			about,
			gender,
			avatar: avatar?.url,
		}))

		res.status(200).json({ results: sanitizedResult })
	} catch (e) {
		console.log(e)
		res.status(500)
		throw Error("Internal Server Error")
	}
})

module.exports = {
	createCast,
	getCastsByType,
	getCastById,
	updateCastById,
	deleteCastById,
	getCastByName,
}
