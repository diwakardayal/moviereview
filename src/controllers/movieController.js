/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable camelcase */
const { isValidObjectId } = require("mongoose")
const cloudinary = require("../db/cloud")
const asyncHandler = require("../middleware/asyncHandler")
const Movie = require("../db/models/movie")
const Review = require("../db/models/review")
const {
	topRatedMoviesPipeline,
	getAverageRatings,
	relatedMovieAggregation,
	averageRatingPipeline,
} = require("../utils/helper")

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
// @route GET /api/movie/getMovieById/:movieId
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

	console.log("??")
	res.status(200).json(movie)
})

// @desc Get latest movies
// @route GET /api/movie/latest/:limit
// @access Public
const getLatestMovies = asyncHandler(async (req, res) => {
	const { limit = 5 } = req.params

	const movies = await Movie.find({ status: "public" })
		.sort("-createdAt")
		.limit(parseInt(limit, 10))

	if (!movies || movies.length === 0) {
		res.status(404)
		throw new Error("Movie not found")
	}

	const formattedMovies = movies.map(({ _id, title, storyLine, poster, trailer }) => ({
		id: _id,
		title,
		storyLine,
		poster: poster?.url,
		responsivePosters: poster.responsive,
		trailer: trailer.url,
	}))

	res.status(200).json({ movies: formattedMovies })
})

// @desc Get top rated movies, series etc
// @route GET /api/movie/top-rated/:limit
// @access Public
const getTopRatedMovies = asyncHandler(async (req, res) => {
	const { type = "Film" } = req.query

	const movies = await Movie.aggregate(topRatedMoviesPipeline(type))

	const mapMovies = async m => {
		const reviews = await getAverageRatings(m._id)

		return {
			id: m._id,
			title: m.title,
			poster: m.poster,
			responsivePosters: m.responsivePosters,
			reviews: { ...reviews },
		}
	}

	const topRatedMovies = await Promise.all(movies.map(mapMovies))

	res.json({ movies: topRatedMovies })
})

const getRelatedMovies = asyncHandler(async (req, res) => {
	const { movieId } = req.params

	if (!isValidObjectId(movieId)) {
		res.status(400)
		throw new Error("Invalid Movie Id")
	}

	const movie = await Movie.findById(movieId)

	const movies = await Movie.aggregate(relatedMovieAggregation(movie.tags, movie._id))

	const mapMovies = async m => {
		const reviews = await getAverageRatings(m._id)

		return {
			id: m._id,
			title: m.title,
			poster: m.poster,
			responsivePosters: m.responsivePosters,
			reviews: { ...reviews },
		}
	}
	const relatedMovies = await Promise.all(movies.map(mapMovies))

	res.json({ movies: relatedMovies })
})

const getSingleMovie = asyncHandler(async (req, res) => {
	const { movieId } = req.params

	if (!isValidObjectId(movieId)) {
		res.status(400)
		throw new Error("Movie id is not valid!")
	}

	const movie = await Movie.findById(movieId).populate("director writers actors.id")

	const [aggregatedResponse] = await Review.aggregate(averageRatingPipeline(movie._id))

	const reviews = {}

	if (aggregatedResponse) {
		const { ratingAvg, reviewCount } = aggregatedResponse
		reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1)
		reviews.reviewCount = reviewCount
	}
	console.log("review ", reviews)

	const {
		_id: id,
		title,
		storyLine,
		actors,
		writers,
		director,
		releaseDate,
		genres,
		tags,
		language,
		poster,
		trailer,
		type,
	} = movie

	res.status(200).json({
		movie: {
			id,
			title,
			storyLine,
			releaseDate,
			genres,
			tags,
			language,
			type,
			poster: poster?.url,
			trailer: trailer?.url,
			actors: actors.map(c => ({
				id: c._id,
				profile: {
					id: c.id._id,
					name: c.id.name,
					avatar: c.id?.avatar?.url,
				},
				leadActor: c.leadActor,
				roleAs: c.roleAs,
			})),
			writers: writers.map(w => ({
				id: w._id,
				name: w.name,
			})),
			director: {
				id: director._id,
				name: director.name,
			},
			reviews: { ...reviews },
		},
	})
})

module.exports = {
	uploadTrailer,
	createMovie,
	updateMovieWithPoster,
	updateMovieWithoutPoster,
	removeMovie,
	getMovies,
	getMovieById,
	getLatestMovies,
	getTopRatedMovies,
	getRelatedMovies,
	getSingleMovie,
}
