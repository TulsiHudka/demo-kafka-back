const { DataTypes, Sequelize, UUIDV4 } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../db/conn');

const Async_processes = sequelize.define('async_processes', {
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    processId: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "pending",
        allowNull: true
    },
    response: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    tableName: 'async_processes', // Replace 'your_table_name' with your actual table name
    timestamps: false, // Set this to false if you don't want Sequelize to manage timestamps
});

Async_processes.sync()

module.exports = Async_processes;
