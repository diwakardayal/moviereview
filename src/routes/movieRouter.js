const express = require("express")
const { requireAuth, admin } = require("../middleware/auth")
const {
	uploadTrailer,
	createMovie,
	updateMovieWithoutPoster,
	removeMovie,
	updateMovieWithPoster,
} = require("../controllers/movieController")
const { uploadVideo, uploadImage } = require("../middleware/multer")
const { parseData } = require("../utils/helper")
const { validate, validateMovie } = require("../middleware/validator")

const router = express.Router()

router.route("/trailer").post(requireAuth, admin, uploadVideo.single("video"), uploadTrailer)
router
	.route("/create")
	.post(
		requireAuth,
		admin,
		uploadImage.single("poster"),
		parseData,
		validateMovie,
		validate,
		createMovie,
	)

router
	.route("/update/:movieId")
	.patch(requireAuth, admin, parseData, validateMovie, validate, updateMovieWithoutPoster)

router
	.route("/update-with-poster/:movieId")
	.patch(
		requireAuth,
		admin,
		uploadImage.single("poster"),
		parseData,
		validateMovie[validateMovie.length - 1],
		validate,
		updateMovieWithPoster,
	)

router.delete("/:movieId", requireAuth, admin, removeMovie)

module.exports = router
