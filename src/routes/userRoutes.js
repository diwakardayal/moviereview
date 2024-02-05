const express = require("express")
const {
	registerUser,
	authUser,
	verifyEmail,
	resendEmailVerificationOTP,
} = require("../controllers/userController")

const router = express.Router()

router.route("/").post(registerUser)
router.post("/auth", authUser)
router.post("/verifyEmail", verifyEmail)
router.post("/resendEmailVerificationOTP", resendEmailVerificationOTP)

module.exports = router
