const express = require("express")
const { getDirectors, getDirectorById } = require("../controllers/directorController")

const router = express.Router()

router.route("/").get(getDirectors)
router.route("/:id").get(getDirectorById)
module.exports = router
