const express = require("express")
const { createActor, updateActor } = require("../controllers/actorController")
const { uploadImage } = require("../middleware/multer")

const Router = express.Router()

Router.route("/")
	.post(uploadImage.single("avatar"), createActor)
	.put(uploadImage.single("avatar"), updateActor)

module.exports = Router
