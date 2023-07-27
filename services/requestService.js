const { sendJavaRequest } = require("../repo/javaApi");
const Task = require("../src/models/tasks");
const Document = require("../src/models/documents");
const { v4: uuidv4 } = require("uuid");
const { io } = require("../socket");
const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require("../constants");
const Notifications = require("../src/models/notifications");
const path = require("path");

const handleRequest = async (req, res) => {
  const process_id = uuidv4();
  const invoice_id = uuidv4();
  const user_id = req.headers.user_id;
  console.log(user_id);
  console.log(req.file.filename);
  debugLogger.debug({
    url: req.url,
    method: req.method,
    ip: req.ip,
    user_id: req.headers.user_id,
    filename: req.file.filename,
  });
  // console.log(user_id);
  try {
    debugLogger.debug({
      origin: "requestService",
      function: "handleRequest",
      message: Constants.message.requestreceived,
    });
    const upload =
      "http://192.168.2.47:9000/nodeKafka/images/" + req.file.filename;
    const result = {
      header: {
        invoice_no: "61356291",
        invoice_date: "09/06/2012",
        seller:
          "Chapman, Kim and Green 64731 James Branch Smithmouth, NC 26872",
        client: "Rodriguez-Stevens 2280 Angela Plain Hortonshire, MS 93248",
        seller_tax_id: "949-84-9105",
        client_tax_id: "939-98-8477",
        iban: "GB50ACIE59715038217063",
      },
      items: [
        {
          item_desc: "Wine Glasses Goblets Pair Clear Glass",
          item_qty: "5,00",
          item_net_price: "12,00",
          item_net_worth: "60,00",
          item_vat: "10%",
          item_gross_worth: "66,00",
        },
        {
          item_desc:
            "With Hooks Stemware Storage Multiple Uses Iron Wine Rack Hanging Glass",
          item_qty: "4,00",
          item_net_price: "28,08",
          total_net_worth: "112,32",
          item_vat: "10%",
          item_gross_worth: "123,55",
        },
        {
          item_desc:
            "Replacement Corkscrew Parts Spiral Worm Wine Opener Bottle Houdini",
          item_qty: "1,00",
          item_net_price: "7,50",
          total_net_worth: "7,50",
          item_vat: "10%",
          item_gross_worth: "8,25",
        },
        {
          item_desc:
            "HOME ESSENTIALS GRADIENT STEMLESS WINE GLASSES SET OF 420 FL OZ (591 ml) NEW",
          item_qty: "1,00",
          item_net_price: "12,99",
          item_net_worth: "12,99",
          item_vat: "10%",
          item_gross_worth: "14,29",
        },
      ],
      summary: {
        total_net_worth: "$ 192,81",
        total_vat: "$19,28",
        total_gross_worth: "$ 212,09",
      },
    };
    const uploadDocument = await Document.create({
      requested_by: user_id,
      invoice_id: invoice_id,
      document_name: req.file.filename,
      document_url: upload,
      status: "pending",
    });
    debugLogger.debug({
      message: "document strored in database",
      user_id: uploadDocument.user_id,
      process_id: uploadDocument.process_id,
      invoice_id: uploadDocument.invoice_id,
      status: uploadDocument.status,
      // response: storedRequest.response,
    });
    console.log(uploadDocument.invoice_id);
    try {
      const createTask = await Task.create({
        requested_by: user_id,
        process_id,
        invoice_id: uploadDocument.invoice_id,
        result: result,
      });
      debugLogger.debug({
        message: "task strored in database",
        user_id: createTask.user_id,
        process_id: createTask.process_id,
        status: createTask.status,
        // response: storedRequest.response,
      });
    } catch (e) {
      console.log("error start ------------ \n");
      console.log(e);
      console.log("\n error end ------------ \n");
    }
    console.log("helloooooooooooo");

    // const requested_by = user_id;
    // const checkDB = await Document.findOne({ where: { requested_by } });
    // if (checkDB && checkDB.status == "pending") {
    //   // console.log("in progress");
    //   res.status(500).json({ error: "your task is already in progress." });
    //   debugLogger.debug({
    //     origin: "requestService",
    //     function: "handleRequest",
    //     message: "your task is already in progress.",
    //   });
    // } else
    // {
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
    // }
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
