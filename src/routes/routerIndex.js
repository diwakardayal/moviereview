const express = require("express")
const userRoutes = require("./userRoutes")
const actorRoute = require("./actorRoute")
const movieRouter = require("./movieRouter")

const router = express.Router()

router.use("/api/users", userRoutes)
router.use("/api/actor", actorRoute)
router.use("/api/movie", movieRouter)
module.exports = router
