const express = require("express")
const {
	getActorByName,
	createActor,
	updateActor,
	deleteActor,
	getActors,
	getActorById,
	getActorsByIds,
} = require("../controllers/actorController")
const { uploadImage } = require("../middleware/multer")
const { requireAuth, admin } = require("../middleware/auth")

const router = express.Router()

router
	.route("/")
	.get(getActors)
	.post(requireAuth, admin, uploadImage.single("avatar"), createActor)
	.put(requireAuth, admin, uploadImage.single("avatar"), updateActor)
	.delete(requireAuth, admin, deleteActor)
router.route("/actorName/:actorName").get(getActorByName)
router.route("/actorId/:actorId").get(getActorById)
router.route("/:ids").get(getActorsByIds)

module.exports = router
