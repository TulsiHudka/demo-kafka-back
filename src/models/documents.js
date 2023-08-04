const { DataTypes } = require("sequelize");
const { sequelize } = require("../../datasource");

const Document = sequelize.define(
  "documents",
  {
    invoice_id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    document_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    document_url: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: true,
    },
    mapped_result: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
    requested_by: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "documents",
    paranoid: true,
  }
);

Document.sync();

module.exports = Document;
