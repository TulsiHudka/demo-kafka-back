'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  tasks.init({
    id: DataTypes.UUID,
    process_id: DataTypes.UUID,
    invoice_id: DataTypes.UUID,
    result: DataTypes.JSONB,
    requested_by: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'tasks',
  });
  return tasks;
};