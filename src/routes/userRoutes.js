const express = require("express")
const {
	registerUser,
	authUser,
	verifyEmail,
	resendEmailVerificationOTP,
	getUsers,
} = require("../controllers/userController")
const { requireAuth, admin } = require("../middleware/auth")

const router = express.Router()

router.route("/").post(registerUser).get(requireAuth, admin, getUsers)
router.post("/auth", authUser)
router.post("/verifyEmail", verifyEmail)
router.post("/resendEmailVerificationOTP", resendEmailVerificationOTP)

module.exports = router
