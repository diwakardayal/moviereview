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

module.exports = requireAuth
