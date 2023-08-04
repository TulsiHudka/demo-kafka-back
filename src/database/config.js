const dotenv = require("dotenv");
dotenv.config();

const config = {
  development: {
    username: process.env.SEQ_USERNAME,
    password: process.env.SEQ_PASSWORD,
    database: process.env.SEQ_DATABASE,
    host: process.env.SEQ_HOST,
    port: process.env.SEQ_PORT,
    dialect: "postgres",
  },
  test: {
    username: process.env.SEQ_USERNAME,
    password: process.env.SEQ_PASSWORD,
    database: process.env.SEQ_DATABASE,
    host: process.env.SEQ_HOST,
    port: process.env.SEQ_PORT,
    dialect: "postgres",
  },
  production: {
    username: process.env.SEQ_USERNAME,
    password: process.env.SEQ_PASSWORD,
    database: process.env.SEQ_DATABASE,
    host: process.env.SEQ_HOST,
    port: process.env.SEQ_PORT,
    dialect: "postgres",
  },
};

module.exports = config;
