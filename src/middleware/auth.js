const jwt = require("jsonwebtoken")

const requireAuth = (req, res, next) => {
	const token = req.cookies.jwt

	if (token) {
		jwt.verify(token, process.env.JWT_SECRET, err => {
			if (err) {
				console.log(err.message)

				return res.statusStatus(401).send("Unauthenticated request")
			} else {
				return next()
			}
		})
	} else {
		console.log("no found found")
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
