const axios = require('axios');
const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require('../constants')

const sendJavaRequest = async (process_id) => {
    try {
        console.log("request send to java");
        const response = await axios.post('http://192.168.2.89:8082/JKafka/delayed', {
            process_id
        });
        infoLogger.info({
            origin: "javaApi",
            function: "sendJavaRequest",
            message: Constants.message.success
        })
        debugLogger.debug({
            origin: "javaApi",
            function: "sendJavaRequest",
            message: Constants.message.success
        })
        return response.data;
    } catch (error) {
        errorLogger.error({
            // error: error,
            origin: "javaApi",
            function: "sendJavaRequest",
            message: Constants.message.serverError,
            statusCode: Constants.status.serverError
        })
        // console.log(error);
        throw new Error('Error sending Java request.');
    }
};

module.exports = { sendJavaRequest };
