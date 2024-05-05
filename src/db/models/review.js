const mongoose = require("mongoose")

const reviewSchema = mongoose.Schema({
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
		required: true,
	},
	movieId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "movie",
		required: true,
	},
	rating: {
		type: Number,
		required: true,
	},
	comment: {
		type: String,
		trim: true,
	},
})

module.exports = mongoose.model("review", reviewSchema)
