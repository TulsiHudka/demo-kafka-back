const express = require("express");
const router = new express.Router();

const {
  requests,
  getAllNotifications,
  updateNotificationStatus,
} = require("../controller/requestController");

router.post("/request", requests);
router.get("/notifications", getAllNotifications);
router.patch("/notifications/:id", updateNotificationStatus);

module.exports = router;
