// const Async_processes = require("../src/models/async_processes");
const { io } = require("../socket/socket");
const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require("../constants/constants");
// const Notifications = require("../src/models/notifications");
// const Task = require("../src/models/tasks");
// const Document = require("../src/models/documents");

const handleKafkaResponse = async (req, res) => {
  const process_id = req.body.process_id;

  debugLogger.debug({
    origin: "kafkaResponseSevice",
    function: "handleKafkaReponse",
    url: req.url,
    method: req.method,
    ip: req.ip,
    process_id: req.body.process_id,
    body: req.body,
  });

  try {
    debugLogger.debug({
      origin: "kafkaResponseSevice",
      function: "handleKafkaReponse",
      message: Constants.message.requestreceived,
    });

    let storeResult;
    const taskRecord = await Task.findOne({ where: { process_id } });

    if (taskRecord && taskRecord.result) {
      const result = taskRecord.result;
      // Retrieve the invoice_id from the Task table based on the provided process_id

      const invoice_id = taskRecord.invoice_id;
      storeResult = await Document.findOne({ where: { invoice_id } });

      if (storeResult.invoice_id && taskRecord.invoice_id) {
        const checkedFields = [
          {
            datafields: [
              {
                group: "header",
                field_name: "invoice_no",
              },
              {
                group: "header",
                field_name: "invoice_date",
              },
              {
                group: "header",
                field_name: "client_tax_id",
              },
            ],
          },
        ];

        //------------------------------------------------------------------------------------>

        // Find matching fields and their values in the result JSON
        const matchedFields = {};
        checkedFields.forEach((checkedFieldGroup) => {
          checkedFieldGroup.datafields.forEach((field) => {
            const { group, field_name } = field;
            if (result[group] && result[group][field_name]) {
              matchedFields[field_name] = result[group][field_name];
            }
          });
        });

        try {
          // Update the mapped_fields column in the Document table
          const storeResult = await Document.findOne({ where: { invoice_id } });
          const updatedMappedFields = {
            ...storeResult.mapped_result,
            ...matchedFields,
          };
          console.log(updatedMappedFields);
          await storeResult.update({
            mapped_result: updatedMappedFields,
            status: "completed",
          });
          debugLogger.debug({
            status: storeResult.status,
            message: "mapped_fields updated",
          });
        } catch (e) {
          console.log("error----------------------->");
          console.log(e);
        }

        //------------------------------------------------------------------------------------->
      }

      debugLogger.debug({
        origin: "kafkaResponseSevice",
        function: "handleKafkaReponse",
      });

      // Emit the response to the front-end using socket.emit
      io.emit("response", "Process Completed");

      debugLogger.debug({
        origin: "kafkaResponseSevice",
        function: "handleKafkaReponse",
        message: Constants.message.responseSend,
      });
      infoLogger.info({
        origin: "kafkaResponseSevice",
        function: "handleKafkaReponse",
        message: Constants.message.responseSend,
      });
    }
    const notificationCreated = await Notifications.create({
      requested_by: storeResult.requested_by,
      message: "process Completed",
    });
    console.log("hjafgbeee");
    debugLogger.debug({
      id: notificationCreated.id,
      message: notificationCreated.message,
      requested_by: notificationCreated.requested_by,
      status: notificationCreated.status,
    });
    res.sendStatus(200);
    debugLogger.debug({
      origin: "kafkaResponseSevice",
      function: "handleKafkaReponse",
      statusCode: Constants.status.success,
      message: Constants.message.processComplete,
    });
    infoLogger.info({
      origin: "kafkaResponseSevice",
      function: "handleKafkaReponse",
      statusCode: Constants.status.success,
      message: Constants.message.processComplete,
    });
  } catch (error) {
    errorLogger.error({
      origin: "kafkaResponseSevice",
      function: "handleKafkaReponse",
      message: Constants.message.serverError,
      statusCode: Constants.status.serverError,
    });
    res
      .status(500)
      .json({ error: "An error occurred while handling request." });
  }
};

module.exports = { handleKafkaResponse };
