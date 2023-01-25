'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Repost extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Repost.belongsTo(models.User, {
        foreignKey: 'userID'
      })
      Repost.belongsTo(models.Post, {
        foreignKey: 'postID'
      })
    }
  }
  Repost.init({
    userID: DataTypes.INTEGER,
    postID: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Repost',
  });
  return Repost;
};