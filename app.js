const express = require('express');
const axios = require('axios');
const http = require('http');
const socketIO = require('socket.io');
const Request = require('./src/models/request');
const cors = require('cors')
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(express.json());

// Create a WebSocket server
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE']
    // Other options if needed
}));
app.use(bodyParser.json());

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE"]
    }
});

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('WebSocket connection established');

    socket.on('disconnect', () => {
        console.log('WebSocket connection closed');
    });
});

app.get('/request', async (req, res) => {
    try {
        console.log("heloo");
        console.log(req.headers.userid);

        const userId = req.headers.userid;
        console.log(userId)
        // console.log(typeof (userId))

        const processId = uuidv4();
        console.log('Process ID:', processId);

        // Store the data in the database
        const storedRequest = await Request.create({
            userId: userId,
            processId: processId,
            status: 'pending'
        });

        // Make the Java API call using axios.get
        io.emit('notification', `Your data is being processed`)
        const javaApiResponse = axios.post('http://192.168.2.71:8081/delayed', {
            processID: processId
        }).then((response) => {
            console.log(response)
        }).catch((error) => {
            console.log(error)
        });

        // res.sendStatus("")
        // Extract processID from the Java API response
        // const javaProcessID = javaApiResponse.data.processID;

        // Update the stored request with the Java processID
        // await storedRequest.update({ processID: javaProcessID });

        // Notify the front-end using Socket.IO
        res.sendStatus(200);
    } catch (error) {
        console.error('Error storing data:', error);
        res.status(500).json({ error: 'An error occurred while storing the data.' });
    }
});

server.listen(8000, () => {
    console.log('Server is running on port 8000.');
});

