/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-underscore-dangle */
const asyncHandler = require("../middleware/asyncHandler")
const Writer = require("../db/models/writer")

const getWriters = asyncHandler(async (req, res) => {
	const writers = await Writer.find()

	if (!writers || writers.length === 0) {
		res.status(404)
		throw Error("Writer not found")
	}

	res.status(200).json({ writers })
})

const getWriterByIds = asyncHandler(async (req, res) => {
	const { ids } = req.params

	try {
		let results = []
		for (let id of ids.split(",")) {
			const writer = await Writer.findById(id)
			results.push(writer)
		}

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

module.exports = { getWriters, getWriterByIds }
