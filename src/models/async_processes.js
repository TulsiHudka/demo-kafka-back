const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Async_processes = sequelize.define('async_processes', {
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    process_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    status: {
        type: DataTypes.STRING,
        allowNull: true
    },
    response: {
        type: DataTypes.JSONB,
        allowNull: true,
    },
}, {
    tableName: 'async_processes',
    timestamps: false
});
Async_processes.sync()
module.exports = Async_processes;
