const express = require("express");
const bodyParser = require("body-parser");
const requestRouter = require("./routers/requestRoutes");
const kafkaRouter = require("./routers/kafkaResponseRoutes");
const Notifications = require("./src/models/notifications");
const socket_ids = require("./src/models/socket_ids");
const { startSocketServer } = require("./socket");
const infoLogger = require("./logs/infoLogger");
const debugLogger = require("./logs/debugLogger");
const client = require("./eureka");
const http = require("http");
const cors = require("cors");
const port = process.env.port;
const clientUrl = process.env.clientUrl;
client.start();
const app = express();
const server = http.createServer(app);
const dotenv = require("dotenv");
dotenv.config();

app.use(
  cors({
    origin: clientUrl,
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);

app.use(bodyParser.json());
app.use("/nodeKafka/api", requestRouter);
app.use("/nodeKafka/kafka", kafkaRouter);

server.listen(port, async () => {
  infoLogger.info({
    origin: "app",
    function: "server",
    message: `Express server listening on port ${port}`,
  });
  debugLogger.debug({
    origin: "app",
    function: "server",
    message: `Express server listening on port ${port}`,
  });
  startSocketServer();
  await socket_ids.destroy({ truncate: true });
  infoLogger.info({
    origin: "app",
    function: "destroy",
    message: "socket_ids table is cleared.",
  });
});
