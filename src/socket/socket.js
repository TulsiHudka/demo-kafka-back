const express = require("express");
const http = require("http");
const app = express();
const cors = require("cors");
const socketIO = require("socket.io");
const socketServer = http.createServer(app);
const socketPort = 5050;
// const socket_ids = require("./src/models/socket_ids");
const infoLogger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");
const Constants = require("../constants/constants");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "DELETE", "PATCH"],
  })
);

const io = socketIO(
  socketServer,
  {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST", "DELETE", "PATCH"],
    },
  },
  { transports: ["websocket"] }
);

io.on("connection", async (socket) => {
  infoLogger.info({
    origin: "socket",
    function: "io",
    socket_id: socket.id,
    message: Constants.message.webSocketConnect,
  });
  debugLogger.debug({
    origin: "socket",
    function: "io",
    socket_id: socket.id,
    message: Constants.message.webSocketConnect,
  });

  // console.log('Client connected:', socket.id);

  socket.on("newConnection", async (user) => {
    const user_id = user;
    const socket_id = socket.id;

    await socket_ids.create({
      socket_id,
      user_id,
    });
  });
  socket.on("disconnect", async () => {
    const socket_id = socket.id;
    // console.log(socket_id, "heloooooooooo");
    infoLogger.info({
      origin: "socket",
      function: "io",
      socket_id: socket.id,
      message: Constants.message.webSocketDisconnect,
    });
    debugLogger.debug({
      origin: "socket",
      function: "io",
      socket_id: socket.id,
      message: Constants.message.webSocketDisconnect,
    });
    // console.log('A user disconnected');
    await socket_ids.destroy({ where: { socket_id: socket_id } });
  });
});

function startSocketServer(server, socket) {
  socketServer.listen(socketPort, (err) => {
    if (err) {
      errorLogger.error({
        origin: "socket",
        function: "startSocketServer",
        socket_id: socket.id,
        statusCode: Constants.status.serverError,
        message: Constants.message.webSocketError,
      });
      // console.error('error in connecting Socket:: Error: ' + JSON.stringify(err));
    } else {
      infoLogger.info({
        origin: "socket",
        function: "startSocketServer",
        message: `Socket is running on port: ${socketPort}`,
      });
      debugLogger.debug({
        origin: "socket",
        function: "startSocketServer",
        message: `Socket is running on port: ${socketPort}`,
      });
      // console.log(`Socket is running on port: ${socketPort}`);
    }
  });
}
module.exports = { io, startSocketServer };
