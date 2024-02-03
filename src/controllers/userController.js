const asyncHandler = require("../middleware/asyncHandler")
const User = require("../db/models/user")

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
		res.status(201).json({ _id: user._id, name: user.username, email: user.email })
	} else {
		res.status(400)
		throw new Error("Invalid user data")
	}
})

module.exports = {
	registerUser,
}
