const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = mongoose.Schema({
	username: {
		type: String,
		trim: true,
		required: true,
	},
	email: {
		type: String,
		trim: true,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	isVerfied: {
		type: Boolean,
		required: true,
		default: false,
	},
})

userSchema.methods.matchPassword = async function (enteredPassword) {
	// eslint-disable-next-line no-return-await
	return await bcrypt.compare(enteredPassword, this.password)
}

userSchema.pre("save", async function (next) {
	if (this.isModified("password")) {
		const salt = await bcrypt.genSalt(10)
		this.password = await bcrypt.hash(this.password, salt)
	}

	next()
})

module.exports = mongoose.model("User", userSchema)
