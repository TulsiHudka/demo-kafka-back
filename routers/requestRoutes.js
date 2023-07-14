const express = require("express")
const router = new express.Router()

const { requests } = require("../controller/requestController")

router.post("/request", requests)

module.exports = router