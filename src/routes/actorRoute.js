const express = require("express")
const { createActor } = require("../controllers/actorController")

const Router = express.Router()

Router.post("/", createActor)

module.exports = Router
