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

//set up multer
// const diskStorage = multer.diskStorage({
//   destination: (req, file, callback) => {
//     callback(null, "images");
//   },
//   filename: (req, file, callback) => {
//     const mimetype = file.mimetype.split("/");
//     const fileType = mimetype[1];
//     const filename = file.originalname;
//     callback(null, filename);
//   },
// });

// const fileFilter = (req, file, callback) => {
//   const allowedMimeTypes = ["image/png", "image/jpeg", "image/jpg"];
//   allowedMimeTypes.includes(file.mimetype)
//     ? callback(null, true)
//     : callback(null, false);
// };

// const storage = multer({ storage: diskStorage, fileFilter: fileFilter }).single(
//   "upload"
// );

// Route to handle file uploads
// app.post("/nodeKafka/api/upload", storage, (req, res) => {
//   if (!req.file) {
//     return res.status(400).send("No file uploaded.");
//   }
//   const upload =
//     "http://192.168.2.47:9000/nodeKafka/images/" + req.file.filename;

//   return res.send(upload);
//   // return res.status(200).json({ message: "File uploaded successfully." });
// });

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
  await socket_ids.destroy({ truncate: true });
  infoLogger.info({
    origin: "app",
    function: "destroy",
    message: "socket_ids table is cleared.",
  });
});
