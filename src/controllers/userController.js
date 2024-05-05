/* eslint-disable no-underscore-dangle */
const jwt = require("jsonwebtoken")
const asyncHandler = require("../middleware/asyncHandler")
const User = require("../db/models/user")
const sendOTPForVerification = require("../utils/mail")
const emailVerificationOTPs = require("../utils/emailVerificationOtps")

const maxAge = 3 * 24 * 60 * 60
const createToken = id => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: maxAge,
	})
}

/*
    @desc Register user
    @route Post /api/users
    @access Public
*/
const registerUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body

	const userExist = await User.findOne({ email })

	if (userExist) {
		res.status(400)
		throw new Error("User already exists")
	}

	// Send OTP for email verification
	await sendOTPForVerification(email)

	const user = await new User({
		username,
		email,
		password,
	}).save()

	if (user) {
		// eslint-disable-next-line no-underscore-dangle
		res.status(201).json({
			message: "Please verify your email. OTP has been sent to your email accont!",
			id: user._id,
			username: user.username,
			email: user.email,
			isVerfied: false,
		})
	} else {
		res.status(400)
		throw new Error("Invalid user data")
	}
})

/*
    @desc Auth user
    @route Post /api/users/auth
    @access Public
*/
const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await User.findOne({ email })
	if (user && (await user.matchPassword(password))) {
		const token = createToken(user._id)
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })
		res.status(200).json({
			id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		})
	} else {
		res.status(401)
		throw new Error("Invalid email or password")
	}
})

/*
    @desc Verify user emailId
    @route Post /api/users/verify
    @access Public
*/
const verifyEmail = asyncHandler(async (req, res) => {
	const { email, otp } = req.body

	if (emailVerificationOTPs[email] === otp) {
		const user = await User.findOne({ email })
		user.isVerfied = true
		await user.save()
		const token = createToken(email)
		res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 })

		res.status(200).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			message: "Your email is verified.",
			isAdmin: user.isAdmin,
		})
	} else {
		res.status(401)
		throw new Error("Invalid OTP")
	}
})

/*
    @desc Resend Email verification OTP
    @route Post /api/users/resendEmailVerificationOTP
    @access Public
*/
const resendEmailVerificationOTP = asyncHandler(async (req, res) => {
	const { email } = req.body
	await sendOTPForVerification(email)
	res.json({ message: "Please verify your email. OTP has been sent to your email accont!" })
})

/*
    @desc Get all users
    @route GET /api/users/
    @access Private
*/
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find()

	if (!users || users.length === 0) {
		res.status(404)
		throw new Error("User not found")
	}

	res.status(200).json({ users })
})

module.exports = {
	registerUser,
	authUser,
	verifyEmail,
	resendEmailVerificationOTP,
	getUsers,
}
