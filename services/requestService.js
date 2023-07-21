const { sendJavaRequest } = require("../repo/javaApi");
const Async_processes = require("../src/models/async_processes");
const { v4: uuidv4 } = require("uuid");
const { io } = require("../socket");
const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require("../constants");
const Notifications = require("../src/models/notifications");

const handleRequest = async (req, res) => {
  const process_id = uuidv4();
  const user_id = req.body.user_id;
  debugLogger.debug({
    url: req.url,
    method: req.method,
    ip: req.ip,
    user_id: req.body.user_id,
  });
  // console.log(user_id);
  try {
    debugLogger.debug({
      origin: "requestService",
      function: "handleRequest",
      message: Constants.message.requestreceived,
    });
    const checkDB = await Async_processes.findOne({ where: { user_id } });
    if (checkDB && checkDB.status == "pending") {
      // console.log("in progress");
      res.status(500).json({ error: "your task is already in progress." });
      debugLogger.debug({
        origin: "requestService",
        function: "handleRequest",
        message: "your task is already in progress.",
      });
    } else {
      debugLogger.debug({
        origin: "requestService",
        function: "handleRequest",
        // message: Constants.message.requestreceived
        message: "handling java request",
      });
      const javaResponse = await sendJavaRequest(process_id);
      const storedRequest = await Async_processes.create({
        user_id,
        process_id,
        status: "pending",
        response: { message: "hello there" },
      });
      debugLogger.debug({
        message: "data strored in database",
        user_id: storedRequest.user_id,
        process_id: storedRequest.process_id,
        status: storedRequest.status,
        response: storedRequest.response,
      });
      // console.log(storedRequest.process_id, "sent id");
      res.send(javaResponse);
      infoLogger.info({
        origin: "requestService",
        function: "handleRequest",
        statusCode: Constants.status.success,
        message: Constants.message.processStart,
      });
      debugLogger.debug({
        origin: "requestService",
        function: "handleRequest",
        statusCode: Constants.status.success,
        message: Constants.message.processStart,
      });
      io.emit("test", "Your data is processing");
    }
  } catch (error) {
    errorLogger.error({
      origin: "requestService",
      function: "handleRequest",
      message: Constants.message.serverError,
      statusCode: Constants.status.serverError,
    });
    res
      .status(500)
      .json({ error: "An error occurred while storing the data." });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    debugLogger.debug({
      origin: "requestService",
      function: "getAllNotifications",
      message: Constants.message.requestreceived,
    });
    const notifications = await Notifications.findAll();
    return notifications;
  } catch (error) {
    errorLogger.error({
      origin: "requestService",
      function: "getAllNotifications",
      message: Constants.message.serverError,
      statusCode: Constants.status.serverError,
    });
    throw new Error("Error fetching notifications:", error);
  }
};

const updateNotificationStatus = async (id, status) => {
  try {
    debugLogger.debug({
      origin: "requestService",
      function: "updateNotificationStatus",
      message: Constants.message.requestreceived,
    });
    const notification = await Notifications.findByPk(id);
    if (!notification) {
      throw new Error("Notification not found");
    }

    notification.status = status;
    notification.updated_at = new Date();
    await notification.save();

    return notification;
  } catch (error) {
    errorLogger.error({
      origin: "requestService",
      function: "updateNotificationStatus",
      message: Constants.message.serverError,
      statusCode: Constants.status.serverError,
    });
    throw new Error("Error updating notification:", error);
  }
};

module.exports = {
  handleRequest,
  getAllNotifications,
  updateNotificationStatus,
};
