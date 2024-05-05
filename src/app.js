/* eslint-disable import/no-extraneous-dependencies */
require("dotenv").config()
const express = require("express")
const cookieParse = require("cookie-parser")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")
const routerIndex = require("./routes/routerIndex")

const app = express()

require("./db/connection")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParse())
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`)
	next()
})
app.use(routerIndex)

app.listen(process.env.PORT, () => {
	console.log(`app is running at port ${process.env.PORT || 3000}`)
})

app.use(notFound)
app.use(errorHandler)
