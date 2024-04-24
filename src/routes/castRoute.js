const express = require("express")

const router = express.Router()
const { requireAuth, admin } = require("../middleware/auth")
const { uploadImage } = require("../middleware/multer")
const {
	createCast,
	getCastsByType,
	getCastById,
	updateCastById,
	deleteCastById,
	getCastByName,
} = require("../controllers/castController")

router.route("/").post(requireAuth, admin, uploadImage.single("avatar"), createCast)
router.route("/castType/:castType").get(getCastsByType)
router.route("/castName/:castType/:castName").get(getCastByName)
router
	.route("/castById/:castType/:castId")
	.get(getCastById)
	.put(requireAuth, admin, uploadImage.single("avatar"), updateCastById)
	.delete(requireAuth, admin, deleteCastById)

module.exports = router
