const { isValidObjectId } = require("mongoose")
const asyncHandler = require("../middleware/asyncHandler")
const Review = require("../db/models/review")
const Movie = require("../db/models/movie")

// @desc Get all reviews
// @route GET /api/review
// @access Public
const getReviews = asyncHandler(async (req, res) => {
	const reviews = await Review.find()

	if (!reviews || reviews.length === 0) {
		res.status(404)
		throw new Error("Review not found")
	}

	res.status(200).json({ reviews })
})

// @desc Get review
// @route GET /api/review/:movieId
// @access Public
const getReviewByMovieId = asyncHandler(async (req, res) => {
	const { movieId } = req.params

	if (!isValidObjectId(movieId)) {
		res.status(400)
		throw new Error("Invalid movieId")
	}

	const review = await Review.findById(movieId)

	if (!review) {
		res.status(404)
		throw new Error("Review not found")
	}

	res.status(200).json({ review })
})

// @desc Post create review
// @route POST /api/movie
// @access Private/Admin
const createReview = asyncHandler(async (req, res) => {
	const { movieId, comment, rating } = req.body
	const { _id: userId } = req.user

	if (!movieId || !comment || !rating) {
		res.status(400)
		throw new Error("Please provide movieId/comment/rating")
	}

	if (!isValidObjectId(movieId)) {
		res.status(400)
		throw new Error("Invalid movieId")
	}

	const isAlreadyReviewed = await Review.findOne({
		userId,
		movieId,
	})

	if (isAlreadyReviewed) {
		res.status(400)
		throw new Error("Movie is already been reviewed")
	}

	const movie = await Movie.findOne({ _id: movieId, status: "public" })

	const review = await new Review({
		movieId,
		userId,
		comment,
		rating,
	}).save()

	// eslint-disable-next-line no-underscore-dangle
	movie.reviews.push(review._id)

	await movie.save()

	res.status(201).json({ review })
})

// @desc Update review by id
// @route UPDATE /api/review/:reviewId
// @access Private/Admin
const updateReview = asyncHandler(async (req, res) => {
	const { reviewId } = req.params
	const { rating, comment } = req.body

	if (!rating || !comment) {
		res.status(400)
		throw new Error("Please provide rating or comment")
	}

	const review = await Review.findByIdAndUpdate(
		reviewId,
		{ rating, comment },
		{ new: true, runValidators: true },
	)

	if (!review) {
		res.status(404)
		throw new Error("Review not found")
	}

	res.status(200).json({ review })
})

// @desc Delete review
// @route DELETE /api/review/:reviewId
// @access Private/Admin
const deleteReview = asyncHandler(async (req, res) => {
	const { reviewId } = req.params

	const review = await Review.findByIdAndDelete(reviewId)

	if (!review) {
		res.status(404)
		throw new Error("Review not found")
	}

	res.status(200).json({ message: "Review deleted successfully" })
})

module.exports = { getReviews, getReviewByMovieId, createReview, updateReview, deleteReview }
