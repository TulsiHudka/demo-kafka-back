const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const db = require("../db/conn");
const Document = require("../models/documents");

const Task = db.define(
  "tasks",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: uuidv4(),
    },
    process_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    invoice_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    result: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    requested_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "tasks",
  }
);
Task.sync();

module.exports = Task;
