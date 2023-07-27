// const { handleRequest } = require("../services/requestService");
const notificationService = require("../services/requestService");
// const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require("../constants");

const requests = async (req, res) => {
  try {
    debugLogger.debug({
      origin: "requestController",
      function: "request",
      message: Constants.message.requestreceived,
    });
    await notificationService.handleRequest(req, res);
  } catch (error) {
    errorLogger.error({
      // error: error,
      origin: "requestController",
      function: "request",
      message: Constants.message.serverError,
      statusCode: Constants.status.serverError,
    });
    // console.error('Error handling request:', error);
    // console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while handling the request." });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    debugLogger.debug({
      origin: "requestController",
      function: "getAllNotifications",
      message: Constants.message.requestreceived,
    });
    const notifications = await notificationService.getAllNotifications();
    res.json(notifications);
  } catch (error) {
    errorLogger.error({
      // error: error,
      origin: "requestController",
      function: "getAllNotifications",
      message: Constants.message.serverError,
      statusCode: Constants.status.serverError,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateNotificationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    debugLogger.debug({
      origin: "requestController",
      function: "getAllNotifications",
      message: Constants.message.requestreceived,
    });
    const notification = await notificationService.updateNotificationStatus(
      id,
      status
    );
    res.json(notification);
  } catch (error) {
    errorLogger.error({
      // error: error,
      origin: "requestController",
      function: "updateNotificationStatus",
      message: Constants.message.serverError,
      statusCode: Constants.status.serverError,
    });
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  requests,
  getAllNotifications,
  updateNotificationStatus,
};
