const axios = require("axios");
const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require("../constants/constants");
// const dotenv = require("dotenv");
// const javaApi = process.env.javaApi;
// dotenv.config();

const sendJavaRequest = async (process_id, upload) => {
  console.log(process_id);
  console.log(upload);
  try {
    const response = await axios.post(
      "http://192.168.2.71:8082/JKafka/delayed",
      {
        process_id,
        upload,
      }
    );
    console.log("request send to java");
    infoLogger.info({
      origin: "javaApi",
      function: "sendJavaRequest",
      message: Constants.message.success,
    });
    debugLogger.debug({
      origin: "javaApi",
      function: "sendJavaRequest",
      message: Constants.message.success,
    });
    return response.data;
    console.log(response);
  } catch (error) {
    errorLogger.error({
      // error: error,
      origin: "javaApi",
      function: "sendJavaRequest",
      message: Constants.message.serverError,
      statusCode: Constants.status.serverError,
    });
    // console.log(error);
    throw new Error("Error sending Java request.");
  }
};

module.exports = { sendJavaRequest };
