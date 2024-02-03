require("dotenv").config()
const express = require("express")
const routerIndex = require("./routes/routerIndex")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

const app = express()

require("./db/connection")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(routerIndex)

app.listen(process.env.PORT, () => {
	console.log(`app is running at port ${process.env.PORT || 3000}`)
})

app.use(notFound)
app.use(errorHandler)
