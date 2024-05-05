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
	try {
		const { file } = req
		console.log("file: ", file)
		if (!file) {
			res.status(400)
			throw Error("Video file is missing")
		}

		const videoRes = await cloudinary.uploader.upload(file.path, {
			resource_type: "video",
		})

		console.log(videoRes)

		if (!videoRes) {
			res.status(500)
			throw Error("Fail to upload the file")
		}

		const { secure_url: url, public_id } = videoRes

		res.status(201).json({ url, public_id })
		// res.json({ message: "HI" })

		// res.status(201).json({ message: "resources has been created" })
	} catch (error) {
		console.log(error)
	}
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
		writers,
		trailer,
		language,
		actors,
	} = body

	const newMovie = new Movie({
		title,
		storyLine,
		releaseDate,
		status,
		type,
		genres,
		tags,
		actors,
		trailer,
		language,
	})

	if (director) {
		newMovie.director = director
	}

	if (writers) {
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

const updateMovieWithoutPoster = asyncHandler(async (req, res) => {
	const { movieId } = req.params

	if (!isValidObjectId(movieId)) {
		res.status(400)
		throw Error("Invalid Movie Id!")
	}

	const movie = await Movie.findById(movieId)

	if (!movie) {
		res.status(400)
		throw Error("Movie doesnt exist")
	}

	const {
		title,
		storyLine,
		director,
		releaseDate,
		status,
		type,
		genres,
		tags,
		actors,
		writers,
		trailer,
		language,
	} = req.body

	movie.title = title
	movie.storyLine = storyLine
	movie.tags = tags
	movie.releaseDate = releaseDate
	movie.status = status
	movie.type = type
	movie.actors = actors
	movie.genres = genres
	movie.trailer = trailer
	movie.language = language

	if (director) {
		if (!isValidObjectId(director)) {
			res.status(400)
			throw Error("Invalid director id!")
		}
		movie.director = director
	}

	if (writers) {
		for (const id of writers) {
			if (!isValidObjectId(id)) {
				res.status(400)
				throw Error("Invalid writer id!")
			}
		}

		movie.writers = writers
	}

	await movie.save()

	res.status(200).json({ message: "Movie is updated", movie })
})

const updateMovieWithPoster = asyncHandler(async (req, res) => {
	const { movieId } = req.params

	if (!isValidObjectId(movieId)) {
		res.status(400)
		throw Error("Invalid Movie Id!")
	}

	const movie = await Movie.findById(movieId)

	if (!movie) {
		res.status(400)
		throw Error("Movie doesnt exist")
	}

	const {
		title,
		storyLine,
		director,
		releaseDate,
		status,
		type,
		genres,
		tags,
		actors,
		writers,
		trailer,
		language,
	} = req.body

	movie.title = title
	movie.storyLine = storyLine
	movie.tags = tags
	movie.releaseDate = releaseDate
	movie.status = status
	movie.type = type
	movie.actors = JSON.parse(JSON.stringify(actors))
	movie.genres = genres
	movie.trailer = trailer
	movie.language = language

	if (director) {
		if (!isValidObjectId(director)) {
			res.status(400)
			throw Error("Invalid director id!")
		}
		movie.director = director
	}

	if (writers) {
		for (const id of writers) {
			if (!isValidObjectId(id)) {
				res.status(400)
				throw Error("Invalid writer id!")
			}
		}

		movie.writers = writers
	}

	// eslint-disable-next-line no-unsafe-optional-chaining
	const { public_id } = movie.poster?.public_id

	if (public_id) {
		const { result } = await cloudinary.uploader.destroy(public_id)

		if (result !== "ok") {
			res.status(400)
			throw Error("Could not updated poster at the moment")
		}
	}

	// update poster
	// removing poster from cloud if there is any.
	const posterID = movie.poster?.public_id
	if (posterID) {
		const { result } = await cloudinary.uploader.destroy(posterID)
		if (result !== "ok") {
			res.status(400)
			throw Error("Could not update poster at the moment!")
		}

		// uploading poster
		const {
			secure_url: url,
			// eslint-disable-next-line no-shadow
			public_id,
			responsive_breakpoints,
		} = await cloudinary.uploader.upload(req.file.path, {
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

		movie.poster = finalPoster
	}

	await movie.save()

	res.json({ message: "Movie is updated", movie })
})
const removeMovie = asyncHandler(async (req, res) => {
	const { movieId } = req.params

	console.log(movieId)

	if (!isValidObjectId(movieId)) {
		res.status(400)
		throw Error("Invalid Movie ID!")
	}

	const movie = await Movie.findById(movieId)

	console.log(movie)
	if (!movie) {
		res.status(404)
		throw Error("Movie Not Found!")
	}

	// check if there is poster or not.
	// if yes then we need to remove that.

	const posterId = movie.poster?.public_id
	if (posterId) {
		const { result } = await cloudinary.uploader.destroy(posterId)
		if (result !== "ok") {
			/* temp: disable poster remove feat.
				res.status(400)
				throw new Error("Could not remove poster from cloud!")
			*/
		}
	}

	// removing trailer
	const trailerId = movie.trailer?.public_id
	if (!trailerId) {
		/* temp: disable trailer remove feat.
			res.status(400)
			throw Error("Could not find trailer in the cloud!")
		*/
	}
	const { result } = await cloudinary.uploader.destroy(trailerId, {
		resource_type: "video",
	})
	if (result !== "ok") {
		/** temp: disable trailer remove feat.
		res.status(400)
		throw Error("Could not remove trailer from cloud!")
		*/
	}

	await Movie.findByIdAndDelete(movieId)

	res.json({ message: "Movie removed successfully." })
})

const getMovies = asyncHandler(async (req, res) => {
	const movies = await Movie.find()

	if (!movies || movies.length === 0) {
		res.status(500)
		throw Error("No Movie found")
	}

	res.status(200).json({ movies })
})

// @desc Get movie by id
// @route GET /api/movie/:movieId
// @access Public
const getMovieById = asyncHandler(async (req, res) => {
	const { movieId } = req.params

	if (!movieId) {
		res.status(400)
		throw Error("Please Provide movieId")
	}

	const movie = await Movie.findById(movieId)

	if (!movie) {
		res.status(404)
		throw Error("Movie not found")
	}

	delete movie._v
	delete movie.updatedAt
	delete movie.createdAt
	delete movie.reviews
	delete movie.poster.responsive
	res.status(200).json(movie)
})

module.exports = {
	uploadTrailer,
	createMovie,
	updateMovieWithPoster,
	updateMovieWithoutPoster,
	removeMovie,
	getMovies,
	getMovieById,
}
