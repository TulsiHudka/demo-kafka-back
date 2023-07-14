const Async_processes = require('../src/models/async_processes');
const { io } = require('../socket');
const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require("../constants")

const handleKafkaResponse = async (req, res) => {
    const process_id = req.body.process_id;
    // console.log(req.body);
    // console.log(process_id);
    debugLogger.debug({
        origin: "kafkaResponseSevice",
        function: "handleKafkaReponse",
        url: req.url,
        method: req.method,
        ip: req.ip,
        process_id: req.body.process_id,
        body: req.body
    })
    try {
        debugLogger.debug({
            origin: "kafkaResponseSevice",
            function: "handleKafkaReponse",
            message: Constants.message.requestStatus
        })
        // console.log("hit api");

        // Retrieve the response from the database based on the process_id
        const checkDB = await Async_processes.findOne({ where: { process_id } });

        if (checkDB && checkDB.response) {
            const response = checkDB.response;
            // console.log(response);
            debugLogger.debug({
                origin: "kafkaResponseSevice",
                function: "handleKafkaReponse",
                response: response
            })
            // Emit the response to the front-end using socket.emit
            io.emit('response', response);
            debugLogger.debug({
                origin: "kafkaResponseSevice",
                function: "handleKafkaReponse",
                message: Constants.message.responseSend
            })
            infoLogger.info({
                origin: "kafkaResponseSevice",
                function: "handleKafkaReponse",
                message: Constants.message.responseSend
            })
        }
        await checkDB.update({ status: 'completed' });
        debugLogger.debug({
            status: checkDB.status,
            message: "status updated"
        })
        res.sendStatus(200);
        debugLogger.debug({
            origin: "kafkaResponseSevice",
            function: "handleKafkaReponse",
            statusCode: Constants.status.success,
            message: Constants.message.processComplete
        })
        infoLogger.info({
            origin: "kafkaResponseSevice",
            function: "handleKafkaReponse",
            statusCode: Constants.status.success,
            message: Constants.message.processComplete
        })
    } catch (error) {
        errorLogger.error({
            // error: error,
            origin: "kafkaResponseSevice",
            function: "handleKafkaReponse",
            message: Constants.message.serverError,
            statusCode: Constants.status.serverError
        })
        // console.error('Error storing data:', error);
        res.status(500).json({ error: 'An error occurred while handling request.' });
    }
};

module.exports = { handleKafkaResponse };