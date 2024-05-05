const { isValidObjectId } = require("mongoose")
const asyncHandler = require("../middleware/asyncHandler")
const Review = require("../db/models/review")

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
	const { movieId, userId, comment, rating } = req.body

	if (!movieId || !userId || !comment || !rating) {
		res.status(400)
		throw new Error("Please provide movieId/userId/comment/rating")
	}

	if (!isValidObjectId(movieId) || !isValidObjectId(userId)) {
		res.status(400)
		throw new Error("Invalid movieId or userId")
	}

	const review = await new Review({
		movieId,
		userId,
		comment,
		rating,
	}).save()

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
