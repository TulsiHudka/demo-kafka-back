const { sendJavaRequest } = require('../repo/javaApi');
const Async_processes = require('../src/models/async_processes');
const { v4: uuidv4 } = require('uuid');
const { io } = require('../socket');
const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require('../constants')

const handleRequest = async (req, res) => {
    const process_id = uuidv4();
    const user_id = req.body.user_id;
    debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        user_id: req.body.user_id
    })
    // console.log(user_id);
    try {
        debugLogger.debug({
            origin: "requestService",
            function: "handleRequest",
            message: Constants.message.requestStatus
        })
        const checkDB = await Async_processes.findOne({ where: { user_id } });
        if (checkDB && checkDB.status == 'pending') {
            // console.log("in progress");
            res.status(500).json({ error: 'your task is already in progress.' });
            debugLogger.debug({
                origin: "requestService",
                function: "handleRequest",
                message: "your task is already in progress."
            })
        } else {
            debugLogger.debug({
                origin: "requestService",
                function: "handleRequest",
                // message: Constants.message.requestStatus
                message: "handling java request"
            })
            const javaResponse = await sendJavaRequest(process_id);
            const storedRequest = await Async_processes.create({
                user_id,
                process_id,
                status: 'pending',
                response: { "message": "hello there" }
            });
            debugLogger.debug({
                message: "data strored in database",
                user_id: storedRequest.user_id,
                process_id: storedRequest.process_id,
                status: storedRequest.status,
                response: storedRequest.response
            })
            // console.log(storedRequest.process_id, "sent id");
            res.send(javaResponse);
            infoLogger.info({
                origin: "requestService",
                function: "handleRequest",
                statusCode: Constants.status.success,
                message: Constants.message.processStart
            })
            debugLogger.debug({
                origin: "requestService",
                function: "handleRequest",
                statusCode: Constants.status.success,
                message: Constants.message.processStart
            })
            io.emit('test', 'Your data is processing');
        }
    } catch (error) {
        errorLogger.error({
            origin: "requestService",
            function: "handleRequest",
            message: Constants.message.serverError,
            statusCode: Constants.status.serverError
        })
        res.status(500).json({ error: 'An error occurred while storing the data.' });
    }
};

module.exports = { handleRequest };





// const process_id = uuidv4();
// const user_id = req.body.user_id;
// console.log(user_id);
// try {
//     const checkDB = await Async_processes.findOne({ where: { user_id } });
//     if (checkDB && checkDB.status == 'pending') {
//         console.log("in progress");
//         res.status(500).json({ error: 'your task is already in progress.' });
//     } else {
//         const javaResponse = await axios.post('http://192.168.2.71:8082/JKafka/delayed', {
//             process_id
//         }).then((response) => {
//         }).catch((error) => {
//             console.log(error)
//         });
//         const storedRequest = await Async_processes.create({
//             user_id,
//             process_id,
//             status: 'pending',
//             response: { "message": "hello there" }
//         });
//         console.log(storedRequest.process_id, "sent id");
//         res.send(javaResponse);
//         io.emit('test', 'Your data is processing')
//     }
// } catch (error) {
//     console.error('Error storing data:', error);
//     res.status(500).json({ error: 'An error occurred while storing the data.' });
// }