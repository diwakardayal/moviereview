const express = require("express")
const userRoutes = require("./userRoutes")
const actorRoute = require("./actorRoute")
const movieRouter = require("./movieRouter")
const castRouter = require("./castRoute")
const directorRoute = require("./directorRoute")
const writerRoute = require("./writerRoute")
const reviewRoute = require("./reviewRoute")

const router = express.Router()

router.use("/api/users", userRoutes)
router.use("/api/actor", actorRoute)
router.use("/api/movie", movieRouter)
router.use("/api/cast", castRouter)
router.use("/api/director", directorRoute)
router.use("/api/writer", writerRoute)
router.use("/api/review", reviewRoute)

module.exports = router
