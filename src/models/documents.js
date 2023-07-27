const { DataTypes } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const db = require("../db/conn");

const Document = db.define(
  "documents",
  {
    invoice_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    document_name: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    document_url: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("completed", "pending", "failed"),
      allowNull: false,
    },
    uploaded: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    exported: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    validated: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // created_at: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // },
    // updated_at: {
    //   type: DataTypes.DATE,
    //   defaultValue: DataTypes.NOW,
    // },
    requested_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "documents",
  }
);
Document.sync();

module.exports = Document;
