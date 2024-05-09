const Review = require("../db/models/review")

const parseData = (req, res, next) => {
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

function topRatedMoviesPipeline(type) {
	const matchOptions = {
		reviews: { $exists: true },
		status: { $eq: "public" },
	}

	if (type) matchOptions.type = { $eq: type }

	return [
		{
			$lookup: {
				from: "Movie",
				localField: "reviews",
				foreignField: "_id",
				as: "topRated",
			},
		},
		{
			$match: matchOptions,
		},
		{
			$project: {
				title: 1,
				poster: "$poster.url",
				responsivePosters: "$poster.responsive",
				reviewCount: { $size: "$reviews" },
			},
		},
		{
			$sort: {
				reviewCount: -1,
			},
		},
		{
			$limit: 5,
		},
	]
}

const averageRatingPipeline = movieId => {
	return [
		{
			$lookup: {
				from: "Review",
				localField: "rating",
				foreignField: "_id",
				as: "avgRat",
			},
		},
		{
			$match: { movieId },
		},
		{
			$group: {
				_id: null,
				ratingAvg: {
					$avg: "$rating",
				},
				reviewCount: {
					$sum: 1,
				},
			},
		},
	]
}

async function getAverageRatings(movieId) {
	const [aggregatedResponse] = await Review.aggregate(averageRatingPipeline(movieId))
	const reviews = {}

	if (aggregatedResponse) {
		const { ratingAvg, reviewCount } = aggregatedResponse
		reviews.ratingAvg = parseFloat(ratingAvg).toFixed(1)
		reviews.reviewCount = reviewCount
	}

	return reviews
}

const relatedMovieAggregation = (tags, movieId) => {
	return [
		{
			$lookup: {
				from: "Movie",
				localField: "tags",
				foreignField: "_id",
				as: "relatedMovies",
			},
		},
		{
			$match: {
				tags: { $in: [...tags] },
				_id: { $ne: movieId },
			},
		},
		{
			$project: {
				title: 1,
				poster: "$poster.url",
				responsivePosters: "$poster.responsive",
			},
		},
		{
			$limit: 5,
		},
	]
}

module.exports = {
	parseData,
	topRatedMoviesPipeline,
	averageRatingPipeline,
	getAverageRatings,
	relatedMovieAggregation,
}
