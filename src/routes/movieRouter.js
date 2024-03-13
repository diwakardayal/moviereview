const express = require("express")
const { requireAuth, admin } = require("../middleware/auth")
const { uploadTrailer, createMovie } = require("../controllers/movieController")
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

module.exports = router
