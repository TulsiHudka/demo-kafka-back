const express = require("express");
const bodyParser = require("body-parser");
const requestRouter = require("./src/controller/requestController");
const kafkaRouter = require("./src/controller/kafkaResponseController");
// const socket_ids = require("./src/models/socket_ids");
const { startSocketServer } = require("./src/socket/socket");
const infoLogger = require("./src/logs/infoLogger");
const debugLogger = require("./src/logs/debugLogger");
const client = require("./eureka");
const http = require("http");
const cors = require("cors");
const port = process.env.port;
const clientUrl = process.env.clientUrl;
// client.start();
const app = express();
const server = http.createServer(app);
const multer = require("multer");
const dotenv = require("dotenv");
const path = require("path");
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
app.use("/nodeKafka/images", express.static(path.join("images")));

server.listen(port, async () => {
  console.log(port);
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
  // await socket_ids.destroy({ truncate: true });
  infoLogger.info({
    origin: "app",
    function: "destroy",
    message: "socket_ids table is cleared.",
  });
});
