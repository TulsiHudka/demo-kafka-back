const { DataTypes, Sequelize, UUIDV4 } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../db/conn');

const Requests = sequelize.define('Requests', {
    userId: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    processId: {
        type: DataTypes.TEXT,
        allowNull: UUIDV4
        // primaryKey: true
    },
    status: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    result: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
}, {
    tableName: 'requests', // Replace 'your_table_name' with your actual table name
    timestamps: false, // Set this to false if you don't want Sequelize to manage timestamps
});

// Requests.sync({ force: true })

module.exports = Requests;
