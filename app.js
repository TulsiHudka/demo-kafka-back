const express = require('express');
const http = require('http');
const cors = require('cors')
const bodyParser = require("body-parser");
const requestRouter = require("./routers/requestRoutes")
const kafkaRouter = require("./routers/kafkaResponseRoutes")
const { startSocketServer } = require('./socket');
const socket_ids = require('./src/models/socket_ids');
const client = require('./eureka')
const port = process.env.port
client.start()
const app = express();
const server = http.createServer(app);
const dotenv = require('dotenv')
dotenv.config()
const infoLogger = require("./logs/infoLogger");
const errorLogger = require("./logs/errorLogger");
const debugLogger = require("./logs/debugLogger");
const Constants = require("./constants")


app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'DELETE']
}));

app.use(bodyParser.json());
app.use("/nodeKafka/api", requestRouter)
app.use("/nodeKafka/kafka", kafkaRouter)

server.listen(port, async () => {
    infoLogger.info({
        origin: "app",
        function: "server",
        message: `Express server listening on port ${port}`
    })
    debugLogger.debug({
        origin: "app",
        function: "server",
        message: `Express server listening on port ${port}`
    })
    // console.log(`Express server listening on port ${port}`);
    startSocketServer()
    await socket_ids.destroy({ truncate: true });
    infoLogger.info({
        origin: "app",
        function: "destroy",
        message: "socket_ids table is cleared."
    })
});

// server.js
// const express = require('express');
const { sequelize } = require('./src/db/conn');
const notifications = require('./src/models/notifications');

// const app = express();
// const PORT = 3000;

// Middleware
// app.use(express.json());

// API routes
app.get('/api/notifications', async (req, res) => {
    try {
        const notifications = await Notification.findAll();
        res.json(notifications);
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.patch('/api/notifications/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const notification = await Notification.findByPk(id);
        if (!notification) {
            return res.status(404).json({ error: 'Notification not found' });
        }

        notification.status = status;
        notification.updated_at = new Date();
        await notification.save();

        res.json(notification);
    } catch (error) {
        console.error('Error updating notification:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




