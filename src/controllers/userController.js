/* eslint-disable no-underscore-dangle */
const asyncHandler = require("../middleware/asyncHandler")
const User = require("../db/models/user")

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

	const user = await new User({
		username,
		email,
		password,
	}).save()

	if (user) {
		// eslint-disable-next-line no-underscore-dangle
		res.status(201).json({ _id: user._id, username: user.username, email: user.email })
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
		res.status(200).json({ _id: user._id, username: user.username, email: user.email })
	} else {
		res.status(401)
		throw new Error("Invalid email or password")
	}
})

module.exports = {
	registerUser,
	authUser,
}
