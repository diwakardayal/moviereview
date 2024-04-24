const express = require("express")
const userRoutes = require("./userRoutes")
const actorRoute = require("./actorRoute")
const movieRouter = require("./movieRouter")
const castRouter = require("./castRoute")

const router = express.Router()

router.use("/api/users", userRoutes)
router.use("/api/actor", actorRoute)
router.use("/api/movie", movieRouter)
router.use("/api/cast", castRouter)
module.exports = router
