const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const socket_ids = sequelize.define('socket_ids', {
    socket_id: {
        type: DataTypes.TEXT,
        allowNull: false,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false
    }
}, {
    tableName: 'socket_ids',
    timestamps: false
});
socket_ids.sync()
module.exports = socket_ids;
