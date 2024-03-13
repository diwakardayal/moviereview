exports.parseData = (req, res, next) => {
	const { trailer, casts, genres, tags, writers } = req.body
	if (trailer) req.body.trailer = JSON.parse(JSON.stringify(trailer))
	if (casts) req.body.casts = JSON.parse(JSON.stringify(casts))
	if (genres) req.body.genres = JSON.parse(JSON.stringify(genres))
	if (tags) req.body.tags = JSON.parse(JSON.stringify(tags))
	if (writers) {
		req.body.writers = JSON.parse(writers)
	}

	next()
}
