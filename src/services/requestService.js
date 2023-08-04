const { sendJavaRequest } = require("../repo/javaApi");
// const Task = require("../src/models/tasks");
// const Document = require("../src/models/documents");
const { v4: uuidv4 } = require("uuid");
const { io } = require("../socket/socket");
const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require("../constants/constants");
// const Notifications = require("../src/models/notifications");

const handleRequest = async (req, res) => {
  const process_id = uuidv4();
  const invoice_id = uuidv4();
  const user_id = req.headers.user_id;
  let requested_by = user_id;
  let checkDB;
  console.log(user_id);
  console.log(req.file.filename);
  debugLogger.debug({
    url: req.url,
    method: req.method,
    ip: req.ip,
    user_id: req.headers.user_id,
    filename: req.file.filename,
  });
  try {
    debugLogger.debug({
      origin: "requestService",
      function: "handleRequest",
      message: Constants.message.requestreceived,
    });
    const upload =
      "http://192.168.2.47:9000/nodeKafka/images/" + req.file.filename;
    try {
      checkDB = await Document.findOne({ where: { requested_by } });
    } catch (e) {
      console.log("error-------------->");
      console.log(e);
    }
    // console.log(checkDB.invoice_id);
    if (checkDB && checkDB.status == "pending") {
      console.log("hello there--------------------------->");
      // console.log("in progress");
      res.status(500).json({ error: "your task is already in progress." });
      debugLogger.debug({
        origin: "requestService",
        function: "handleRequest",
        message: "your task is already in progress.",
      });
    } else {
      const uploadDocument = await Document.create({
        requested_by: user_id,
        invoice_id: invoice_id,
        document_name: req.file.filename,
        document_url: upload,
        status: "pending",
      });
      debugLogger.debug({
        message: "document strored in database",
        user_id: uploadDocument.requested_by,
        process_id: uploadDocument.process_id,
        invoice_id: uploadDocument.invoice_id,
        status: uploadDocument.status,
      });
      const invoiceId = uploadDocument.invoice_id;
      console.log(invoiceId);

      const createTask = await Task.create({
        requested_by: user_id,
        process_id,
        invoice_id: invoice_id,
        // result: result,
      });
      debugLogger.debug({
        message: "task strored in database",
        user_id: createTask.user_id,
        process_id: createTask.process_id,
        status: createTask.status,
      });

      debugLogger.debug({
        origin: "requestService",
        function: "handleRequest",
        // message: Constants.message.requestreceived
        message: "handling java request",
      });
      const javaResponse = await sendJavaRequest(process_id, upload);

      // console.log(storedRequest.process_id, "sent id");
      // res.send(javaResponse);

      const responseData = {
        upload,
        javaResponse,
      };
      res.send(responseData);
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
