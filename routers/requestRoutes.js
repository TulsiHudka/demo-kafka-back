const express = require("express");
const router = new express.Router();
const { storage } = require("../middleware/uploadImage");

const {
  requests,
  getAllNotifications,
  updateNotificationStatus,
} = require("../controller/requestController");

router.post("/upload", storage, requests);
router.get("/notifications", getAllNotifications);
router.patch("/notifications/:id", updateNotificationStatus);

module.exports = router;
