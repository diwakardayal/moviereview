const jwt = require("jsonwebtoken")
const User = require("../db/models/user")

const requireAuth = async (req, res, next) => {
	try {
		const token = req.cookies.jwt

		if (token) {
			const decode = jwt.verify(token, process.env.JWT_SECRET)
			const user = await User.findById(decode?.id)
			req.user = user
			next()
		} else {
			console.log("token no found")
			res.status(401)
			throw Error("Unauthenticated request")
		}
	} catch (e) {
		console.log(e)
		res.status(401)
		throw Error("Unauthenticated request")
	}
}

const admin = (req, res, next) => {
	if (req.user && req.user.isAdmin) {
		next()
	} else {
		res.status(401)
		throw Error("Not authorized as admin")
	}
}

module.exports = { requireAuth, admin }
