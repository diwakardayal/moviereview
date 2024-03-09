const express = require("express")
const {
	getActorByName,
	createActor,
	updateActor,
	deleteActor,
	getActors,
	getActorById,
} = require("../controllers/actorController")
const { uploadImage } = require("../middleware/multer")
const { requireAuth, admin } = require("../middleware/auth")

const Router = express.Router()

Router.route("/")
	.get(getActors)
	.post(requireAuth, admin, uploadImage.single("avatar"), createActor)
	.put(requireAuth, admin, uploadImage.single("avatar"), updateActor)
	.delete(requireAuth, admin, deleteActor)
Router.route("/:actorName").get(getActorByName)
Router.route("/:actorId").get(getActorById)

module.exports = Router
