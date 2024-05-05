/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
const asyncHandler = require("../middleware/asyncHandler")
const Director = require("../db/models/director")

const getDirectors = asyncHandler(async (req, res) => {
	const directors = await Director.find()

	if (!directors || directors.length === 0) {
		res.status(404)
		throw Error("Director not found")
	}

	res.status(200).json({ directors })
})

const getDirectorById = asyncHandler(async (req, res) => {
	const { id } = req.params

	try {
		let results = []

		const director = await Director.findById(id)
		results.push(director)

		results = results.map(obj => {
			const { _id, name, about, gender, avatar } = obj._doc
			return { _id, name, about, gender, avatar }
		})

		res.status(200).json({ results })
	} catch (e) {
		console.log(e)
		res.status(400)
		throw Error("Internal Server Error")
	}
})

module.exports = { getDirectors, getDirectorById }
