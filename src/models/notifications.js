// models/Notification.js
const { DataTypes } = require('sequelize');
const sequelize = require('../db/conn');

const Notifications = sequelize.define('Notification', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_by: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.ENUM('read', 'unread'),
        allowNull: false,
        defaultValue: 'unread',
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
}, {
    tableName: 'notifications',
    timestamps: false
});
Notifications.sync()

module.exports = Notifications;
