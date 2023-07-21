const { handleKafkaResponse } = require("../services/kafkaResponseService");
// const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require("../constants");

const kafkaResponse = async (req, res) => {
  try {
    debugLogger.debug({
      origin: "kafkaResponseController",
      function: "kafkaResponse",
      message: Constants.message.requestreceived,
    });
    await handleKafkaResponse(req, res);
  } catch (error) {
    errorLogger.error({
      // error: error,
      origin: "kafkaResponseController",
      function: "kafkaResponse",
      message: Constants.message.serverError,
      message: Constants.message.serverError,
    });
    // console.error('Error handling Kafka response:', error);
    res
      .status(500)
      .json({ error: "An error occurred while handling the Kafka response." });
  }
};

module.exports = { kafkaResponse };
