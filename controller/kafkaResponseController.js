const Async_processes = require('../src/models/async_processes');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
// const io = require('../app');
// const socketPort = 4000;
// require('../socket')
const kafkaResponse = async (req, res) => {
    try {
        const process_id = req.headers.process_id;

        //Retrieve the response from the database based on the processID
        const checkDB = await Async_processes.findOne({ where: { process_id } });

        if (checkDB && checkDB.response) {
            const response = checkDB.response;

            // Emit the response to the front-end using socket.emit
            global.io.emit('response', response);
        }
        await checkDB.update({ status: 'completed' });

        res.sendStatus(200);
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ error: 'An error occurred while storing the data.' });
    }

}

module.exports = { kafkaResponse }