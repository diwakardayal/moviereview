/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
const { isValidObjectId } = require("mongoose")
const cloudinary = require("../db/cloud")
const asyncHandler = require("../middleware/asyncHandler")
const Movie = require("../db/models/movie")

// @desc Post trailer
// @route POST /api/movie/trailer
// @access Private
const uploadTrailer = asyncHandler(async (req, res) => {
	const { file } = req
	if (!file) {
		res.status(400)
		throw Error("Video file is missing")
	}

	const videoRes = await cloudinary.uploader.upload(file.path, {
		resource_type: "video",
	})

	if (!videoRes) {
		res.status(500)
		throw Error("Fail to upload the file")
	}

	const { secure_url: url, public_id } = videoRes

	res.status(201).json({ url, public_id })
})

// @desc Post movie
// @route POST /api/movie/create
// @access Private
const createMovie = asyncHandler(async (req, res) => {
	const { file, body } = req

	const {
		title,
		storyLine,
		director,
		releaseDate,
		status,
		type,
		genres,
		tags,
		casts,
		writers,
		trailer,
		language,
	} = body

	let jsonParsedCasts = JSON.parse(JSON.stringify(casts))

	const newMovie = new Movie({
		title,
		storyLine,
		releaseDate,
		status,
		type,
		genres,
		tags,
		jsonParsedCasts,
		trailer,
		language,
	})

	if (director) {
		if (!isValidObjectId(director)) {
			res.status(400)
			throw Error("Invalid director id!")
		}
		newMovie.director = director
	}

	if (writers) {
		for (const id of writers) {
			if (!isValidObjectId(id)) {
				res.status(400)
				throw Error("Invalid writer id!")
			}
		}

		newMovie.writers = writers
	}

	// uploading poster
	if (file) {
		const {
			secure_url: url,
			public_id,
			responsive_breakpoints,
		} = await cloudinary.uploader.upload(file.path, {
			transformation: {
				width: 1280,
				height: 720,
			},
			responsive_breakpoints: {
				create_derived: true,
				max_width: 640,
				max_images: 3,
			},
		})

		const finalPoster = { url, public_id, responsive: [] }

		const { breakpoints } = responsive_breakpoints[0]
		if (breakpoints.length) {
			for (let imgObj of breakpoints) {
				const { secure_url } = imgObj
				finalPoster.responsive.push(secure_url)
			}
		}
		newMovie.poster = finalPoster
	}

	await newMovie.save()

	res.status(201).json({
		movie: {
			id: newMovie._id,
			title,
		},
	})
})

module.exports = { uploadTrailer, createMovie }
