const { handleRequest } = require('../services/requestService');
// const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require('../constants')

const requests = async (req, res) => {
    try {
        debugLogger.debug({
            origin: "requestController",
            function: "request",
            message: Constants.message.requestStatus
        })
        await handleRequest(req, res);
    } catch (error) {
        errorLogger.error({
            // error: error,
            origin: "requestController",
            function: "request",
            message: Constants.message.serverError,
            statusCode: Constants.status.serverError
        })
        // console.error('Error handling request:', error);
        // console.log(error);
        res.status(500).json({ error: 'An error occurred while handling the request.' });
    }
};

module.exports = { requests };
