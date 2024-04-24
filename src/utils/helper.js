exports.parseData = (req, res, next) => {
	const { trailer, actors, genres, tags, writers, releaseDate } = req.body

	if (releaseDate) req.body.releaseDate = releaseDate
	if (trailer) req.body.trailer = JSON.parse(trailer)
	if (actors) req.body.actors = JSON.parse(actors)
	if (genres) req.body.genres = JSON.parse(genres)
	if (tags) req.body.tags = JSON.parse(tags)
	if (writers) {
		req.body.writers = JSON.parse(writers)
	}

	next()
}
