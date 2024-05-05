const express = require("express")
const { requireAuth, admin } = require("../middleware/auth")
const {
	getReviews,
	getReviewByMovieId,
	createReview,
	updateReview,
	deleteReview,
} = require("../controllers/reviewController")

const router = express.Router()

router.route("/").get(getReviews).post(requireAuth, admin, createReview)

router
	.route("/:reviewId")
	.patch(requireAuth, admin, updateReview)
	.delete(requireAuth, admin, deleteReview)
router.route("/getReviewById/:movieId").get(getReviewByMovieId)

module.exports = router
