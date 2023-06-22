const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ocr', 'postgres', 'aspire@123', {
    host: '192.168.2.108',
    dialect: 'postgres',
});

module.exports = sequelize;
