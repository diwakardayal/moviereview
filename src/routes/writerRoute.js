const express = require("express")
const { getWriterByIds, getWriters } = require("../controllers/writerController")

const router = express.Router()

router.route("/").get(getWriters)
router.route("/:ids").get(getWriterByIds)
module.exports = router
