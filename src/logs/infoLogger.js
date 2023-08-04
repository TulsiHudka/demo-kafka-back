const winston = require("winston");

const { ElasticsearchTransport } = require("winston-elasticsearch");

const esTransport = new ElasticsearchTransport({
    level: "info",
    indexPrefix: "async_process",
    clientOpts: { node: "http://localhost:9200" },
});

const infoLogger = new winston.createLogger({
    level: "info",
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
    transports: [new winston.transports.Console(), esTransport],
});


module.exports = infoLogger;