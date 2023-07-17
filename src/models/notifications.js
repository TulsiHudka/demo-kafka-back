// models/Notification.js
const { DataTypes } = require('sequelize');
const { v4: uuidv4 } = require('uuid');
const sequelize = require('../db/conn');

const Notifications = sequelize.define('Notification', {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => uuidv4()
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
