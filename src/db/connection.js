const mongoose = require("mongoose")

try {
	mongoose.connect(process.env.MONGO_URI).then(() => console.log("connection to db established"))
} catch (error) {
	console.log(error)
}
