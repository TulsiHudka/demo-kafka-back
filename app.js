const express = require('express');
const http = require('http');
// const initSocket = require('./socket');
const socketIO = require('socket.io')
const cors = require('cors')
const bodyParser = require("body-parser");
const requestRouter = require("./routers/requestRoutes")
const kafkaRouter = require("./routers/kafkaResponseRoutes")
require("./kafka")

const app = express();
app.use(express.json());

// Create a WebSocket server
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE']
    // Other options if needed
}));
app.use(bodyParser.json());
app.use("/api", requestRouter)
app.use("/kafka", kafkaRouter)

const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "DELETE"]
    }
});
global.io = io;

// Handle WebSocket connections
io.on('connection', (socket) => {
    console.log('WebSocket connection established');

    socket.on('disconnect', () => {
        console.log('WebSocket connection closed');
    });
});


server.listen(8000, () => {
    console.log('Server is running on port 8000.');
});

// const socketPort = 4000;
// require('./socket')(io, socketPort);

// module.exports = { io };
// module.exports = io; 
