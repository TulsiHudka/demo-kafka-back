const express = require("express")
const router = new express.Router()

const { kafkaResponse } = require("../controller/kafkaResponseController")

router.post("/Response", kafkaResponse)


module.exports = router