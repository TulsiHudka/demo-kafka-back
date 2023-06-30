const Async_processes = require('../src/models/async_processes');
const { v4: uuidv4 } = require('uuid');
const axios = require('axios');
const socketIO = require('socket.io');
// const io = require('../app');
// const socketPort = 4000;
// require('../socket')

const requests = async (req, res) => {
    const process_id = uuidv4();
    try {
        const user_id = req.headers.user_id;

        // Make the Java API call using axios.get
        const javaResponse = await axios.post('http://192.168.2.71:8082/delayed', {
            process_id
        })
            .then((response) => {
                console.log(response.data)
            }).catch((error) => {
                console.log(error)
            });
        global.io.emit('notification', `Your data is being processed`)
        const storedRequest = await Async_processes.create({
            user_id,
            process_id,
            status: 'pending',
            response: { "message": "hello there" }
        });
        console.log(storedRequest.process_id, "sent id");
        // console.log(javaResponse.bodys);
        res.send(javaResponse);
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ error: 'An error occurred while storing the data.' });
    }

}

module.exports = { requests }