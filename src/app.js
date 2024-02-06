/* eslint-disable import/no-extraneous-dependencies */
require("dotenv").config()
const express = require("express")
const cookieParse = require("cookie-parser")
const routerIndex = require("./routes/routerIndex")
const { notFound, errorHandler } = require("./middleware/errorMiddleware")

const app = express()

require("./db/connection")

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParse())
app.use(routerIndex)

app.listen(process.env.PORT, () => {
	console.log(`app is running at port ${process.env.PORT || 3000}`)
})

app.use(notFound)
app.use(errorHandler)
