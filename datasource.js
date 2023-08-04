const path = require("path");
const { Sequelize } = require("sequelize");

const config = require("./src/database/config");

const sequelize = new Sequelize(
  config.development.database,
  config.development.username,
  config.development.password,
  config.development
);

// const sequelize = new Sequelize(config)

const connect = () => {
  return sequelize.authenticate();
};

module.exports = { sequelize, connect };
