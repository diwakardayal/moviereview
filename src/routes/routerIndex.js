const express = require("express")
const userRoutes = require("./userRoutes")
const actorRoute = require("./actorRoute")

const router = express.Router()

router.use("/api/users", userRoutes)
router.use("/api/actor", actorRoute)
module.exports = router
